import aio_pika
import asyncio
import json
from core.config import settings
from crud.slot import QueueManager, check_availability
from core.database import queue, availability_collection

# RabbitMQ Configuration
RABBITMQ_URL = settings.rabbitmq_url
QUEUE_NAME = "queue_manager"
UPDATE_EXCHANGE = "queue_updates"

# Dictionary to hold QueueManager instances per doctor_id
queue_managers = {}

async def publish_update(channel, doctor_id, update):
    """
    Publishes an update to the queue_updates exchange with the routing key as doctor_id.
    """
    exchange = await channel.declare_exchange(UPDATE_EXCHANGE, aio_pika.ExchangeType.DIRECT, durable=True)
    message = aio_pika.Message(
        body=json.dumps({
            "doctor_id": doctor_id,
            "update": update
        }).encode(),
        delivery_mode=aio_pika.DeliveryMode.PERSISTENT
    )
    await exchange.publish(
        message,
        routing_key=doctor_id  # Routing key is doctor_id for targeted updates
    )
    print(f"Published update for doctor {doctor_id}")

async def on_message(message: aio_pika.IncomingMessage, channel):
    async with message.process():
        try:
            body = message.body.decode()
            data = json.loads(body)
            action = data.get("action")
            payload = data.get("data")
            doctor_id = payload.get("doctor_id")

            if action == "set_availability":
                await check_availability(payload)
                update = {"action": "set_availability", "data": payload}
                await publish_update(channel, doctor_id, update)
                print(f"Set availability for doctor {doctor_id}")

            elif action == "add_to_queue":
                patient_name = payload.get("patient_name")
                contact_number = payload.get("contact_number")
                time_slot = payload.get("time_slot")

                # Initialize QueueManager for the doctor if not exists
                if doctor_id not in queue_managers:
                    doctor_availability = await availability_collection.find_one({"doctor_id": doctor_id})
                    avg_consultation_time = doctor_availability.get("avg_consultation_time", 10) if doctor_availability else 10
                    queue_managers[doctor_id] = QueueManager(avg_consultation_time=avg_consultation_time)

                queue_manager = queue_managers[doctor_id]
                slot = await queue_manager.add_to_queue(doctor_id, patient_name, contact_number, time_slot)

                # After adding to queue, publish the updated queue status
                queue_status = await queue_manager.get_queue_status(doctor_id)
                update = {"action": "add_to_queue", "data": queue_status}
                await publish_update(channel, doctor_id, update)
                print(f"Added patient {patient_name} to doctor {doctor_id}'s queue")

            elif action == "next_patient":
                # Initialize QueueManager for the doctor if not exists
                if doctor_id not in queue_managers:
                    doctor_availability = await availability_collection.find_one({"doctor_id": doctor_id})
                    avg_consultation_time = doctor_availability.get("avg_consultation_time", 10) if doctor_availability else 10
                    queue_managers[doctor_id] = QueueManager(avg_consultation_time=avg_consultation_time)

                queue_manager = queue_managers[doctor_id]
                await queue_manager.next_patient(doctor_id)

                # After moving to next patient, publish the updated queue status
                queue_status = await queue_manager.get_queue_status(doctor_id)
                update = {"action": "next_patient", "data": queue_status}
                await publish_update(channel, doctor_id, update)
                print(f"Moved to next patient in doctor {doctor_id}'s queue")
            
            elif action == "cancel_appointment":
                contact_number = payload.get("contact_number")

                if doctor_id not in queue_managers:
                    doctor_availability = await availability_collection.find_one({"doctor_id": doctor_id})
                    avg_consultation_time = doctor_availability.get("avg_consultation_time", 10) if doctor_availability else 10
                    queue_managers[doctor_id] = QueueManager(avg_consultation_time=avg_consultation_time)

                queue_manager = queue_managers[doctor_id]
                
                cancellation_result = await queue_manager.cancel_appointment(doctor_id, contact_number)

                queue_status = await queue_manager.get_queue_status(doctor_id)
                update = {
                    "action": "cancel_appointment",
                    "message": cancellation_result["message"],
                    "data": queue_status
                }
                await publish_update(channel, doctor_id, update)
                print(f"Cancelled appointment for patient with contact number {contact_number} in doctor {doctor_id}'s queue")

            else:
                print(f"Unknown action: {action}")

        except Exception as e:
            print(f"Error processing message: {e}")

        

async def main():
    # Connect to RabbitMQ
    connection = await aio_pika.connect_robust(RABBITMQ_URL)
    channel = await connection.channel()

    # Declare the queue_manager queue
    queue = await channel.declare_queue(QUEUE_NAME, durable=True)

    # Start consuming messages
    await queue.consume(lambda msg: on_message(msg, channel))
    print("Worker started. Waiting for messages...")

    # Keep the worker running
    try:
        await asyncio.Future()
    finally:
        await connection.close()

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.create_task(main())
    loop.run_forever()

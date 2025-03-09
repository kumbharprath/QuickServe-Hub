from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException 
from models.slot import DoctorAvailability, Patient
from core.config import settings
from core.database import availability_collection, queue
import aio_pika
import json
import asyncio

router = APIRouter()

RABBITMQ_URL = settings.rabbitmq_url
QUEUE_NAME = "queue_manager"
UPDATE_EXCHANGE = "queue_updates"

# RabbitMQ Connection (singleton)
class RabbitMQConnection:
    _connection = None
    _channel = None

    @classmethod
    async def get_connection(cls):
        if not cls._connection:
            cls._connection = await aio_pika.connect_robust(RABBITMQ_URL)
            cls._channel = await cls._connection.channel()
            await cls._channel.declare_queue(QUEUE_NAME, durable=True)
        return cls._channel

async def publish_message(message: dict):
    channel = await RabbitMQConnection.get_connection()
    await channel.default_exchange.publish(
        aio_pika.Message(
            body=json.dumps(message).encode(),
            delivery_mode=aio_pika.DeliveryMode.PERSISTENT
        ),
        routing_key=QUEUE_NAME
    )

@router.post("/doctors/{doctor_id}/availability/")
async def set_doctor_availability(doctor_id: str, availability: DoctorAvailability):
    try:
        availability_dict = {
            "doctor_id": doctor_id,
            "day": availability.day,
            "time_slots": availability.time_slots,
            "Available": availability.Available,
            "max_patients": availability.max_patients,
            "avg_consultation_time": availability.avg_consultation_time 
        }

        message = {
            "action": "set_availability",
            "data": availability_dict
        }

        await publish_message(message)
        return {"message": f"Availability set for doctor {doctor_id}"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error setting doctor availability: {str(e)}")

# API to get doctor availability
@router.get("/doctors/{doctor_id}/availability/")
async def get_doctor_availability(doctor_id: str):
    try:
        doctor_availability = await availability_collection.find_one({"doctor_id": doctor_id})
      
        if doctor_availability:
            if "_id" in doctor_availability:
                doctor_availability["_id"] = str(doctor_availability["_id"])

            return {"doctor_id": doctor_id, "availability": doctor_availability}
        else:
            raise HTTPException(status_code=404, detail=f"Availability not found for doctor {doctor_id}")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching doctor availability: {str(e)}")

# API for patient to join the queue
@router.post("/doctors/{doctor_id}/queue/join/")
async def join_queue(doctor_id: str, patient: Patient):
    try:
        message = {
            "action": "add_to_queue",
            "data": {
                "doctor_id": doctor_id,
                "patient_name": patient.patient_name,
                "contact_number": patient.contact_number,
                "time_slot": patient.time_slot
            }
        }

        await publish_message(message)
        return {"message": f"Patient {patient.patient_name} added to queue", "contact_number": patient.contact_number}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding patient to queue: {str(e)}")

@router.get("/get_appointment_details/{service_id}")
async def get_details(service_id:str, contact_number: int):
    try:
        result = await queue.find_one({"doctor_id": service_id, "contact_number": contact_number})
        if result:
            result["_id"] = str(result["_id"])
            print(result)
            return result

        raise HTTPException(status_code=404, detail="Appointment not found")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/doctors/{doctor_id}/queue/cancel/")
async def cancel_appointment(doctor_id: str, contact_number: int):
    try:
        message = {
            "action": "cancel_appointment",
            "data": {
                "doctor_id": doctor_id,
                "contact_number": contact_number
            }
        }

        await publish_message(message)
        return {"message": f"Cancellation request sent for contact number {contact_number}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending cancellation request: {str(e)}")

@router.post("/doctors/{service_id}/time_slots/")
async def get_time_slots(service_id: str):
    try:
        result = await availability_collection.find_one({"doctor_id": service_id})
        if result:
            result["_id"] = str(result["_id"])
            print(result)
            return result
    except Exception as e:
        raise HTTPException(status_code=500, detail={str(e)})


# Get current queue status
@router.get("/doctors/{doctor_id}/queue/")
async def get_queue_status(doctor_id: str):
    try:
        patients = await queue.find({"doctor_id": doctor_id}).sort("queue_position", 1).to_list(None)
        for patient in patients:
            patient["_id"] = str(patient["_id"])
        return {"queue": patients}
    #     cursor = self.db.find({"doctor_id": doctor_id}, {
    #             "patient_name": 1,
    #             "queue_position": 1,
    #             "estimated_time": 1
    #         }).sort("queue_position", 1).to_list(None)

    #     async for patient in cursor:
    #         yield QueueSlot(
    #             patient_name=patient["patient_name"],
    #             queue_position=patient["queue_position"],
    #             estimated_time=patient["estimated_time"]
    #         )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving queue status: {str(e)}")

# Doctor moves to the next patient
@router.post("/doctors/{doctor_id}/queue/next/")
async def move_to_next_patient(doctor_id: str):
    try:
        message = {
            "action": "next_patient",
            "data": {
                "doctor_id": doctor_id
            }
        }

        await publish_message(message)
        return {"message": "Moved to the next patient"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error moving to the next patient: {str(e)}")

# WebSocket for real-time queue updates
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, doctor_id: str):
        await websocket.accept()
        if doctor_id not in self.active_connections:
            self.active_connections[doctor_id] = []
        self.active_connections[doctor_id].append(websocket)

    def disconnect(self, websocket: WebSocket, doctor_id: str):
        self.active_connections[doctor_id].remove(websocket)
        if not self.active_connections[doctor_id]:
            del self.active_connections[doctor_id]

    async def send_update(self, doctor_id: str, message: dict):
        connections = self.active_connections.get(doctor_id, [])
        for connection in connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error sending message to connection: {str(e)}")

manager = ConnectionManager()

async def websocket_consumer(doctor_id: str, websocket: WebSocket):
    """
    Consumes messages from RabbitMQ and sends them to the WebSocket client.
    """
    connection = await aio_pika.connect_robust(RABBITMQ_URL)
    channel = await connection.channel()

    # Declare the exchange
    exchange = await channel.declare_exchange(UPDATE_EXCHANGE, aio_pika.ExchangeType.DIRECT, durable=True)

    # Create a unique queue for this WebSocket connection
    queue_name = f"queue_updates_{doctor_id}_{id(websocket)}"
    result = await channel.declare_queue(queue_name, exclusive=True)
    await result.bind(exchange, routing_key=doctor_id)

    async with result.iterator() as queue_iter:
        async for message in queue_iter:
            async with message.process():
                body = message.body.decode()
                data = json.loads(body)
                await websocket.send_json(data)
                # Optionally, acknowledge the message here if not auto-ack

@router.websocket("/doctors/{doctor_id}/queue/ws/")
async def queue_updates(websocket: WebSocket, doctor_id: str):
    await manager.connect(websocket, doctor_id)
    consumer = asyncio.create_task(websocket_consumer(doctor_id, websocket))
    try:
        while True:
            # Keep the connection open by waiting for messages (even if not used)
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, doctor_id)
        consumer.cancel()
    except Exception as e:
        print(f"Error during WebSocket connection: {str(e)}")
        manager.disconnect(websocket, doctor_id)
        consumer.cancel()

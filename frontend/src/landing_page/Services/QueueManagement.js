import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form } from 'react-bootstrap';

const QueueManagement = () => {
  const { doctor_id } = useParams();
  const [queue, setQueue] = useState([]);
  const [wsConnection, setWsConnection] = useState(null);
  const [error, setError] = useState(null);

  // Modal state for availability
  const [showModal, setShowModal] = useState(false);
  const [availability, setAvailability] = useState({
    day: '',
    time_slots: [],
    Available: true,
    max_patients: '',
    avg_consultation_time: '',
  });

  const fetchQueueStatus = async () => {
    try {
      const response = await fetch(`http://localhost:8000/doctors/${doctor_id}/queue/`);
      const data = await response.json();
      if (response.ok) {
        setQueue(data.queue);
      } else {
        setError(data.detail || "Failed to fetch queue status");
      }
    } catch (err) {
      setError("Failed to fetch queue status");
    }
  };

  // WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/doctors/${doctor_id}/queue/ws/`);
    

    ws.onopen = () => {
        console.log("WebSocket connection established");
        setWsConnection(ws);
    };

    ws.onmessage = (event) => {
        const update = JSON.parse(event.data);
        console.log("Received WebSocket update:", update);
        fetchQueueStatus();
      };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("WebSocket connection error");
    };

    ws.onclose = () => {
        console.log("WebSocket connection closed");
        setWsConnection(null);
      };

    return () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    }, [doctor_id]);


  // Function to move to the next patient in the queue
  const moveToNextPatient = async () => {
    try {
      const response = await fetch(`http://localhost:8000/doctors/${doctor_id}/queue/next/`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        fetchQueueStatus();
      } else {
        setError(data.detail || "Failed to move to the next patient");
      }
    } catch (err) {
      setError("Failed to move to the next patient");
    }
  };

  // Function to set doctor availability
const setDoctorAvailability = async (e) => {
    e.preventDefault();

    const Availability_data = {
        day: availability.day,
        time_slots: availability.time_slots, // Ensure this is an array
        Available: true, // Add this if you have logic for availability
        max_patients: availability.max_patients,
        avg_consultation_time: availability.avg_consultation_time,
      };

    try {
      const response = await fetch(`http://localhost:8000/doctors/${doctor_id}/availability/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Availability_data),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Availability set successfully!");
        setShowModal(false);
      } else {
        // Convert the error response to a readable string if it's an object
        const errorMsg = Array.isArray(data.detail)
          ? data.detail.map((err) => err.msg).join(", ") // Assuming `msg` contains the error message
          : data.detail || "Failed to set availability";
        setError(errorMsg);
      }
    } catch (err) {
      setError("Failed to set availability");
    }
  };
  

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Manage Appointments</h2>
      
      {error && <p className="text-danger">{error}</p>}
      
      {/* Button to open availability modal */}
      <div className="d-flex justify-content-center mb-3">
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Set Availability
        </Button>
      </div>

      {/* Modal for setting availability */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Set Doctor Availability</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={setDoctorAvailability}>
            <Form.Group controlId="formDay">
              <Form.Label>Day</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter day (e.g., Monday)"
                value={availability.day}
                onChange={(e) => setAvailability({ ...availability, day: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formTimeSlots" className="mt-3">
            <Form.Label>Time Slots (comma-separated)</Form.Label>
            <Form.Control
                type="text"
                placeholder="e.g., 9:00 AM, 10:00 AM"
                value={Array.isArray(availability.time_slots) ? availability.time_slots.join(', ') : ''}
                onChange={(e) => setAvailability({ ...availability, time_slots: e.target.value.split(',').map(slot => slot.trim()) })}
                required
            />
            </Form.Group>
            <Form.Group controlId="formMaxPatients" className="mt-3">
              <Form.Label>Max Patients per Slot</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter max patients"
                value={availability.max_patients}
                onChange={(e) => setAvailability({ ...availability, max_patients: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formConsultationTime" className="mt-3">
              <Form.Label>Avg. Consultation Time (mins)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter avg consultation time"
                value={availability.avg_consultation_time}
                onChange={(e) => setAvailability({ ...availability, avg_consultation_time: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4 w-100">
              Save Availability
            </Button>
          </Form>
        </Modal.Body>
      </Modal>


      {/* Button to move to the next patient */}
      <div className="mb-4 text-center">
        <Button variant="success" onClick={moveToNextPatient}>
          Move to Next Patient
        </Button>
      </div>
      
      {/* Queue list */}
      <div className="card shadow-lg p-4">
        <h4 className="text-center mb-4">Current Patient Queue</h4>
        <ul className="list-group">
          {queue.length > 0 ? (
            queue.map((patient, index) => (
              <li key={patient._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{patient.patient_name}</h5>
                  <small className="text-muted">Contact: {patient.contact_number}</small>
                  <div><strong>Estimated Time:</strong> {patient.estimated_time} mins</div>
                </div>
                <span className="badge bg-info text-dark">Position {index + 1}</span>
              </li>
            ))
          ) : (
            <p className="text-center">No patients in the queue</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default QueueManagement;

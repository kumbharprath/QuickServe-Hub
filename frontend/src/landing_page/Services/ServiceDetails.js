import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const ServiceDetails = () => {
  const { service_id } = useParams();
  const [serviceDetails, setServiceDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [mapUrl, setMapUrl] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    name: '',
    comment: '',
    rating: 1,
  });
  // appointment feature
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [slotFormData, setSlotFormData] = useState({
    patient_name: '',
    contact_number: '',
    time_slot: '',
  });
  const [contactNumber, setContactNumber] = useState(localStorage.getItem('contactNumber') || '');
  const [contactError, setContactError] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, reviewsRes, ratingRes, mapRes, timeSlotsRes, appointmentRes, availabilityRes] = await Promise.all([
          fetch(`http://localhost:8000/service-provider/${service_id}`),
          fetch(`http://localhost:8000/service-providers/${service_id}/reviews/`),
          fetch(`http://localhost:8000/service-providers/${service_id}/average-rating/`),
          fetch(`http://localhost:8000/service-providers/${service_id}/map`),
          fetch(`http://localhost:8000/doctors/${service_id}/time_slots/`, { method: 'POST', headers: { 'Content-Type': 'application/json' } }),
          contactNumber ? fetch(`http://localhost:8000/get_appointment_details/${service_id}?contact_number=${contactNumber}`) : Promise.resolve(null),
          fetch(`http://localhost:8000/doctors/${service_id}/availability/`)
        ]);

        const serviceData = await serviceRes.json();
        const reviewsData = await reviewsRes.json();
        const ratingData = await ratingRes.json();
        const mapData = await mapRes.json();
        const timeSlotsData = await timeSlotsRes.json();
        const availabilityData = await availabilityRes.json();

        setServiceDetails({
          ...serviceData,
          profile_image: {
            ...serviceData.profile_image,
            image_id: serviceData.profile_image.image_id,
          },
          office_images: serviceData.office_images.map((image) => ({
            ...image,
            image_id: image.image_id,
          })),
        });
        setReviews(reviewsData);
        setAverageRating(ratingData.average_rating);
        setMapUrl(mapData.map_url);
        setTimeSlots(timeSlotsData.time_slots);
        setIsAvailable(availabilityData?.availability?.Available ?? false);

        if (appointmentRes && appointmentRes.ok) {
          const appointmentData = await appointmentRes.json();
          console.log('Fetched Appointment:', appointmentData); // Debugging: Check what's returned
          setAppointmentDetails([appointmentData]); // Wrap in array for consistent rendering
        } else {
          console.error('No appointments found for this contact number');
          setAppointmentDetails([]); // Clear appointments if not found
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [service_id, contactNumber]);

  const handleGetDirections = () => {
    window.open(mapUrl, '_blank');
  };

  const handleReviewFormChange = (e) => {
    const { name, value } = e.target;
    setReviewFormData({ ...reviewFormData, [name]: value });
  };

  // Handle form input changes
  const handleSlotFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "contact_number") {
      // Only allow digits, check length
      if (!/^\d*$/.test(value)) {
        setContactError('Contact number must contain only digits');
        return;
      } else if (value.length === 10) {
        setContactError('Contact number must be between 10 and 15 digits');
      } else {
        setContactError(''); // Clear error if valid
      }
    }
    setSlotFormData({ ...slotFormData, [name]: value });
  };

  const handleReviewFormSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      ...reviewFormData,
      service_id,
      rating: parseFloat(reviewFormData.rating), // Ensure rating is a float
    };
    try {
      const response = await fetch(`http://localhost:8000/service-providers/${service_id}/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews([...reviews, { ...reviewFormData, _id: newReview.review_id }]); // Update reviews state with the new review
        setReviewFormData({ name: '', comment: '', rating: 1 }); // Reset form fields
        setShowReviewModal(false);
        setAverageRating(); // Update average rating
      } else {
        console.error('Failed to add review');
      }
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  // const handleDeleteReview = async (reviewId) => {
  //   try {
  //     const response = await fetch(`http://localhost:8000/service-providers/${reviewId}/reviews/`, {
  //       method: 'DELETE',
  //     });

  //     if (response.ok) {
  //       setReviews(reviews.filter((review) => review._id !== reviewId)); // Remove deleted review from the state
  //       setAverageRating(); // Update average rating
  //     } else {
  //       console.error('Failed to delete review');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting review:', error);
  //   }
  // };

  if (!serviceDetails) {
    return <p>Loading...</p>;
  }

  // Handle booking an appointment
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      // Book the appointment
      const response = await fetch(`http://localhost:8000/doctors/${service_id}/queue/join/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotFormData),
      });

      if (response.ok) {
        const data = await response.json();
        const contact = data.contact_number;

        setContactNumber(contact); // Update contact number in state
        localStorage.setItem('contactNumber', contact);
        setShowAppointmentModal(false);
        setSlotFormData({ patient_name: '', contact_number: '', time_slot: '' }); // Close the form on successful booking
      } else {
        console.error('Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };
  
  
  
   // Handle appointment cancellation
   const handleCancelAppointment = async (contact) => {
    try {
      const response = await fetch(`http://localhost:8000/doctors/${service_id}/queue/cancel/?contact_number=${contactNumber}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        localStorage.removeItem('contactNumber');
        setAppointmentDetails(null);
      } else {
        console.error('Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };


  return (
    <div className="container my-5">

<style>
        {`
          .profile-img {
            max-height: 300px;
            object-fit: cover;
            border-radius: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }

          .card {
            border-radius: 10px;
            border: none;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .card-title {
            color: #007bff;
            font-size: 1.5rem;
          }

          .service-info p {
            font-size: 1.1rem;
            line-height: 1.5;
            color: #555;
          }

          .availability {
            color: ${isAvailable ? 'green' : 'red'};
            font-size: 1.3rem;
          }

          .button-group {
            display: flex;
            justify-content: center;
            gap: 10px;
          }

          .office-images img {
            max-height: 200px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .review-list .list-group-item {
            border: none;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
          }

          .appointments .card {
            border: none;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .modal-header {
            background-color: #007bff;
            color: #fff;
          }

          .form-label {
            font-weight: bold;
            color: #333;
          }

          .btn-primary, .btn-success, .btn-danger, .btn-outline-primary {
            border-radius: 20px;
            padding: 0.5rem 1.5rem;
          }

          .btn-primary {
            background-color: #007bff;
            border: none;
          }

          .btn-success {
            background-color: #28a745;
            border: none;
          }

          .btn-danger {
            background-color: #dc3545;
            border: none;
          }

          .btn-outline-primary {
            color: #007bff;
            border: 1px solid #007bff;
          }
        `}
      </style>

    {serviceDetails ? (
      <>
        <div className="text-center">
          <h2 className="text-primary">{serviceDetails.name}</h2>
          {serviceDetails.profile_image && serviceDetails.profile_image.image_data && (
            <img
              src={serviceDetails.profile_image.image_data}
              alt={serviceDetails.name}
              className="img-fluid rounded mb-4 shadow-sm"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
              data-image-id={serviceDetails.profile_image.image_id}
            />
          )}
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <p><strong>Service Offered:</strong> {serviceDetails.service_offered}</p>
            <p><strong>Description:</strong> {serviceDetails.description}</p>
            <p className="text-center">
              <strong>Availability:</strong> 
              <span style={{ color: isAvailable ? 'green' : 'red', fontSize: '1.2rem', marginLeft: '8px' }}>●</span>
              {isAvailable ? ' Open' : ' Closed'}
            </p>
            <p><strong>Address:</strong> {serviceDetails.address}, {serviceDetails.district}, {serviceDetails.state} - {serviceDetails.zip_code}</p>
            <p><strong>Phone:</strong> {serviceDetails.phone_number}</p>
            <p><strong>Email:</strong> <a href={`mailto:${serviceDetails.email}`}>{serviceDetails.email}</a></p>
            <p><strong>Operating Hours:</strong> {serviceDetails.operating_hours}</p>
            <p><strong>Website:</strong> <a href={serviceDetails.website} target="_blank" rel="noopener noreferrer">{serviceDetails.website}</a></p>
            <p><strong>Average Rating:</strong> {averageRating ? `${averageRating} ★` : 'No ratings yet'}</p>
          </div>
        </div>

        <div className="d-flex justify-content-center mb-4">
          <Button className="me-2" variant="primary" onClick={handleGetDirections}>Get Directions</Button>
          <Button variant="success" onClick={() => setShowAppointmentModal(true)}>Book Appointment</Button>
        </div>

        <div className="mb-4">
          <h4>Office Images</h4>
          <div className="row">
            {serviceDetails.office_images && serviceDetails.office_images.length > 0 ? (
              serviceDetails.office_images.map((image) => (
                <div className="col-md-4 mb-3" key={image.image_id}>
                  <img
                    src={image.image_data}
                    alt="Office Image"
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                    data-image-id={image.image_id}
                  />
                </div>
              ))
            ) : (
              <p>No office images available.</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h4>Reviews</h4>
          {reviews && reviews.length > 0 ? (
            <div className="list-group">
              {reviews.map((review, index) => (
                <div key={index} className="list-group-item shadow-sm mb-3">
                  <strong>Rating: {review.rating} ★</strong>
                  <p>{review.comment}</p>
                  <small className="text-muted">By {review.name}</small>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet.</p>
          )}
          <Button variant="outline-primary mt-3" onClick={() => setShowReviewModal(true)}>Add Review</Button>
        </div>

        <div className="appointments mt-4">
          <h4>Appointments</h4>
          {appointmentDetails && appointmentDetails.length > 0 ? (
            appointmentDetails.map((appointment, index) => (
              <div key={index} className="appointment-detail card p-3 mb-3 shadow-sm">
                <p><strong>Patient Name:</strong> {appointment.patient_name}</p>
                <p><strong>Contact Number:</strong> {appointment.contact_number}</p>
                <p><strong>Time Slot:</strong> {appointment.time_slot}</p>
              </div>
            ))
          ) : (
            <p>No Appointments yet.</p>
          )}
          <Button variant="danger" onClick={() => handleCancelAppointment(contactNumber)}>Clear Appointments</Button>
        </div>

        {/* Review Modal */}
        <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleReviewFormSubmit}>
              <div className="mb-3">
                <label className="form-label">Your Name</label>
                <input type="text" className="form-control" name="name" value={reviewFormData.name} onChange={handleReviewFormChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Your Review</label>
                <textarea className="form-control" name="comment" rows="3" value={reviewFormData.comment} onChange={handleReviewFormChange} required></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <select className="form-select" name="rating" value={reviewFormData.rating} onChange={handleReviewFormChange} required>
                  {[1, 2, 3, 4, 5].map((num) => <option key={num} value={num}>{num}</option>)}
                </select>
              </div>
              <Button type="submit" variant="primary">Submit Review</Button>
            </form>
          </Modal.Body>
        </Modal>

        {/* Appointment Modal */}
        <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Book Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAppointmentSubmit}>
              <div className="mb-3">
                <label>Patient Name</label>
                <input type="text" name="patient_name" className="form-control" value={slotFormData.patient_name} onChange={handleSlotFormChange} required />
              </div>
              <div className="mb-3">
                <label>Contact Number</label>
                <input type="text" name="contact_number" className="form-control" value={slotFormData.contact_number} onChange={handleSlotFormChange} required />
                {contactError && <small className="text-danger">{contactError}</small>}
              </div>
              <div className="mb-3">
                <label>Time Slot</label>
                <select name="time_slot" className="form-select" value={slotFormData.time_slot} onChange={handleSlotFormChange} required>
                  <option value="">Select a time slot</option>
                  {timeSlots && timeSlots.length > 0 ? (
                    timeSlots.map((slot, index) => <option key={index} value={slot}>{slot}</option>)
                  ) : (
                    <option value="" disabled>No time slots available</option>
                  )}
                </select>
              </div>
              <Button type="submit" variant="primary">Book Appointment</Button>
            </form>
          </Modal.Body>
        </Modal>
      </>
    ) : (
      <p>Loading...</p>
    )}
  </div>
  );
  
};

export default ServiceDetails;

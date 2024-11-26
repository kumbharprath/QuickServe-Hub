import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Service = () => {
  const [services, setServices] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [selectedDistance, setSelectedDistance] = useState(5);
  const navigate = useNavigate();

  // Fetch services from backend

  const fetchServices = async (latitude = null, longitude = null, distance = null) => {
    try {
      const queryParams = new URLSearchParams();

      // Add location and distance parameters if provided
      if (latitude && longitude && distance) {
        queryParams.append("user_lat", latitude);
        queryParams.append("user_lng", longitude);
        queryParams.append("max_distance_km", distance);
      }

      const response = await fetch(`http://localhost:8000/service-providers?${queryParams.toString()}`); // Replace with your FastAPI endpoint
      const data = await response.json();
      const servicesWithRatings = await Promise.all(
        data.map(async (service) => {
          // Fetch ratings for each service provider
          const ratingResponse = await fetch(`http://localhost:8000/service-providers/${service._id}/average-rating/`);
          const ratingData = await ratingResponse.json();
          const rating = ratingData.average_rating !== undefined ? ratingData.average_rating : null;
          // Fetch doctor availability for each service provider
          const availabilityResponse = await fetch(`http://localhost:8000/doctors/${service._id}/availability/`);
          const availabilityData = await availabilityResponse.json();
          const isAvailable = availabilityData.availability ? availabilityData.availability.Available : false;
          return { ...service, rating, isAvailable};
        })
      );
      setServices(servicesWithRatings);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle "Nearby Services" click
  const handleNearbyServicesClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchServices(latitude, longitude, selectedDistance);
        },
        (error) => {
          console.error("Error retrieving user's location:", error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  // Handle card click to navigate to the service details page
  const handleCardClick = (serviceId) => {
    navigate(`/service/${serviceId}`); // Navigate to the service details page using the service _id
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // Check if token exists

    try {
      const response = await fetch(`http://localhost:8000/logout/${token}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token from local storage
        },
      });
      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('contactNumber');
        navigate('/signup');
      } else {
        // Handle error response
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Helper function to render stars based on the rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <span className="text-warning">
        {'★'.repeat(fullStars)}
        {halfStar ? '☆' : ''}
        {'☆'.repeat(emptyStars)}
      </span>
    );
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-5">Available Services</h2>

      {/* Filter Block */}
      <div className="d-flex justify-content-center mb-4">
        <select
          value={selectedDistance}
          onChange={(e) => setSelectedDistance(parseInt(e.target.value))}
          className="form-select me-3"
          style={{ width: '120px' }}
        >
          {[5, 10, 15, 20, 25, 30].map((distance) => (
            <option key={distance} value={distance}>
              {distance} KM
            </option>
          ))}
        </select>
        <button onClick={handleNearbyServicesClick} className="btn btn-primary">
          Nearby Services
        </button>
      </div>

      <div className="row">
        {services.map(service => (
          <div key={service._id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={service.profile_image && service.profile_image.image_data ? service.profile_image.image_data : 'default_profile.jpg'}
                className="card-img-top"
                alt={service.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{service.name}</h5>
                <p className="card-text text-muted">{service.service_offered}</p>
                <p className="card-text text-muted small">
                  <i className="fas fa-map-marker-alt"></i> {service.address}
                </p>
                
                {/* Display the phone number */}
                <p className="card-text text-muted">
                  <strong>Phone:</strong> {service.phone_number}
                </p>
                
                {/* Display operating hours */}
                <p className="card-text text-muted">
                  <strong>Operating Hours:</strong> {service.operating_hours}
                </p>

                {/* Display ratings */}
                <p className="card-text">
                  {service.rating ? (
                    <>
                      <strong>Rating:</strong> {renderStars(service.rating)} ({service.rating.toFixed(1)})
                    </>
                  ) : (
                    <span>No ratings yet</span>
                  )}
                </p>

                {/* Availability Indicator */}
                <p className="card-text">
                  <strong>Availability:</strong>
                  <span style={{ color: service.isAvailable ? 'green' : 'red', fontSize: '1.2rem', marginLeft: '8px' }}>
                    ●
                  </span>
                  {service.isAvailable ? ' Open' : ' Closed'}
                </p>

                <button
                  onClick={() => handleCardClick(service._id)}
                  className="btn btn-primary mt-auto"
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
    
  );
};

export default Service;

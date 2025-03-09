import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceDetails = () => {
  const [ service_id, setServiceId] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [mapUrl, setMapUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({
    name: '',
    service_offered: '',
    description: '',
    address: '',
    district: '',
    state: '',
    zip_code: '',
    phone_number: '',
    email: '',
    operating_hours: '',
    website: '',
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [officeImageFiles, setOfficeImageFiles] = useState([]);
  const [adharImageFile, setAdharImageFile] = useState(null);
  const navigate = useNavigate();
 
  const addOfficeImageField = () => {
    setOfficeImageFiles(prevFiles => [...prevFiles, null]); // Adds a new entry to the array
  };

  useEffect(() => {
    const fetchServiceIdFromToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signup'); // Redirect to login if no token is found
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:8000/user/${token}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        
        const userData = await response.json();
        setServiceId(userData._id);
      } catch (error) {
        console.error("Error fetching service ID from token:", error);
        navigate('/signup');
      }
    };

    fetchServiceIdFromToken();
  }, [navigate]);

  const handleStartQueue = () => {
    navigate(`/service-provider/queue/${service_id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!service_id) return; // Only fetch data once `service_id` is set
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        const [serviceRes, reviewsRes, ratingRes, mapRes] = await Promise.all([
          fetch(`http://localhost:8000/service-provider/${service_id}`, { headers }),
          fetch(`http://localhost:8000/service-providers/${service_id}/reviews/`, { headers }),
          fetch(`http://localhost:8000/service-providers/${service_id}/average-rating/`, { headers }),
          fetch(`http://localhost:8000/service-providers/${service_id}/map`),
        ]);

        const serviceData = await serviceRes.json();
        const reviewsData = await reviewsRes.json();
        const ratingData = await ratingRes.json();
        const mapData = await mapRes.json();

        setServiceDetails({
          ...serviceData,
          profile_image: serviceData.profile_image
          ? {
            ...serviceData.profile_image,
            image_id: serviceData.profile_image.image_id,
          }
          : null,
          adhar_image: serviceData.adhar_card_image ? {
            ...serviceData.adhar_card_image,
            image_id: serviceData.adhar_card_image.image_id,
          } : null,
          office_images: Array.isArray(serviceData.office_images)
          ? serviceData.office_images.map((image) => ({
              ...image,
              image_id: image.image_id,
            }))
          : [],
        });
        setReviews(reviewsData);
        setAverageRating(ratingData.average_rating);
        setMapUrl(mapData.map_url);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [service_id]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const formData = new FormData();

    const payload = {};
    Object.keys(editedDetails).forEach((key) => {
      if (editedDetails[key] && editedDetails[key] !== serviceDetails[key]) {
        payload[key] = editedDetails[key];
      }
    });

    try {
      if (Object.keys(payload).length > 0) {
        await fetch(`http://localhost:8000/update_details/service-providers/${service_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(payload),
        });
      }

      // Update profile image if file selected
      if (profileImageFile) {
        formData.append('profile_image', profileImageFile);

        await fetch(`http://localhost:8000/service-provider/${service_id}/profile-image`, {
          method: 'PUT',
          headers: {
            ...headers, // Only Authorization
        },
          body: formData,
        });
      }

      // Update Aadhar image if file selected
      if (adharImageFile) {
        const adharFormData = new FormData();
        adharFormData.append('adhar_image', adharImageFile);
        await fetch(`http://localhost:8000/service-provider/${service_id}/adhar_image`, {
          method: 'PUT',
          headers: headers,
          body: adharFormData,
        });
      }

      
      if (officeImageFiles.length > 0) {
        
        officeImageFiles.forEach((file) => {
          if (file) {
            formData.append('office_images', file); // Append each file to the FormData
          }
        });

        await fetch(`http://localhost:8000/service-provider/${service_id}/office-images`, {
          method: 'PUT',
          headers: {
            ...headers, // Only Authorization
          },
          body: formData,
        });
      }

      // Refetch the updated details
      setServiceDetails(prevDetails => ({
        ...prevDetails,
        ...editedDetails,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (name === 'profile_image') {
      setProfileImageFile(files[0]);
    } else if (name === 'office_images') {
      // Convert FileList to an array and update the state
      const newOfficeImageFiles = Array.from(files);
      setOfficeImageFiles((prevFiles) => [...prevFiles, ...newOfficeImageFiles]); // Append new files to the existing state
    } else if (name === 'adhar_image') {
      setAdharImageFile(files[0]);
    }
  };


  const handleGetDirections = () => {
    window.open(mapUrl, '_blank');
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
        // Clear token from local storage
        localStorage.removeItem('token');
        // Redirect to signup page
        navigate('/signup');
      } else {
        // Handle error response
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // Check if token exists

    try {
      const response = await fetch(`http://localhost:8000/delete/service-providers/${service_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token from local storage
        },
      });
      if (response.ok) {
        // Clear token from local storage
        localStorage.removeItem('token');
        // Redirect to signup page
        navigate('/signup');
      } else {
        // Handle error response
        console.error('Delete Service failed');
      }
    } catch (error) {
      console.error('Error during service deletion:', error);
    }
  };

  return (
    <div className="container my-5">
      {serviceDetails ? (
        <>
          <h2 className="text-center">{isEditing ? (
            <input
              type="text"
              name="name"
              value={editedDetails.name}
              onChange={handleEditChange}
              className="form-control"
            />
          ) : serviceDetails.name}</h2>

          {isEditing ? (
            <>
              <input
                type="file"
                name="profile_image"
                onChange={handleImageChange}
                className="form-control mb-3"
              />
              {profileImageFile ? (
                <img
                  src={URL.createObjectURL(profileImageFile)}
                  alt="New Profile"
                  className="img-fluid rounded mb-4"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              ) : (
                serviceDetails.profile_image && serviceDetails.profile_image.image_data && (
                  <img
                    src={serviceDetails.profile_image.image_data}
                    alt={`${serviceDetails.name} Profile`}
                    className="img-fluid rounded mb-4"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                  />
                )
              )}
            </>
          ) : (
            serviceDetails.profile_image && serviceDetails.profile_image.image_data && (
              <img
                src={serviceDetails.profile_image.image_data}
                alt={`${serviceDetails.name} Profile`}
                className="img-fluid rounded mb-4"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
                data-image-id={serviceDetails.profile_image.image_id}
              />
            )
          )}


          <p><strong>Service Offered:</strong> {isEditing ? (
            <input
              type="text"
              name="service_offered"
              value={editedDetails.service_offered}
              onChange={handleEditChange}
              className="form-control"
            />
          ) : serviceDetails.service_offered}</p>

          <p><strong>Description:</strong> {isEditing ? (
            <textarea
              name="description"
              value={editedDetails.description}
              onChange={handleEditChange}
              className="form-control"
            />
          ) : serviceDetails.description}</p>

          <p><strong>Address:</strong> {isEditing ? (
            <input
              type="text"
              name="address"
              value={editedDetails.address}
              onChange={handleEditChange}
              className="form-control mb-2"
              placeholder="Street Address"
            />
          ) : serviceDetails.address}</p>

          <p><strong>District:</strong> {isEditing ? (
            <input
              type="text"
              name="district"
              value={editedDetails.district}
              onChange={handleEditChange}
              className="form-control mb-2"
            />
          ) : serviceDetails.district}</p>

          <p><strong>State:</strong> {isEditing ? (
            <input
              type="text"
              name="state"
              value={editedDetails.state}
              onChange={handleEditChange}
              className="form-control mb-2"
            />
          ) : serviceDetails.state}</p>

          <p><strong>Zip Code:</strong> {isEditing ? (
            <input
              type="text"
              name="zip_code"
              value={editedDetails.zip_code}
              onChange={handleEditChange}
              className="form-control mb-2"
            />
          ) : serviceDetails.zip_code}</p>

          <p><strong>Phone:</strong> {isEditing ? (
            <input
              type="text"
              name="phone_number"
              value={editedDetails.phone_number}
              onChange={handleEditChange}
              className="form-control"
            />
          ) : serviceDetails.phone_number}</p>

          <p><strong>Email:</strong> {isEditing ? (
            <input
              type="email"
              name="email"
              value={editedDetails.email}
              onChange={handleEditChange}
              className="form-control"
            />
          ) : <a href={`mailto:${serviceDetails.email}`}>{serviceDetails.email}</a>}</p>

          <p><strong>Operating Hours:</strong> {isEditing ? (
            <input
              type="text"
              name="operating_hours"
              value={editedDetails.operating_hours}
              onChange={handleEditChange}
              className="form-control"
            />
          ) : serviceDetails.operating_hours}</p>

          <p><strong>Website:</strong> {isEditing ? (
            <input
              type="text"
              name="website"
              value={editedDetails.website}
              onChange={handleEditChange}
              className="form-control"
            />
          ) : <a href={serviceDetails.website} target="_blank" rel="noopener noreferrer">{serviceDetails.website}</a>}</p>

          <p><strong>Average Rating:</strong> {averageRating ? `${averageRating} ★` : 'No ratings yet'}</p>

          <h4>Adhar Image</h4>
          {isEditing ? (
            <>
              <input
                type="file"
                name="adhar_image"
                onChange={handleImageChange}
                className="form-control mb-3"
              />
              {adharImageFile ? (
                <img
                  src={URL.createObjectURL(adharImageFile)}
                  alt="New Aadhar Image"
                  className="img-fluid rounded mb-4"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              ) : (
                serviceDetails.adhar_image && serviceDetails.adhar_image.image_data && (
                  <img
                    src={serviceDetails.adhar_image.image_data}
                    alt="Current Aadhar Image"
                    className="img-fluid rounded mb-4"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                  />
                )
              )}
            </>
          ) : (
            serviceDetails.adhar_image && serviceDetails.adhar_image.image_data && (
              <img
                src={serviceDetails.adhar_image.image_data}
                alt="Aadhar Card"
                className="img-fluid rounded mb-4"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
              />
            )
          )}

          <h4>Office Images</h4>
          <div className="row mb-4">
            {isEditing ? (
              <>
                {officeImageFiles.map((file, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <input
                      type="file"
                      name="office_images"
                      multiple
                      onChange={(e) => handleImageChange(e, index)}
                      className="form-control mb-3"
                    />
                    {file && (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview of new office image ${index + 1}`}
                        className="img-fluid rounded"
                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                ))}
                <button type="button" className="btn btn-secondary mt-2" onClick={addOfficeImageField}>
                  Add More
                </button>
              </>
            ) : (
              serviceDetails?.office_images?.map((image, index) => (
                <div key={image.image_id} className="col-md-4 mb-3">
                  <img
                    src={image.image_data}
                    alt={`Office image ${index + 1}`}
                    className="img-fluid rounded"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                    data-image-id={image.image_id}
                  />
                </div>
              ))
            )}
          </div>

          <div className="mb-4">
            {isEditing ? (
              <>
                <button className="btn btn-success" onClick={handleSaveChanges}>Save Changes</button>
                <button className="btn btn-secondary ms-2" onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={handleGetDirections}>Get Directions</button>
                <button className="btn btn-secondary ms-2" onClick={() => setIsEditing(true)}>Edit</button>
              </>
            )}
          </div>

          <h4>Reviews</h4>
          {reviews && reviews.length > 0 ? (
            <div className="list-group mb-4">
              {reviews.map((review, index) => (
                <div key={index} className="list-group-item">
                  <strong>Rating: {review.rating} ★</strong>
                  <p>{review.comment}</p>
                  <p><small>By {review.name}</small></p>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet.</p>
          )}  

          <button onClick={handleStartQueue}>
            Start Queue
          </button>
          <div>
            <button onClick={handleLogout}>Logout</button>
          </div>
          
          <div>
            <button onClick={handleDelete}>Delete Profile</button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
  
    </div>
  );
  
};

export default ServiceDetails;

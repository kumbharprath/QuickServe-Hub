import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import { FaTimes } from 'react-icons/fa'; // Import the close icon from react-icons
import { useNavigate } from 'react-router-dom';


function SignupPage() {
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState('');
  const [showLoginForm, setShowLoginForm] = useState('');
  const [signupFormData, setSignupFormData] = useState({
    name: '',
    service_offered: '',
    description: '',
    address: '',
    district: '',
    state: '',
    zip_code: '',
    latitude: null,
    longitude: null,
    phone_number: '',
    email: '',
    operating_hours: '',
    website: '',
    profile_image: null,
    adhar_card: null,
    office_images: [],
    password: '',
    confirm_password: ''
  });
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [officeImageFields, setOfficeImageFields] = useState([0]);
  const [loginErrors, setLoginErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleLoginClick = () => setShowLoginPopup(true);
  const handleSignupClick = () => setShowSignupPopup(true);
  const handleClosePopup = () => {
    setShowLoginPopup(false);
    setShowSignupPopup(false);
    setShowSignupForm('');
    setShowLoginForm('');
    setShowSuccessMessage(false);
  };

  const handleSignupFormChange = (e, index) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      // Separate logic for single files and multiple office images
      if (name === 'profile_image' || name === 'adhar_card') {
        setSignupFormData((prevData) => ({
          ...prevData,
          [name]: files[0], // Only single file expected here
        }));
      } else if (name === 'office_images') {
        const newOfficeImages = [...signupFormData.office_images];
        newOfficeImages[index] = files[0];
        setSignupFormData((prevData) => ({
          ...prevData,
          office_images: newOfficeImages,
        }));
      }
    } else {
      setSignupFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const addOfficeImageField = () => {
    setOfficeImageFields((prevFields) => [...prevFields, prevFields.length]);
  };

  const handleLoginFormChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  };

  const validateSignupForm = () => {
    const newErrors = {};

    if (showSignupForm === 'serviceProvider') {
      if (!signupFormData.name) newErrors.name = 'Name is required';
      if (!signupFormData.service_offered) newErrors.service_offered = 'Service name is required';
      if (!signupFormData.description) newErrors.description = 'Description is required';
      if (!signupFormData.address) newErrors.address = 'Address is required';
      if (!signupFormData.district) newErrors.district = 'District is required';
      if (!signupFormData.state) newErrors.state = 'State is required';
      if (!signupFormData.zip_code) newErrors.zip_code = 'zip_code is required';
      if (!signupFormData.phone_number) newErrors.phone_number = 'Phone number is required';
      if (!signupFormData.email) newErrors.email = 'Email is required';
      if (!signupFormData.operating_hours) newErrors.operating_hours = 'operating_hours is required';
      if (!signupFormData.website)
      if (!signupFormData.profile_image) newErrors.profile_image = 'Adhar card image is required';
      if (!signupFormData.adhar_card) newErrors.adhar_card = 'Adhar card image is required';
      if (!Array.isArray(signupFormData.office_images) || signupFormData.office_images.length === 0) {
        newErrors.office_images = 'At least one office image is required';
      }
    } 
    else if (showSignupForm === 'user') {
      if (!signupFormData.email) newErrors.email = 'Email is required';
    }

    if (!signupFormData.password) newErrors.password = 'Password is required';
    if (!signupFormData.confirm_password) newErrors.confirm_password = 'Confirm Password is required';
    if (signupFormData.password && signupFormData.confirm_password && signupFormData.password !== signupFormData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    setSignupErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!loginFormData.email) newErrors.email = 'Email is required';
    if (!loginFormData.password) newErrors.password = 'Password is required';
    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (validateSignupForm()) {
      const formData = new FormData();
    
      if (showSignupForm === 'serviceProvider') {
        Object.keys(signupFormData).forEach((key) => {
            if (key === 'profile_image' || key === 'adhar_card') {
              if (signupFormData[key]) {
                formData.append(key, signupFormData[key]); // Append single file inputs
              }
            } 
            else if (key === 'office_images') {
            if (Array.isArray(signupFormData.office_images) && signupFormData.office_images.length > 0) {  // Check if files are not null
              signupFormData.office_images.forEach((file) => {
                formData.append('office_images', file);
              });
            }
          } else {
            formData.append(key, signupFormData[key]);
          }
        });

        // Log FormData contents to debug what is being sent
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}, ${pair[1]}`);
        }
  
        try {
          // Make the POST request to the backend API
          const response = await axios.post('http://localhost:8000/service-provider/register', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
  
          // Handle successful signup
          if (response.status === 200) {
            setShowSuccessMessage(true);
            setSignupFormData({
              name: '',
              service_offered: '',
              description: '',
              address: '',
              district: '',
              state: '',
              zip_code: '',
              latitude: null,
              longitude: null,
              phone_number: '',
              email: '',
              operating_hours: '',
              website: '',
              profile_image: null,
              adhar_card: null,
              office_images: [],
              password: '',
              confirm_password: ''
            });
            navigate('/signup');
          }
        } catch (error) {
          // Handle any error response from the API
          console.error('Signup failed:', error.response ? error.response.data : error.message);
          setSignupErrors({ form: 'Signup failed. Please try again.' });
        }
      } 
      else if (showSignupForm === 'user') {
        // User-specific form data (adapt keys as necessary)
        const userJsonData = {
          email: signupFormData.email,
          password: signupFormData.password,
          confirm_password: signupFormData.confirm_password,
        };
  
        try {
          // POST request to the backend for User signup
          const response = await axios.post('http://localhost:8000/user/register', userJsonData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          // Handle successful signup for User
          if (response.status === 200) {
            setShowSuccessMessage(true);
            setSignupFormData({
              email: '',
              password: '',
              confirm_password: ''
            });
          }
        } catch (error) {
          if (error.response && error.response.status === 500 ) {
            setLoginErrors({ form: 'User already exist' });
          } else {
            setLoginErrors({ form: 'Some error occured' });
          }
        }
      }
    }
  };
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (validateLoginForm()) {
      if (showLoginForm === 'serviceProvider') {
        const serviceProviderLoginData = {
          email: loginFormData.email,
          password: loginFormData.password,
        };
    
        try {
  
          const response = await axios.post('http://localhost:8000/service-provider/login', serviceProviderLoginData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (response.status === 200) {
            setShowSuccessMessage(true);
            setLoginFormData({
              email: '',
              password: '',
            });
            localStorage.setItem('token', response.data.access_token);

            setShowSuccessMessage(true);

            setTimeout(() => {
              navigate('/service-provider/update/');
            }, 1000);
        
          } else {
            const errorData = await response.json();
            setLoginErrors({ form: errorData.message });
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setLoginErrors({ form: 'Invalid email or password' });
          } else {
            setLoginErrors({ form: 'User does not exist' });
          }
        }
      } 
      else if (showLoginForm === 'user') {
        const userLoginData = {
          email: loginFormData.email,
          password: loginFormData.password,
        };
    
        try {
          
          const response = await axios.post('http://localhost:8000/user/login', userLoginData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            setShowSuccessMessage(true);

            setLoginFormData({
              email: '',
              password: ''
            });

            localStorage.setItem('token', response.data.access_token);
        
            navigate('/services');
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setLoginErrors({ form: 'Invalid email or password' });
          } else {
            setLoginErrors({ form: 'An error occurred. Please try again later.' });
          }
        }
      }
    }
    
  };


  return (
    <div style={styles.pageWrapper}>
      <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '100vh', padding: '50px 0' }}>
        <div className='row w-100'>
          <div className='col-lg-6 col-md-8 col-sm-12 mx-auto'>
            <div style={styles.formContainer}>
              <h3 className='text-center mb-4'>Welcome to Urban Assist!</h3>
              <p className='text-center mb-4'>You are one step away from your service</p>
              <div className='d-flex justify-content-center'>
                <button onClick={handleLoginClick} className='btn btn-primary mx-2'>Login</button>
                <button onClick={handleSignupClick} className='btn btn-secondary mx-2'>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    {showLoginPopup && (
      <div style={styles.popup}>
        <div style={styles.popupContent}>
          <h4>Log In As</h4>
          <button onClick={() => setShowLoginForm('serviceProvider')} className='btn btn-primary mx-2'>Service Provider</button>
          <button onClick={() => setShowLoginForm('user')} className='btn btn-secondary mx-2'>User</button>
          <button onClick={handleClosePopup} style={styles.closeButton}>
            <FaTimes />
          </button>
        </div>
      </div>
    )}

    {showLoginForm && (
      <div style={styles.popup}>
        <div style={styles.popupContent}>
          <h4>Log In as {showLoginForm === 'serviceProvider' ? 'Service Provider' : 'User'}</h4>
          <form onSubmit={handleLoginSubmit} style={styles.loginForm}>
            {showLoginForm === 'serviceProvider' ? (
              <>
                <div className='mb-4'>
                  <label htmlFor='email' className='form-label fs-5'>Email</label>
                  <input name='email' id='email' placeholder='Enter your email' type='email' className={`form-control ${loginErrors.email ? 'is-invalid' : ''}`} value={loginFormData.email || ''} onChange={handleLoginFormChange} />
                  {loginErrors.email && <div className='invalid-feedback'>{loginErrors.email}</div>}
                </div>
                <div className='mb-4'>
                  <label htmlFor='password' className='form-label fs-5'>Password</label>
                  <input name='password' id='password' placeholder='Enter your password' type='password' className={`form-control ${loginErrors.password ? 'is-invalid' : ''}`} value={loginFormData.password || ''} onChange={handleLoginFormChange} />
                  {loginErrors.password && <div className='invalid-feedback'>{loginErrors.password}</div>}
                </div>
              </>
            ) : (
              <>
                <div className='mb-4'>
                  <label htmlFor='email' className='form-label fs-5'>Email</label>
                  <input name='email' id='email' placeholder='Enter your email' type='email' className={`form-control ${loginErrors.email ? 'is-invalid' : ''}`} value={loginFormData.email || ''} onChange={handleLoginFormChange} />
                  {loginErrors.email && <div className='invalid-feedback'>{loginErrors.email}</div>}
                </div>
                <div className='mb-4'>
                  <label htmlFor='password' className='form-label fs-5'>Password</label>
                  <input name='password' id='password' placeholder='Enter your password' type='password' className={`form-control ${loginErrors.password ? 'is-invalid' : ''}`} value={loginFormData.password || ''} onChange={handleLoginFormChange} />
                  {loginErrors.password && <div className='invalid-feedback'>{loginErrors.password}</div>}
                </div>
              </>
            )}

            {/* General form error message (like "Invalid email or password") */}
            {loginErrors.form && <div className="alert alert-danger mt-3">{loginErrors.form}</div>}

            <button type='submit' className='btn btn-primary'>Log In</button>
            {showSuccessMessage && <div className='alert alert-success mt-3'>Login successful!</div>}
          </form>
          <button onClick={handleClosePopup} style={styles.closeButton}>
            <FaTimes />
          </button>
        </div>
      </div>
    )}

      {showSignupPopup && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <h4>Sign Up As</h4>
            <button onClick={() => setShowSignupForm('serviceProvider')} className='btn btn-primary mx-2'>Service Provider</button>
            <button onClick={() => setShowSignupForm('user')} className='btn btn-secondary mx-2'>User</button>
            <button onClick={handleClosePopup} style={styles.closeButton}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {showSignupForm && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <h4>Sign Up as {showSignupForm === 'serviceProvider' ? 'Service Provider' : 'User'}</h4>
            <form onSubmit={handleSignupSubmit} style={styles.signupForm}>
              {showSignupForm === 'serviceProvider' ? (
                <>
                  {/* Service Provider Form Fields */}
                  <div className='mb-4'>
                    <label htmlFor='name' className='form-label fs-5'>Name</label>
                    <input name='name' id='name' placeholder='Enter your name' type='text' className={`form-control ${signupErrors.name ? 'is-invalid' : ''}`} value={signupFormData.name || ''} onChange={handleSignupFormChange} />
                    {signupErrors.name && <div className='invalid-feedback'>{signupErrors.name}</div>}
                  </div>
                  
                  <div className='mb-4'>
                    <label htmlFor='service_offered' className='form-label fs-5'>Service Offered</label>
                    <input name='service_offered' id='service_offered' placeholder='Enter your service' type='text' className={`form-control ${signupErrors.service_offered ? 'is-invalid' : ''}`} value={signupFormData.service_offered || ''} onChange={handleSignupFormChange} />
                    {signupErrors.service_offered && <div className='invalid-feedback'>{signupErrors.service_offered}</div>}
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='description' className='form-label fs-5'>Description</label>
                    <input name='description' id='description' placeholder='Enter a description of the service' type='text' className={`form-control ${signupErrors.description ? 'is-invalid' : ''}`} value={signupFormData.description || ''} onChange={handleSignupFormChange} />
                    {signupErrors.description && <div className='invalid-feedback'>{signupErrors.description}</div>}
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='address' className='form-label fs-5'>Address</label>
                    <input name='address' id='address' placeholder='Enter your address' type='text' className={`form-control ${signupErrors.address ? 'is-invalid' : ''}`} value={signupFormData.address || ''} onChange={handleSignupFormChange} />
                    {signupErrors.address && <div className='invalid-feedback'>{signupErrors.address}</div>}
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='district' className='form-label fs-5'>District</label>
                    <input name='district' id='district' placeholder='Enter your district' type='text' className={`form-control ${signupErrors.district ? 'is-invalid' : ''}`} value={signupFormData.district || ''} onChange={handleSignupFormChange} />
                    {signupErrors.district && <div className='invalid-feedback'>{signupErrors.district}</div>}
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='state' className='form-label fs-5'>State</label>
                    <input name='state' id='state' placeholder='Enter your state' type='text' className={`form-control ${signupErrors.state ? 'is-invalid' : ''}`} value={signupFormData.state || ''} onChange={handleSignupFormChange} />
                    {signupErrors.state && <div className='invalid-feedback'>{signupErrors.state}</div>}
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='zip_code' className='form-label fs-5'>Zip Code</label>
                    <input name='zip_code' id='zip_code' placeholder='Enter your zip code' type='text' className={`form-control ${signupErrors.zip_code ? 'is-invalid' : ''}`} value={signupFormData.zip_code || ''} onChange={handleSignupFormChange} />
                    {signupErrors.zip_code && <div className='invalid-feedback'>{signupErrors.zip_code}</div>}
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='phone_number' className='form-label fs-5'>Phone Number</label>
                    <input name='phone_number' id='phone_number' placeholder='Enter your phone number' type='text' className={`form-control ${signupErrors.phone_number ? 'is-invalid' : ''}`} value={signupFormData.phone_number || ''} onChange={handleSignupFormChange} />
                    {signupErrors.phone_number && <div className='invalid-feedback'>{signupErrors.phone_number}</div>}
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='email' className='form-label fs-5'>Email</label>
                    <input name='email' id='email' placeholder='Enter your email' type='email' className={`form-control ${signupErrors.email ? 'is-invalid' : ''}`} value={signupFormData.email || ''} onChange={handleSignupFormChange} />
                    {signupErrors.email && <div className='invalid-feedback'>{signupErrors.email}</div>}
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='operating_hours' className='form-label fs-5'>Operating Hours</label>
                    <input name='operating_hours' id='operating_hours' placeholder='Enter operating hours (optional)' type='text' className={`form-control ${signupErrors.operating_hours ? 'is-invalid' : ''}`} value={signupFormData.operating_hours || ''} onChange={handleSignupFormChange} />
                    {signupErrors.operating_hours && <div className='invalid-feedback'>{signupErrors.operating_hours}</div>}
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='website' className='form-label fs-5'>Website</label>
                    <input name='website' id='website' placeholder='Enter your website (optional)' type='text' className={`form-control ${signupErrors.website ? 'is-invalid' : ''}`} value={signupFormData.website || ''} onChange={handleSignupFormChange} />
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='profile_image' className='form-label fs-5'>Profile Image</label>
                    <input name='profile_image' id='profile_image' type='file' className={`form-control ${signupErrors.profile_image ? 'is-invalid' : ''}`} onChange={handleSignupFormChange} />
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='adhar_card' className='form-label fs-5'>Aadhaar Card Image</label>
                    <input name='adhar_card' id='adhar_card' type='file' className={`form-control ${signupErrors.adhar_card ? 'is-invalid' : ''}`} onChange={handleSignupFormChange} />
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='office_images' className='form-label fs-5'>Office Images</label>
                    {officeImageFields.map((field, index) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                        <input
                          name='office_images'
                          id={`office_image_${index}`}
                          type='file'
                          className={`form-control ${signupErrors.office_images ? 'is-invalid' : ''}`}
                          onChange={(e) => handleSignupFormChange(e, index)}
                        />
                        {signupErrors.office_images && (
                          <div className='invalid-feedback'>{signupErrors.office_images}</div>
                        )}
                      </div>
                    ))}
                    <button type="button" className="btn btn-secondary mt-2" onClick={addOfficeImageField}>
                      Add More
                    </button>
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='password' className='form-label fs-5'>Password</label>
                    <input name='password' id='password' placeholder='Enter your password' type='password' className={`form-control ${signupErrors.password ? 'is-invalid' : ''}`} value={signupFormData.password} onChange={handleSignupFormChange} />
                    {signupErrors.password && <div className='invalid-feedback'>{signupErrors.password}</div>}
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='confirm_password' className='form-label fs-5'>Confirm Password</label>
                    <input name='confirm_password' id='confirm_password' placeholder='Confirm your password' type='password' className={`form-control ${signupErrors.confirm_password ? 'is-invalid' : ''}`} value={signupFormData.confirm_password} onChange={handleSignupFormChange} />
                    {signupErrors.confirm_password && <div className='invalid-feedback'>{signupErrors.confirm_password}</div>}
                  </div>
                </>
              ) : (
                <>
                  <div className='mb-4'>
                    <label htmlFor='email' className='form-label fs-5'>Email</label>
                    <input name='email' id='email' placeholder='Enter your email' type='email' className={`form-control ${signupErrors.email ? 'is-invalid' : ''}`} value={signupFormData.email} onChange={handleSignupFormChange} />
                    {signupErrors.email && <div className='invalid-feedback'>{signupErrors.email}</div>}
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='password' className='form-label fs-5'>Password</label>
                    <input name='password' id='password' placeholder='Enter your password' type='password' className={`form-control ${signupErrors.password ? 'is-invalid' : ''}`} value={signupFormData.password} onChange={handleSignupFormChange} />
                    {signupErrors.password && <div className='invalid-feedback'>{signupErrors.password}</div>}
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='confirm_password' className='form-label fs-5'>Confirm Password</label>
                    <input name='confirm_password' id='confirm_password' placeholder='Confirm your password' type='password' className={`form-control ${signupErrors.confirm_password ? 'is-invalid' : ''}`} value={signupFormData.confirm_password} onChange={handleSignupFormChange} />
                    {signupErrors.confirm_password && <div className='invalid-feedback'>{signupErrors.confirm_password}</div>}
                  </div>
                </>
              )}
              <button type='submit' className='btn btn-primary'>Sign Up</button>
              {showSuccessMessage && <div className='alert alert-success mt-3'>Signup successful!</div>}
            </form>
            <button onClick={handleClosePopup} style={styles.closeButton}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


const styles = {
  pageWrapper: {
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    paddingTop: '20px',
    paddingBottom: '20px',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    padding: '30px',
  },
  popup: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    overflowY: 'auto',
  },
  popupContent: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '10px',
    position: 'relative',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    marginTop: '80px',
    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '1.5rem',
  },
  signupForm: {
    marginTop: '20px',
  },
};

export default SignupPage;

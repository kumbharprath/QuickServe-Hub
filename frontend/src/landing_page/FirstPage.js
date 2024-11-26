import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing

const services = [
  {
    id: 1,
    image: 'service1.jpg', // Replace with actual image path
    title: 'Service One',
    description: 'Description of Service One',
  },
  {
    id: 2,
    image: 'service2.jpg', // Replace with actual image path
    title: 'Service Two',
    description: 'Description of Service Two',
  },
  {
    id: 3,
    image: 'service3.jpg', // Replace with actual image path,
    title: 'Service Three',
    description: 'Description of Service Three',
  },
  {
    id: 4,
    image: 'service4.jpg', // Replace with actual image path,
    title: 'Service Four',
    description: 'Description of Service Four',
  },
  {
    id: 5,
    image: 'service5.jpg', // Replace with actual image path,
    title: 'Service Five',
    description: 'Description of Service Five',
  },
];

// Adding extra cards for looping
const extendedServices = [...services, ...services];

const backgrounds = [
  'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
  'linear-gradient(-45deg, #1e3c72, #2a5298)',
  'linear-gradient(-45deg, #ff9a9e, #fad0c4)',
  'linear-gradient(-45deg, #fbc2eb, #a6c1ee)',
  'linear-gradient(-45deg, #ffecd2, #fcb69f)',
];

const FirstPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const slideRef = useRef();

  // Auto-slide every 3 seconds
  useEffect(() => {
    const autoSlide = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(autoSlide);
  }, [currentIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  // Check when transition ends to create infinite loop effect
  const handleTransitionEnd = () => {
    if (currentIndex >= services.length) {
      setIsTransitioning(false);
      setCurrentIndex(0); // Instantly reset to the start without transition
    }
  };

  return (
    <div style={styles.container}>
      {/* Right arrow for routing to home */}
      <Link to="/home" style={styles.arrow}>
        <div style={styles.arrowButton}>➔</div>
      </Link>

      {/* Left section for website name and welcome message */}
      <div style={styles.leftContainer}>
        <h1 style={styles.websiteName}>Urban Assist</h1>
        <h2 style={styles.welcomeHeading}>Welcome to Urban Assist!</h2>
      </div>

      {/* Slideshow section */}
      <div
        style={{
          ...styles.slideshowContainer,
          background: backgrounds[currentIndex % backgrounds.length], // Dynamic background
        }}
      >
        <div
          ref={slideRef}
          style={{
            ...styles.cardContainer,
            transform: `translateX(-${(currentIndex % services.length) * (100 / services.length)}%)`, // Continuous slide effect
            transition: isTransitioning ? 'transform 1s ease-in-out' : 'none', // Smooth transition unless looping
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedServices.map((service, index) => (
            <div key={index} style={styles.card}>
              <img src={service.image} alt={service.title} style={styles.image} />
              <h3 style={styles.cardTitle}>{service.title}</h3>
              <p style={styles.cardDescription}>{service.description}</p>
              <Link to="/home" className="btn btn-primary">
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  arrow: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    textDecoration: 'none',
    zIndex: 1000,
  },
  arrowButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  },
  leftContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 2s ease-in-out',
  },
  websiteName: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
    animation: 'bounce 2s infinite',
    background: 'linear-gradient(90deg, #ee7752, #23a6d5)', // Gradient effect for the text
    WebkitBackgroundClip: 'text', // Ensures the gradient is applied only to the text
    WebkitTextFillColor: 'transparent', // Transparent fill to show the gradient
    padding: '10px 20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Light shadow for depth
    display: 'inline-block', // Keeps the text in a block with padding
  },  
  welcomeHeading: {
    fontSize: '1.5rem',
    fontWeight: '500',
    color: '#555',
    animation: 'fadeIn 3s ease-in-out',
  },
  slideshowContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    transition: 'background 1s ease-in-out',
  },
  cardContainer: {
    display: 'flex',
    width: `${extendedServices.length * 100}%`,
    transition: 'transform 1s ease-in-out',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    width: `${100 / services.length}%`,
    textAlign: 'center',
    transition: 'transform 0.5s ease-in-out',
    flexShrink: 0,
    margin: '0 10px',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
    marginBottom: '15px',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  cardDescription: {
    fontSize: '1rem',
    marginBottom: '15px',
  },

  // Media Queries for Responsive Design
  '@media (max-width: 768px)': {
    websiteName: {
      display: 'none', // Hide the website name on small screens
    },
    leftContainer: {
      padding: '20px',
    },
    arrowButton: {
      width: '40px', // Smaller arrow button
      height: '40px',
      fontSize: '1rem',
    },
  },
  
  '@keyframes bounce': {
    '0%, 100%': {
      transform: 'translateY(0)',
    },
    '50%': {
      transform: 'translateY(-10px)',
    },
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
};

export default FirstPage;

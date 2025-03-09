import React, { useState, useEffect } from 'react';

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: '/',
      title: 'Slide 1 Title',
      description: 'This is the description for slide 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      link: '#',
    },
    {
      image: '/',
      title: 'Slide 2 Title',
      description: 'This is the description for slide 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      link: '#',
    },
    {
      image: '/',
      title: 'Slide 3 Title',
      description: 'This is the description for slide 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      link: '#',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div style={styles.heroContainer}>
      <div
        style={{
          ...styles.slideshow,
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              ...styles.slide,
              backgroundImage: `url(${slide.image})`,
            }}
          >
            <div style={styles.infoBox}>
              <h1 style={styles.heading}>{slide.title}</h1>
              <p style={styles.paragraph}>{slide.description}</p>
              <a href={slide.link} style={styles.link}>Learn More</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: 'Arial, sans-serif',
    '@media (max-width: 768px)': {
      height: '80vh',
    },
  },
  slideshow: {
    display: 'flex',
    transition: 'transform 1s ease',
    width: '100%',
    height: '100%',
    flexDirection: 'row', // Ensures horizontal layout on large screens
    '@media (max-width: 768px)': {
      flexDirection: 'column', // Stack slides vertically on small screens
    },
  },
  slide: {
    flex: '0 0 100%',
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    '@media (min-width: 768px)': {
      height: '100%', // Ensure square aspect ratio
    },
    '@media (max-width: 768px)': {
      height: '80%', // Adjust height for small screens
    },
  },
  infoBox: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '80%',
    boxSizing: 'border-box',
    '@media (max-width: 768px)': {
      left: '5%',
      width: '90%',
      textAlign: 'center',
      padding: '15px',
    },
  },
  heading: {
    margin: 0,
    fontSize: '2rem',
    '@media (max-width: 768px)': {
      fontSize: '1.5rem',
    },
  },
  paragraph: {
    margin: '10px 0',
    fontSize: '1.25rem',
    '@media (max-width: 768px)': {
      fontSize: '1rem',
    },
  },
  link: {
    display: 'inline-block',
    marginTop: '10px',
    color: '#387ed1',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontSize: '1rem',
    '@media (max-width: 768px)': {
      fontSize: '0.9rem',
    },
  },
};

export default Hero;

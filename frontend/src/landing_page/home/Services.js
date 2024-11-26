import React from 'react';
import { Link } from 'react-router-dom'; 

function Services() {
  const servicesData = [
    {
      category: 'Investment Services',
      services: [
        { name: 'Portfolio Management' },
        { name: 'Mutual Fund Advisory' },
        { name: 'Stock Market Advisory' },
        { name: 'Fixed Income Advisory' },
        { name: 'Real Estate Investment Advisory' },
        { name: 'Retirement Planning' },
        { name: 'Wealth Management' },
        { name: 'Goal-Based Investment' },
      ],
    },
    {
      category: 'Financial Advisory Services',
      services: [
        { name: 'Financial Planning' },
        { name: 'Tax Planning' },
        { name: 'Estate Planning' },
        { name: 'Insurance Advisory' },
        { name: 'Risk Management' },
        { name: 'Cash Flow Management' },
        { name: 'Debt Management' },
      ],
    },
    {
      category: 'Chartered Accountant (CA) Services',
      services: [
        { name: 'Accounting Services' },
        { name: 'Audit & Assurance' },
        { name: 'Taxation Services' },
        { name: 'Business Registration' },
        { name: 'Corporate Compliance' },
        { name: 'Payroll Services' },
        { name: 'Financial Statements Preparation' },
        { name: 'Consulting Services' },
      ],
    },
    {
      category: 'Additional Value-Added Services',
      services: [
        { name: 'Virtual CFO Services' },
        { name: 'Education & Training' },
        { name: 'Financial Tools and Calculators' },
        { name: 'Market Analysis & Reports' },
        { name: 'Newsletters & Blogs' },
        { name: 'Personal Finance Coaching' },
        { name: 'Startup Advisory' },
      ],
    },
  ];

  return (
    <div
      style={{
        padding: '50px 20px',
        backgroundImage: 'url(/)', // Add your background image path here
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // Keeps the background fixed while scrolling
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#222222', marginBottom: '30px', fontFamily:'Arial", sans-serif', fontSize: '2rem', fontWeight:'600'}}>Services</h2>
      <div className="container">
        <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {servicesData.map((category, index) => (
            <div
              key={index}
              style={{
                flex: '1 1 calc(25% - 20px)', // Adjust flex-basis for responsive width
                maxWidth: '300px',
                backgroundColor: index % 2 === 0 ? 'rgba(172, 191, 230, 0.7)' : 'rgba(224, 230, 237, 0.7)', // Transparent background
                border: '1px solid #ddd',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                textAlign: 'left',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)', // Add blur effect to enhance transparency
              }}
            >
              <h3 style={{ color: '#387ed1', fontWeight: 'bold', marginBottom: '15px' }}>{category.category}</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {category.services.map((service, i) => (
                  <li key={i} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#387ed1' }}>➤</span> {/* Arrow icon */}
                    <Link
                      to={`/services#${service.name.replace(/\s+/g, '-').toLowerCase()}`}
                      style={{
                        color: '#495057',
                        textDecoration: 'none',
                        fontWeight: 'bold', // Bold for highlighting
                        transition: 'color 0.3s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#387ed1')} // Hover effect
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#495057')}
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;
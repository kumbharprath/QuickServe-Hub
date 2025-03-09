import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

// Shared styles for the logo across Navbar and Footer
const sharedStyles = {
  logoLink: {
    color: "#387ed1",
    fontWeight: "500",
    fontSize: "1.75rem",
    display: 'flex',
    alignItems: 'center',
    fontFamily: "'Playfair Display', serif", // Classic font style
    textDecoration: 'none', // Ensure no underline
  },
  logoHighlight: {
    color: "#ff7f7f",
    margin: '0 5px',
  },
};

// Styles specific to the Footer component
const footerStyles = {
  footer: {
    backgroundColor: '#f2f2f2',
    padding: '50px 20px',
    '@media (max-width: 768px)': {
      padding: '30px 10px',
    },
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  column: {
    flex: '1',
    margin: '20px',
    minWidth: '200px',
    '@media (max-width: 768px)': {
      margin: '10px 0',
      textAlign: 'center',
    },
  },
  h2: {
    fontWeight: "500",
    color: "#424242",
    fontSize: "2rem",
    marginBottom: "30px",
    '@media (max-width: 768px)': {
      fontSize: "1.5rem",
    },
  },
  h3: {
    fontWeight: "500",
    color: "#424242",
    fontSize: "1.5rem",
    marginBottom: "30px",
    '@media (max-width: 768px)': {
      fontSize: "1.25rem",
    },
  },
  p: {
    fontWeight: "400",
    color: "#424242",
    fontSize: "1.1rem", // Increased font size for description
    marginBottom: '15px', // Added space between options
    textDecoration: 'none', // Remove underline from links
    display: 'block',
  },
  linkHover: {
    color: '#387ed1', // Blue color for hover effect
  },
  hr: {
    width: "100%",
    background: "#EEEEEE",
    border: 'none',
    margin: '20px 0',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center', // Center social media icons
    margin: '15px auto', // Center the div
    gap: '15px', // Gap between icons
  },
  socialIcon: {
    fontSize: '5rem', // Increased icon size
    color: '#424242',
    transition: 'color 0.3s ease', // Smooth transition for hover effect
  },
  socialIconHover: {
    color: '#1f7d9c', // Color for hover effect
  },
  map: {
    width: '100%',
    height: '300px',
    border: 'none',
    borderRadius: '10px', // Rounded corners for better style
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    marginTop: '20px',
    '@media (max-width: 768px)': {
      height: '200px',
    },
  },
};

function Footer() {
  return (
    <div style={footerStyles.footer}>
      <div className='container' style={{ width: "100%" }}>
        <div style={footerStyles.container}>
          {/* Logo and Description Section */}
          <div style={footerStyles.column}>
            <h2 style={footerStyles.h2}>
              <Link className="navbar-brand" to="/" style={sharedStyles.logoLink}>
              <h1>Urban Assist</h1>
              </Link>
            </h2>
            <p style={footerStyles.p}>
              We are an investing and taxation-related firm offering professional services in financial planning, investments, and tax management.
            </p>
            <hr/>
             {/* Social Media Icons */}
          <div style={footerStyles.socialIcons}>
            <i style={{fontSize:'1.5rem'}} className="fab fa-twitter social-icon"></i>
            <i style={{fontSize:'1.5rem'}} className="fab fa-facebook-square social-icon"></i>
            <i style={{fontSize:'1.5rem'}} className="fab fa-instagram social-icon"></i>
          </div>
          </div>

          {/* Quick Links Section */}
          <div style={footerStyles.column}>
            <h3 style={footerStyles.h3}>Quick Links</h3>
            <ul style={{ padding: 0, listStyle: 'none', fontSize: '1.1rem' }}> {/* Increased font size */}
              <li style={{ marginBottom: '15px' }}><Link to="/" style={footerStyles.p} className="footer-link">Home</Link></li>
              <li style={{ marginBottom: '15px' }}><Link to="/about" style={footerStyles.p} className="footer-link">About Us</Link></li>
              <li style={{ marginBottom: '15px' }}><Link to="/services" style={footerStyles.p} className="footer-link">Services</Link></li>
              <li style={{ marginBottom: '15px' }}><Link to="/publications" style={footerStyles.p} className="footer-link">Publications</Link></li>
              <li style={{ marginBottom: '15px' }}><Link to="/contact" style={footerStyles.p} className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* Services Section */}
          <div style={footerStyles.column}>
            <h3 style={footerStyles.h3}>Services</h3>
            <ul style={{ padding: 0, listStyle: 'none', fontSize: '1.1rem' }}> {/* Increased font size */}
              <li style={{ marginBottom: '15px' }}><Link to="/contact-us" style={footerStyles.p} className="footer-link">Contact us</Link></li>
              <li style={{ marginBottom: '15px' }}><Link to="/support-portal" style={footerStyles.p} className="footer-link">Support portal</Link></li>
              <li style={{ marginBottom: '15px' }}><Link to="/z-connect-blog" style={footerStyles.p} className="footer-link">Z-Connect blog</Link></li>
              <li style={{ marginBottom: '15px' }}><Link to="/list-of-charges" style={footerStyles.p} className="footer-link">List of charges</Link></li>
              <li style={{ marginBottom: '15px' }}><Link to="/downloads-resources" style={footerStyles.p} className="footer-link">Downloads & resources</Link></li>
            </ul>
          </div>

          {/* Company Section */}
          <div style={footerStyles.column}>
            <h3 style={footerStyles.h3}>Company</h3>
            <ul style={{ padding: 0, listStyle: 'none', fontSize: '1.1rem' }}> {/* Increased font size */}
              <li style={{ marginBottom: '15px' }}><Link to="/policy" style={footerStyles.p} className="footer-link">Policy</Link></li>
              <li style={{ marginBottom: '15px' }}><Link to="/terms-conditions" style={footerStyles.p} className="footer-link">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Google Map Embed */}
          <div className='map' style={footerStyles.column}>
            <iframe
              title="Sangli Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.5015274061894!2d74.56320201524374!3d16.85400108839125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc100d78e9fbdab%3A0x3f59b27c4a5f9b8e!2sSangli%2C%20Maharashtra%20416016%2C%20India!5e0!3m2!1sen!2sus!4v1631738418493!5m2!1sen!2sus"
              style={footerStyles.map}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
          <div className='col mt-4 footer-p'>
                    <p>Broking Ltd.: Member of NSE, BSE & MCX – SEBI Registration no.: INZ000031633 CDSL/NSDL: Depository services through InvestEdge Broking Ltd. – SEBI InvestEdge Registration no.: IN-DP-431-2019 Commodity Trading through InvestEdge Commodities Pvt. Ltd. MCX: 46025; NSE-50001 – SEBI Registration no.: INZ000038238 Registered Address: InvestEdge Broking Ltd., #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School, J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India. For any complaints pertaining to securities broking please write to complaints@InvestEdge.com, for DP related to dp@InvestEdge.com. Please ensure you carefully read the Risk Disclosure Document as prescribed by SEBI | ICF
                    </p>
                    <p>
                        Broking Ltd.: Member of NSE, BSE & MCX – SEBI Registration no.: INZ000031633 CDSL/NSDL: Depository services through InvestEdge Broking Ltd. – SEBI InvestEdge Registration no.: IN-DP-431-2019 Commodity Trading through InvestEdge Commodities Pvt. Ltd. MCX: 46025; NSE-50001 – SEBI Registration no.: INZ000038238 Registered Address: InvestEdge Broking Ltd., #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School, J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India. For any complaints pertaining to securities broking please write to complaints@InvestEdge.com, for DP related to dp@InvestEdge.com. Please ensure you carefully read the Risk Disclosure Document as prescribed by SEBI | ICF
                    </p>
                    <p>
                        Procedure to file a complaint on SEBI SCORES: Register on SCORES portal. Mandatory details for filing complaints on SCORES: Name, PAN, Address, Mobile Number, E-mail ID. Benefits: Effective Communication, Speedy redressal of the grievances
                    </p>
                    <p>
                        Smart Online Dispute Resolution | Grievances Redressal Mechanism
                    </p>
                    <p>
                        Investments in securities market are subject to market risks; read all the related documents carefully before investing.
                    </p>
                    <p>
                        Attention investors: 1) Stock brokers can accept securities as margins from clients only by way of pledge in the depository system w.e.f September 01, 2020. 2) Update your e-mail and phone number with your stock broker / depository participant and receive OTP directly from depository on your e-mail and/or mobile number to create pledge. 3) Check your securities / MF / bonds in the consolidated account statement issued by NSDL/CDSL every month.
                    </p>
                    <p>
                        "Prevent unauthorised transactions in your account. Update your mobile numbers/email IDs with your stock brokers. Receive information of your transactions directly from Exchange on your mobile/email at the end of the day. Issued in the interest of investors. KYC is one time exercise while dealing in securities markets - once KYC is done through a SEBI registered intermediary (broker, DP, Mutual Fund etc.), you need not undergo the same process again when you approach another intermediary." Dear Investor, if you are subscribing to an IPO, there is no need to issue a cheque. Please write the Bank account number and sign the IPO application form to authorize your bank to make payment in case of allotment. In case of non allotment the funds will remain in your bank account. As a business we don't give stock tips, and have not authorized anyone to trade on behalf of others. If you find anyone claiming to be part of InvestEdge and offering such services, please create a ticket here.
                    </p>
                </div>

        </div>

        <hr style={footerStyles.hr} />
        
        {/* Copyright statement after the last horizontal rule */}
        <p style={{ textAlign: 'center', fontWeight: '400', color: '#424242', fontSize: '1rem' }}>
          © 2024, URBAN ASSIST. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;

import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const collapseRef = useRef(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false); // User icon dropdown
  const [showServicesDropdown, setShowServicesDropdown] = useState(false); // Services dropdown
  const [toggleMenu, setToggleMenu] = useState(false); // Toggle icon behavior
  const isLoggedIn = false; // Mock state for user login status

  const closeNavbar = () => {
    if (collapseRef.current && window.innerWidth < 992) {
      collapseRef.current.classList.remove('show');
    }
  };

  const handleUserDropdown = () => setShowUserDropdown(!showUserDropdown); // Toggle user dropdown

  const handleToggleMenu = () => setToggleMenu(!toggleMenu); // Toggle menu for small screens

  // Inline styles
  const navbarStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    padding: '10px', // Adjust padding for small screens
  };

  const navbarBrandStyles = {
    color: '#387ed1',
    fontWeight: '500',
    fontSize: '1.5rem', // Slightly smaller font size
    display: 'flex',
    alignItems: 'center',
    fontFamily: "'Playfair Display', serif",
    textDecoration: 'none',
  };

  const navLinkStyles = {
    color: '#424242',
    fontWeight: '400',
    fontSize: '0.9rem', // Adjust font size for small screens
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  };

  const navLinkHoverStyles = {
    color: '#ff385c',
  };

  const navItemStyles = {
    marginBottom: '0.5rem',
  };

  const togglerStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    border: 'none',
  };

  const togglerIconStyles = {
    filter: 'opacity(0.8)',
  };

  const dropdownMenuStyles = {
    display: showUserDropdown ? 'block' : 'none', // Show dropdown if showUserDropdown is true
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '0.25rem',
    minWidth: '10rem',
    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)',
    zIndex: '1000',
  };

  const userIconStyles = {
    cursor: 'pointer',
    color: '#424242',
    fontSize: '1.5rem',
    transition: 'color 0.3s ease',
  };

  // Search input styling
  const searchInputContainerStyles = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    margin: '0 auto',
    maxWidth: '300px', // Smaller size for small screens
    flexGrow: 1,
  };

  const searchInputStyles = {
    borderRadius: '20px',
    border: '1px solid #ddd',
    padding: '8px 40px 8px 20px', // Adjust padding for smaller size
    width: '100%',
  };

  const searchIconStyles = {
    position: 'absolute',
    right: '10px',
    fontSize: '1rem', // Smaller icon size
    color: '#aaa',
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top" style={navbarStyles}>
        <div className="container">
          {/* Website Name */}
          <Link className="navbar-brand d-none d-lg-flex" to="/" style={navbarBrandStyles}>
            URBAN ASSIST
          </Link>
          <div className="d-flex w-100 justify-content-between align-items-center">
            {/* Search Form */}
            <div className="d-flex flex-grow-1" style={searchInputContainerStyles}>
              <input
                type="search"
                className="form-control"
                placeholder="Search"
                style={searchInputStyles}
              />
              <FontAwesomeIcon icon={faSearch} style={searchIconStyles} />
            </div>
            {/* Toggle Button for small screens */}
            <button
              className="navbar-toggler d-lg-none"
              type="button"
              onClick={handleToggleMenu}
              style={togglerStyles}
            >
              <span className="navbar-toggler-icon" style={togglerIconStyles}></span>
            </button>
          </div>
          <div className={`collapse navbar-collapse ${toggleMenu ? 'show' : ''}`} ref={collapseRef}>
            {/* Navbar Links */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item" style={navItemStyles}>
                <Link
                  className="nav-link"
                  to="/home"
                  style={navLinkStyles}
                  onClick={closeNavbar}
                  onMouseEnter={(e) => (e.target.style.color = navLinkHoverStyles.color)}
                  onMouseLeave={(e) => (e.target.style.color = navLinkStyles.color)}
                >
                  Home
                </Link>
              </li>
              {/* Services with Dropdown */}
              <li
                className="nav-item dropdown"
                style={navItemStyles}
                onMouseEnter={() => setShowServicesDropdown(true)}
                onMouseLeave={() => setShowServicesDropdown(false)}
              >
                {/* Link for Services - Routes to "/services" */}
                <Link
                  className="nav-link dropdown-toggle"
                  to="/services"
                  style={navLinkStyles}
                  onClick={closeNavbar} // Close the navbar on click
                >
                  Services
                </Link>
                <ul
                  className={`dropdown-menu ${showServicesDropdown ? 'show' : ''}`}
                  style={{ position: 'absolute', top: '100%', left: '0', backgroundColor: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', zIndex: '1000' }}
                >
                  <li className="dropdown-item">Doctor</li>
                  <li className="dropdown-item">Electrician</li>
                  <li className="dropdown-item">Mechanic</li>
                  <li className="dropdown-item">Car Washer</li>
                </ul>
              </li>
              <li className="nav-item" style={navItemStyles}>
                <Link
                  className="nav-link"
                  to="/support"
                  style={navLinkStyles}
                  onClick={closeNavbar}
                  onMouseEnter={(e) => (e.target.style.color = navLinkHoverStyles.color)}
                  onMouseLeave={(e) => (e.target.style.color = navLinkStyles.color)}
                >
                  Support
                </Link>
              </li>
            </ul>
            {/* User Icon with Dropdown */}
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown" style={navItemStyles}>
                <span
                  style={userIconStyles}
                  onClick={handleUserDropdown}
                  onMouseEnter={(e) => (e.target.style.color = navLinkHoverStyles.color)}
                  onMouseLeave={(e) => (e.target.style.color = navLinkStyles.color)}
                >
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <div className="dropdown-menu" style={dropdownMenuStyles}>
                  {isLoggedIn ? (
                    <>
                      <Link className="dropdown-item" to="/profile" onClick={closeNavbar}>
                        Profile
                      </Link>
                      <Link className="dropdown-item" to="/settings" onClick={closeNavbar}>
                        Settings
                      </Link>
                      <Link className="dropdown-item" to="/logout" onClick={closeNavbar}>
                        Logout
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link className="dropdown-item" to="/signup" onClick={closeNavbar}>
                        Login
                      </Link>
                      <Link className="dropdown-item" to="/signup" onClick={closeNavbar}>
                        Signup
                      </Link>
                    </>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* CSS for search input visibility on mobile screens */}
      <style>
        {`
          @media (max-width: 992px) {
            .navbar .form-control {
              display: block;
              width: auto;
            }
          }
        `}
      </style>
    </>
  );
}

export default Navbar;

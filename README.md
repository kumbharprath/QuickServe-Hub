# QuickServe-Hub

# QuickServe Hub – Service Listing Platform

QuickServe Hub is an advanced service listing platform that connects users with providers across various categories such as Doctors, Electricians, and Plumbers. It is built with a focus on efficiency, real-time updates, and location-based services to enhance user experience and streamline provider interactions.

---

## Features

- **Service Categories**: Organized service listings across multiple domains such as healthcare, home services, and repairs.
- **User and Provider Management**: Secure authentication and profile management for users and service providers.
- **Search and Filters**: Advanced filtering and search functionality to help users find the right provider quickly.
- **Reviews and Ratings**: Allow users to rate and review service providers for better transparency.
- **Real-Time Updates**: Integrated WebSocket support for live updates (e.g., appointment changes, job status).
- **Location-Based Services**: Embedded Google Maps for nearby provider search and directions.
- **Queue Processing**: RabbitMQ integration for efficient processing of tasks and notifications.

---

## Technologies Used

- **Backend**: FastAPI
- **Frontend**: React
- **Database**: MongoDB
- **Queue Management**: RabbitMQ
- **Real-Time Communication**: WebSocket
- **Mapping Services**: Google Maps API

---

## API Endpoints

### **Service Providers**
| HTTP Method | Endpoint                             | Description                          |
|-------------|-------------------------------------|--------------------------------------|
| `POST`      | `/service-providers/`               | Create a new service provider        |
| `GET`       | `/service-providers/`               | Get all service providers            |
| `GET`       | `/service-providers/{provider_id}/` | Get service provider by ID           |
| `PUT`       | `/service-providers/{provider_id}/` | Update service provider details      |
| `DELETE`    | `/service-providers/{provider_id}/` | Delete a service provider            |

### **User Management**
| HTTP Method | Endpoint         | Description               |
|-------------|------------------|---------------------------|
| `POST`      | `/users/register/` | User registration         |
| `POST`      | `/users/login/`    | User login                |
| `GET`       | `/users/me/`       | Get user profile          |
| `PUT`       | `/users/me/`       | Update user profile       |

### **Search and Filters**
| HTTP Method | Endpoint                         | Description                       |
|-------------|----------------------------------|-----------------------------------|
| `GET`       | `/service-providers/search/`     | Search service providers          |
| `GET`       | `/service-providers/nearby/`     | Location-based search             |
| `GET`       | `/service-providers/map/`        | Get service providers for the map |

### **Reviews**
| HTTP Method | Endpoint                                | Description                            |
|-------------|-----------------------------------------|----------------------------------------|
| `POST`      | `/service-providers/{provider_id}/reviews/` | Add a review for a service provider    |
| `GET`       | `/service-providers/{provider_id}/reviews/` | Get reviews for a service provider     |

---

## Installation and Setup

### Prerequisites

1. **Python**: Ensure you have Python 3.9+ installed.
2. **MongoDB**: Install MongoDB and ensure it's running.
3. **RabbitMQ**: Set up RabbitMQ for message queue handling.
4. **Node.js**: Install Node.js for React frontend.

---

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/QuickServe-Hub.git
   cd QuickServe-Hub



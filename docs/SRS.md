# Software Requirements Specification (SRS)
## Real Estate Booking Management System

### 1. Introduction
#### 1.1 Purpose
The purpose of this document is to define the requirements for the Real Estate Booking Management System. This system allows users to browse, search, and book properties. Agents can list and manage their properties, while Admins oversee the entire platform.

#### 1.2 Scope
The system is a web-based application built using the MERN stack (MongoDB/MySQL via Sequelize, Express.js, React, Node.js). It supports three distinct user roles: User (Customer), Agent, and Admin. Key features include user authentication, property listings with rich details and locations, booking management, and a review/rating system.

### 2. Overall Description
#### 2.1 User Roles
*   **User (Customer)**: Can browse properties, search and filter by criteria, view property details, make bookings, leave reviews, and save properties to their favorites list.
*   **Agent**: Can create and manage property listings, view bookings for their properties, and manage their profile.
*   **Admin**: Has full oversight of the system, can manage users, properties, and system-wide settings.

#### 2.2 Core Features
*   **Authentication & Authorization**: Secure login and registration with hashed passwords (bcrypt) and role-based access control.
*   **Property Management**: Comprehensive property details including type, price, features, location (address, city, state, lat/lng), amenities, and images.
*   **Booking Engine**: Customers can select check-in/check-out dates, specify the number of guests, and system will calculate total price based on duration.
*   **Review System**: Customers can rate properties (1-5 stars) and leave text comments. The system tracks aggregate ratings and review counts per property.
*   **Favorites**: Users can maintain a list of favorite properties for quick access later.

### 3. Functional Requirements
*   **REQ-01 (Authentication)**: The system shall allow users to register with name, email, password.
*   **REQ-02 (Property Listings)**: The system shall allow agents to list properties with detailed metadata (bedrooms, bathrooms, area, furnished status).
*   **REQ-03 (Search & Filter)**: The system shall provide search capability by location, property type, price range, and status.
*   **REQ-04 (Booking)**: The system shall allow a logged-in user to book an available property by providing dates and guest count.
*   **REQ-05 (Booking Status)**: The system shall track booking statuses (pending, confirmed, cancelled, completed) and payment statuses.
*   **REQ-06 (Reviews)**: The system shall allow a user to submit a review for a property they have interacted with. A user can only leave one review per property (unique constraint).

### 4. Non-Functional Requirements
*   **Security**: Passwords must be hashed using bcrypt (salt rounds: 12) before being stored. Sensitive data (like passwords) must be excluded from default API responses.
*   **Data Integrity**: Email addresses must be unique. The database shall enforce referential integrity between users, properties, bookings, and reviews.
*   **Performance**: Database tables should be indexed on frequently queried columns (e.g., location_city, price, status, type).
*   **Scalability**: The backend is designed with a RESTful API structure, allowing for easy horizontal scaling.

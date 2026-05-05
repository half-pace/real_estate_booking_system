# Database Design
## Real Estate Booking Management System

This document outlines the database tables, fields, types, and constraints based on the system's Sequelize models.

### 1. Table: `users`
Stores user, agent, and admin account information.

| Field | Type | Attributes / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | Primary Key, Auto Increment | Unique identifier |
| `name` | VARCHAR(50) | Not Null, Length [1, 50] | User's full name |
| `email` | VARCHAR(255)| Not Null, Unique | User's email address (login credential) |
| `password` | VARCHAR(255)| Not Null, Length >= 6 | Bcrypt hashed password |
| `role` | ENUM | 'user', 'agent', 'admin' (Default: 'user')| User privileges |
| `avatar` | VARCHAR(500)| Default: '' | URL to user's profile picture |
| `phone` | VARCHAR(30) | Default: '' | Contact phone number |
| `bio` | TEXT | Default: '' | Short biography/description |
| `verified` | BOOLEAN | Default: false | Email or agent verification status |
| `createdAt` | DATETIME | Not Null | Creation timestamp |
| `updatedAt` | DATETIME | Not Null | Last update timestamp |

---

### 2. Table: `properties`
Stores details of properties listed by agents.

| Field | Type | Attributes / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | Primary Key, Auto Increment | Unique identifier |
| `title` | VARCHAR(100)| Not Null, Length [1, 100] | Short descriptive title |
| `description` | TEXT | Not Null | Long description of the property |
| `type` | ENUM | 'apartment', 'house', 'villa', etc. | Type of property |
| `price` | DECIMAL(10,2)| Not Null, Min: 0 | Price for booking |
| `location_address` | VARCHAR(255)| Not Null | Street address |
| `location_city` | VARCHAR(100)| Not Null, Indexed | City for search operations |
| `location_state` | VARCHAR(100)| Not Null | State / Province |
| `location_country` | VARCHAR(100)| Default: 'United States' | Country |
| `location_zip_code`| VARCHAR(20) | | Postal code |
| `location_lat` | DECIMAL(10,6)| Default: 40.7128 | Latitude for maps |
| `location_lng` | DECIMAL(10,6)| Default: -74.0060 | Longitude for maps |
| `bedrooms` | INTEGER | Not Null, Min: 0 | Number of bedrooms |
| `bathrooms` | INTEGER | Not Null, Min: 0 | Number of bathrooms |
| `area` | INTEGER | Not Null, Min: 0 | Total square footage/meters |
| `parking` | INTEGER | Default: 0 | Number of parking spots |
| `furnished` | BOOLEAN | Default: false | Is the property furnished? |
| `amenities` | JSON | Default: [] | Array of amenity strings |
| `images` | JSON | Default: [] | Array of image URLs |
| `main_image` | VARCHAR(500)| Default: '' | URL for the primary cover image |
| `status` | ENUM | 'available', 'booked', 'sold' | Current availability status (Indexed) |
| `agent_id` | INTEGER | Not Null, Foreign Key, Indexed | Reference to Users table |
| `views` | INTEGER | Default: 0 | Total views metric |
| `rating` | DECIMAL(2,1)| Default: 0, Min: 0, Max: 5 | Average user rating |
| `review_count` | INTEGER | Default: 0 | Total number of reviews |
| `featured` | BOOLEAN | Default: false, Indexed | Flag for featured listings |
| `createdAt` | DATETIME | Not Null | Creation timestamp |
| `updatedAt` | DATETIME | Not Null | Last update timestamp |

---

### 3. Table: `bookings`
Stores reservation records connecting users to properties.

| Field | Type | Attributes / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | Primary Key, Auto Increment | Unique identifier |
| `property_id` | INTEGER | Not Null, Foreign Key, Indexed | Reference to Properties table |
| `user_id` | INTEGER | Not Null, Foreign Key, Indexed | Reference to Users table |
| `check_in` | DATEONLY | Not Null | Check-in date |
| `check_out` | DATEONLY | Not Null | Check-out date |
| `guests` | INTEGER | Not Null, Default: 1, Min: 1 | Number of guests |
| `total_price` | DECIMAL(10,2)| Not Null, Min: 0 | Total calculated cost for the stay |
| `status` | ENUM | 'pending', 'confirmed', 'cancelled', 'completed' | Booking lifecycle status (Indexed) |
| `payment_status` | ENUM | 'pending', 'paid', 'refunded' | Status of payment processing |
| `notes` | VARCHAR(500)| | Special requests or notes from user |
| `createdAt` | DATETIME | Not Null | Creation timestamp |
| `updatedAt` | DATETIME | Not Null | Last update timestamp |

---

### 4. Table: `reviews`
Stores ratings and feedback from users about properties.

| Field | Type | Attributes / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | Primary Key, Auto Increment | Unique identifier |
| `property_id` | INTEGER | Not Null, Foreign Key, Indexed | Reference to Properties table |
| `user_id` | INTEGER | Not Null, Foreign Key, Indexed | Reference to Users table |
| `rating` | INTEGER | Not Null, Min: 1, Max: 5 | Star rating |
| `comment` | VARCHAR(500)| Not Null, Length [1, 500] | Written review |
| `createdAt` | DATETIME | Not Null | Creation timestamp |
| `updatedAt` | DATETIME | Not Null | Last update timestamp |

*Note: There is a unique composite index on (`property_id`, `user_id`) to prevent duplicate reviews.*

---

### 5. Table: `user_favorites` (Junction Table)
Manages the many-to-many relationship between users and their favorited properties.

| Field | Type | Attributes / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `userId` | INTEGER | Primary Key, Foreign Key | Reference to Users table |
| `propertyId` | INTEGER | Primary Key, Foreign Key | Reference to Properties table |
| `createdAt` | DATETIME | Not Null | Creation timestamp |
| `updatedAt` | DATETIME | Not Null | Last update timestamp |

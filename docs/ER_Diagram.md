# Entity-Relationship (ER) Diagram

The following Mermaid diagram represents the relationships between the core entities in the database: `Users`, `Properties`, `Bookings`, `Reviews`, and `User Favorites`.

```mermaid
erDiagram
    USER ||--o{ PROPERTY : "manages (agentId)"
    USER ||--o{ BOOKING : "makes (userId)"
    USER ||--o{ REVIEW : "writes (userId)"
    USER }|--|{ PROPERTY : "favorites (user_favorites)"
    
    PROPERTY ||--o{ BOOKING : "has (propertyId)"
    PROPERTY ||--o{ REVIEW : "receives (propertyId)"

    USER {
        int id PK
        string name
        string email
        string password
        enum role "user, agent, admin"
        string avatar
        string phone
        string bio
        boolean verified
    }

    PROPERTY {
        int id PK
        string title
        text description
        enum type
        decimal price
        string location_address
        string location_city
        string location_state
        int bedrooms
        int bathrooms
        int area
        boolean furnished
        json amenities
        json images
        string status
        int agent_id FK
        decimal rating
        boolean featured
    }

    BOOKING {
        int id PK
        int property_id FK
        int user_id FK
        date check_in
        date check_out
        int guests
        decimal total_price
        enum status
        enum payment_status
    }

    REVIEW {
        int id PK
        int property_id FK
        int user_id FK
        int rating
        string comment
    }

    USER_FAVORITES {
        int userId FK
        int propertyId FK
    }
```

### Relationships Explained
1. **User (Agent) to Property**: A One-to-Many relationship where an Agent can have multiple properties listed.
2. **User to Booking**: A One-to-Many relationship where a User can make multiple bookings over time.
3. **Property to Booking**: A One-to-Many relationship where a single property can have multiple bookings associated with it.
4. **User to Review**: A One-to-Many relationship where a User can write multiple reviews for different properties.
5. **Property to Review**: A One-to-Many relationship where a Property can receive multiple reviews from different users.
6. **User to Property (Favorites)**: A Many-to-Many relationship managed by a junction table (`user_favorites`), allowing users to favorite many properties, and properties to be favorited by many users.

# Data Flow Diagram (DFD)
## Real Estate Booking Management System

### Level 0: Context Diagram

The Context Diagram shows the system as a whole and its interactions with external entities.

```mermaid
graph LR
    C[Customer / User] -->|Browsing, Booking Requests, Reviews| System((Real Estate<br>System))
    A[Agent] -->|Property Listings, Updates| System
    Admin[Administrator] -->|System Configurations, User Management| System
    
    System -->|Property Details, Booking Confirmation| C
    System -->|Booking Notifications, Dashboard Stats| A
    System -->|System Reports| Admin
```

---

### Level 1: System Processes

The Level 1 DFD breaks down the main system into its major sub-processes.

```mermaid
graph TD
    %% External Entities
    C[Customer / User]
    A[Agent]
    Admin[Administrator]

    %% Processes
    P1((1.0 User & Auth<br>Management))
    P2((2.0 Property<br>Management))
    P3((3.0 Booking<br>Management))
    P4((4.0 Review<br>Management))

    %% Data Stores
    D1[(D1: Users Data)]
    D2[(D2: Properties Data)]
    D3[(D3: Bookings Data)]
    D4[(D4: Reviews Data)]

    %% Flow: User Management
    C -->|Registration Details, Credentials| P1
    A -->|Registration Details, Credentials| P1
    Admin -->|Admin Credentials, User Moderation| P1
    P1 <-->|Read/Write User Profiles & Auth| D1
    P1 -->|Auth Token / Session| C
    P1 -->|Auth Token / Session| A

    %% Flow: Property Management
    A -->|Create/Update Listing| P2
    C -->|Search Filters, View Requests| P2
    P2 <-->|Read/Write Property Details| D2
    P2 -->|Property Data, Search Results| C
    P2 -->|Listing Status| A

    %% Flow: Booking Management
    C -->|Check-in/out Dates, Guest Count| P3
    P3 <-->|Check Availability| D2
    P3 <-->|Read/Write Booking Records| D3
    P3 -->|Booking Invoice & Confirmation| C
    P3 -->|New Booking Alert| A

    %% Flow: Review Management
    C -->|Ratings & Comments| P4
    P4 <-->|Validate User Booked Property| D3
    P4 <-->|Read/Write Reviews| D4
    P4 -->|Update Aggregate Rating| P2
    D4 -->|Display Reviews| C
```

### Process Descriptions

1.  **1.0 User & Auth Management**: Handles user registration, login (using bcrypt for passwords), profile updates, and role assignments. It issues authentication tokens to users.
2.  **2.0 Property Management**: Allows agents to add, edit, or remove properties. It provides advanced search and filtering capabilities for customers based on location, price, and amenities.
3.  **3.0 Booking Management**: Manages the reservation lifecycle. It verifies property availability via Process 2/Data Store 2, calculates total prices, records the booking, and triggers notifications to the respective agent.
4.  **4.0 Review Management**: Accepts ratings and comments from customers for properties they have interacted with. It validates eligibility, stores the review, and recalculates the average property rating.

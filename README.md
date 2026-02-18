# Real Estate Booking Management System

A comprehensive property booking management system with CLI and GUI interfaces, built with Python and MongoDB.

## Project Structure
```
real_estate_booking_system/
├── documentation/         # Project documentation (for teacher)
├── src/                  # Source code
│   ├── cli/             # CLI version
│   ├── gui/             # GUI version
│   ├── database/        # Database layer
│   ├── models/          # Business logic
│   ├── utils/           # Utility functions
│   └── config/          # Configuration
├── requirements.txt
├── run_cli.py          # CLI entry point
├── run_gui.py          # GUI entry point
└── README.md
```

## Installation

### Prerequisites
- Python 3.8+
- MongoDB 4.0+

### Setup

1. Install MongoDB and start service
2. Install dependencies:
```bash
   pip install -r requirements.txt
```

3. Run the application:
```bash
   # CLI Version
   python run_cli.py
   
   # GUI Version
   python run_gui.py
```

### Default Login
- Username: `admin`
- Password: `admin123`

## Features

- Customer Management
- Property Management
- Booking System with availability checking
- Payment Processing
- Reports & Analytics
- Dual Interface (CLI & GUI)

## Documentation

Documentation for teacher submission is in `documentation/` folder.
```

---

### **requirements.txt**
```
pymongo==4.6.1
PyQt5==5.15.10
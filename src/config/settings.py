"""
Configuration settings for the application
"""

# Database Configuration
DATABASE_CONFIG = {
    'host': 'localhost',
    'port': 27017,
    'database': 'real_estate_booking'
}

# Default Admin User
DEFAULT_ADMIN = {
    'username': 'admin',
    'password': 'admin123',
    'role': 'admin'
}

# Application Settings
APP_SETTINGS = {
    'app_name': 'Real Estate Booking System',
    'version': '1.0.0',
    'date_format': '%Y-%m-%d',
    'datetime_format': '%Y-%m-%d %H:%M:%S'
}

# Property Types
PROPERTY_TYPES = ['house', 'apartment', 'commercial']

# Booking Statuses
BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed']

# Property Statuses
PROPERTY_STATUSES = ['available', 'booked', 'maintenance']

# Payment Methods
PAYMENT_METHODS = ['cash', 'card', 'online']

# ID Proof Types
ID_PROOF_TYPES = ['Passport', 'Driver License', 'National ID', 'Other']

# User Roles
USER_ROLES = ['admin', 'agent', 'customer']
"""
Database models and operations
"""
from datetime import datetime
from src.database.connection import db_connection
from src.models.user import UserModel
from src.models.customer import CustomerModel
from src.models.property import PropertyModel
from src.models.booking import BookingModel
from src.models.payment import PaymentModel


class DatabaseManager:
    """Main database manager coordinating all models"""
    
    def __init__(self):
        self.db = db_connection.db
        
        # Initialize models
        self.users = UserModel(self.db)
        self.customers = CustomerModel(self.db)
        self.properties = PropertyModel(self.db)
        self.bookings = BookingModel(self.db)
        self.payments = PaymentModel(self.db)
        
        # Create indexes
        self.create_indexes()
        
    def create_indexes(self):
        """Create database indexes"""
        self.db.customers.create_index('customer_id', unique=True)
        self.db.customers.create_index('email')
        self.db.properties.create_index('property_id', unique=True)
        self.db.bookings.create_index('booking_id', unique=True)
        self.db.payments.create_index('payment_id', unique=True)
        
    def close(self):
        """Close database connection"""
        db_connection.close()
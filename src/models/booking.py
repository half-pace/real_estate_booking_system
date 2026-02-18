"""
Booking model for booking management
"""
from datetime import datetime
from src.utils.helpers import generate_id


class BookingModel:
    """Booking management operations"""
    
    def __init__(self, db):
        self.collection = db['bookings']
        self.properties = db['properties']
    
    def create_booking(self, booking_data):
        """Create a new booking"""
        # Check property availability
        property_doc = self.properties.find_one({'property_id': booking_data['property_id']})
        
        if not property_doc:
            return None, "Property not found"
        
        if property_doc['status'] != 'available':
            return None, "Property not available"
        
        # Check for conflicting bookings
        check_in = booking_data['check_in_date']
        check_out = booking_data['check_out_date']
        
        conflicting = self.collection.find_one({
            'property_id': booking_data['property_id'],
            'booking_status': {'$in': ['confirmed', 'pending']},
            '$or': [
                {
                    'check_in_date': {'$lte': check_out},
                    'check_out_date': {'$gte': check_in}
                }
            ]
        })
        
        if conflicting:
            return None, "Property already booked for these dates"
        
        booking_id = generate_id(self.collection, 'B')
        
        # Calculate total amount
        days = (check_out - check_in).days
        total_amount = days * property_doc['price_per_day']
        
        booking = {
            'booking_id': booking_id,
            'customer_id': booking_data['customer_id'],
            'property_id': booking_data['property_id'],
            'check_in_date': check_in,
            'check_out_date': check_out,
            'num_occupants': booking_data['num_occupants'],
            'total_amount': total_amount,
            'booking_status': 'pending',
            'created_at': datetime.now()
        }
        
        self.collection.insert_one(booking)
        
        # Update property status
        self.properties.update_one(
            {'property_id': booking_data['property_id']},
            {'$set': {'status': 'booked'}}
        )
        
        return booking_id, None
    
    def update_booking_status(self, booking_id, status):
        """Update booking status"""
        booking = self.collection.find_one({'booking_id': booking_id})
        
        if not booking:
            return False
        
        result = self.collection.update_one(
            {'booking_id': booking_id},
            {'$set': {'booking_status': status}}
        )
        
        # Update property status
        if status in ['cancelled', 'completed']:
            self.properties.update_one(
                {'property_id': booking['property_id']},
                {'$set': {'status': 'available'}}
            )
        
        return result.modified_count > 0
    
    def cancel_booking(self, booking_id):
        """Cancel a booking"""
        return self.update_booking_status(booking_id, 'cancelled')
    
    def get_booking(self, booking_id):
        """Get booking by ID"""
        return self.collection.find_one({'booking_id': booking_id})
    
    def get_all_bookings(self):
        """Get all bookings"""
        return list(self.collection.find())
    
    def get_customer_bookings(self, customer_id):
        """Get bookings for a customer"""
        return list(self.collection.find({'customer_id': customer_id}))
    
    def get_property_bookings(self, property_id):
        """Get bookings for a property"""
        return list(self.collection.find({'property_id': property_id}))
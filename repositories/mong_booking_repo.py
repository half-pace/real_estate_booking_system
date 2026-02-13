from database.mongo_connection import get_database
from models import Booking

class MongoBookingRepository:
    def __init__(self):
        self.db = get_database()
        self.collection = self.db['bookings']
        
    def add(self, booking):
        self.collection.insert_one({
            "booking_id": booking.booking_id,
            "property_id": booking.property_id,
            "customer_id": booking.customer_id,
            "start_date": booking.start_date,
            "end_date": booking.end_date,
            "total_price": booking.total_price
        })
        
    def get_by_id(self, booking_id):
        data = self.collection.find_one({"booking_id": booking_id})
        
        if data:
            return Booking(
                data["booking_id"],
                data["property_id"],
                data["customer_id"],
                data["start_date"],
                data["end_date"],
                data["total_price"]
            )
        return None
    
    def get_all(self):
        bookings = []
        
        for data in self.collection.find():
            booking = Booking(
                data["booking_id"],
                data["property_id"],
                data["customer_id"],
                data["start_date"],
                data["end_date"],
                data["total_price"]
            )
            bookings.append(booking)
        return bookings
    
    def delete(self, booking_id):
        result = self.collection.delete_one({"booking_id": booking_id})
        return result.deleted_count > 0
    
    def get_by_property(self, property_id):
        bookings = []
        
        for data in self.collection.find({"property_id": property_id}):
            bookings.append(
                Booking(
                    data["booking_id"],
                    data["property_id"],
                    data["customer_id"],
                    data["start_date"],
                    data["end_date"],
                    data["total_price"]
                )
            )
        return bookings
    
    def get_by_customer(self, customer_id):
        bookings = []
        
        for data in self.collection.find({"customer_id": customer_id}):
            bookings.append(
                Booking(
                    data["booking_id"],
                    data["property_id"],
                    data["customer_id"],
                    data["start_date"],
                    data["end_date"],
                    data["total_price"]
                )
            )
            
        return bookings
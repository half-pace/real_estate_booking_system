class BookingRepo:
    def __init__(self):
        self.bookings = {}
        
    def add(self, booking):
        self.bookings[booking.booking_id] = booking
        
    def get_by_id(self, booking_id):
        return self.bookings.get(booking_id)
    
    def get_all(self):
        return list(self.bookings.values())
    
    def delete(self, booking_id):
        if booking_id in self.bookings:
            del self.bookings[booking_id]
            return True
        return False
    
    def get_by_property(self, property_id):
        return [
            booking for booking in self.bookings.values() 
            if booking.property_id == property_id
        ]
        
    def get_by_customer(self, customer_id):
        return [
            booking for booking in self.bookings.values() 
            if booking.customer_id == customer_id
        ]
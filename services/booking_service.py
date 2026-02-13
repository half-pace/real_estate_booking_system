"""
- Create booking
- Check availability
- Mark property unavailable
- Calculate price
"""

class BookingService:
    def __init__(self, booking_repo, property_repo, user_repo):
        self.booking_repo = booking_repo
        self.property_repo = property_repo
        self.user_repo = user_repo
        
    def create_booking(self, booking_id, property_id, customer_id, start_date, end_date, days):
        property_obj = self.property_repo.get_by_id(property_id)
        customer = self.user_repo.get_by_id(customer_id)
        
        if not property_obj:
            raise ValueError("Property not found")
        
        if not customer:
            raise ValueError("Customer not found") 
        
        if customer.role != "CUSTOMER":
            raise PermissionError("Only customers can book properties")
        
        if not property_obj.is_available:
            raise ValueError("Property is not available for booking")
        
        total_price = property_obj.price_per_day * days
        
        from models import Booking
        booking = Booking(
            booking_id,
            property_id,
            customer_id,
            start_date,
            end_date,
            total_price 
        )
        
        self.booking_repo.add(booking)
        
        #to mark property unavailable 
        #property_obj.mark_unavailable()
        self.property_repo.update_availability(property_id, False)
        
        return booking
    
    def get_booking(self, booking_id):
        return self.booking_repo.get_by_id(booking_id)
    
    def get_all_bookings(self):
        return self.booking_repo.get_all()
    
    def cancel_booking(self, booking_id):
        booking = self.booking_repo.get_by_id(booking_id)
        
        if not booking:
            return False
        
        property_obj = self.property_repo.get_by_id(booking.property_id)
        #property_obj.mark_available()
        self.property_repo.update_availability(booking.property_id, True)
        
        return self.booking_repo.delete(booking_id) 
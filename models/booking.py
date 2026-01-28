

class Booking:
    def __init__(self, booking_id, user_id, property_id, start_date, end_date, booking_date, status):
        self.booking_id = booking_id
        self.user_id = user_id
        self.property_id = property_id
        self.start_date = start_date
        self.end_date = end_date
        self.booking_date = booking_date
        self.status = status
        
    #methods
    def confirm(self):
        pass
    
    def cancel(self):
        pass
    
    def mark_completed(self):
        pass
    
    def get_duration(self):
        pass
    
    def __str__(self):
        return f"Booking(Booking_ID: {self.booking_id}, User_ID: {self.user_id}, Property_ID: {self.property_id}, Start_Date: {self.start_date}, End_Date: {self.end_date}, Booking_Date: {self.booking_date}, and Status: {self.status})"
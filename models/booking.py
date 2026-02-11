

class Booking:
    def __init__(self, booking_id, customer_id, property_id, start_date, end_date, total_price):
        self.booking_id = booking_id
        self.customer_id = customer_id
        self.property_id = property_id
        self.start_date = start_date
        self.end_date = end_date
        self.total_price = total_price
        #self.booking_date = booking_date
        #self.status = "Confirmed"
        
    #methods
    def __str__(self):
        return(
            f"Booking #{self.booking_id} | "
            f"Customer #{self.customer_id} | "
            f"Property #{self.property_id}"
        )
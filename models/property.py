

class Property:
    def __init__(self, property_id, title, location, price_per_day, owner_id, is_available):
        self.id = property_id
        self.title = title
        #self.description = description
        self.location = location
        self.price_per_day = price_per_day
        #self.property_type = property_type
        self.owner_id = owner_id
        #self.amenities = amenities
        self.is_available = True
        
    #methods
    def mark_available(self):
        self.is_available = True
    
    def mark_unavailable(self):
        self.is_available = False
    
    def __str__(self):
        status = "Available" if self.is_available else "Booked"
        return f"Property(Property_ID: {self.property_id}, Title: {self.title}, Location: {self.location}, Price: {self.price_per_day}, Owner_ID: {self.owner_id}, and Availablitily_Status: {status})"
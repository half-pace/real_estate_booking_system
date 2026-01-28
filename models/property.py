

class Property:
    def __init__(self, property_id, title, description, location, price, property_type, owner_id, amenities, availability_status):
        self.id = property_id
        self.title = title
        self.description = description
        self.location = location
        self.price = price
        self.property_type = property_type
        self.owner_id = owner_id
        self.amenities = amenities
        self.availability_status = availability_status
        
    #methods
    def update_details(self):
        pass
    
    def mark_available(self):
        pass
    
    def mark_unavailable(self):
        pass
    
    def __str__(self):
        return f"Property(Property_ID: {self.property_id}, Title: {self.title}, Description: {self.description}, Location: {self.location}, Price: {self.price}, Property_type: {self.property_type}, Owner_ID: {self.owner_id}, Amenities: {self.amenities}, and Availablitily_Status: {self.availability_status})"
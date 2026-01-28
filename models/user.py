#user file for 3 types of users
# admin - owner - customer

#base user
class User:
    def __init__(self, user_id, name, email, phone, role):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.phone = phone
        self.role = role
        
    #methods
    def get_user_id(self):
        #returns user's ID
        pass
    
    def get_role(self):
        #returns the role of the User
        pass
    
    def display_profile(self):
        pass
    
    def update_name(self):
        pass
    
    def update_email(self):
        pass
    
    def update_phone(self):
        pass
    
    def __str__(self):
        return f"User(User_ID: {self.user_id}, Name: {self.name}, Email: {self.email}, Phone: {self.phone}, and Role: {self.role})"
    
class Customer(User):
    def __init__(self, user_id, name, email, phone, role, booking_history, saved_properties):
        super().__init__(user_id, name, email, phone, role)
        self.booking_history = booking_history
        self.saved_properties = saved_properties
        
    
    #methods
    def view_booking_history(self):
        #returns list of booking ids or objects of past bookings
        pass
    
    def view_saved_properties(self):
        #returns saved list of property ids
        pass

class propertyOwner(User):
    def __init__(self, user_id, name, email, phone, role, owned_properties):
        super().__init__(user_id, name, email, phone, role)
        self.owned_properties = owned_properties
        
    def view_owned_properties(self):
        #returns list of property ids owned by the user
        pass

class Admin(User):
    pass
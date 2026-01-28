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
        
    
    
class Customer(User):
    def __init__(self, user_id, name, email, phone, role, booking_history, saved_properties):
        super().__init__(user_id, name, email, phone, role)
        self.booking_history = booking_history
        self.saved_properties = saved_properties

class propertyOwner(User):
    def __init__(self, user_id, name, email, phone, role, owned_properties):
        super().__init__(user_id, name, email, phone, role)
        self.owned_properties = owned_properties

class Admin(User):
    pass
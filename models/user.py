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
        
    
    
class Customer:
    pass

class Owner:
    pass

class Admin:
    pass
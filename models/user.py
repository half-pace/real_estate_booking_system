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
    def is_admin(self):
        return self.role == "ADMIN"
    
    def is_owner(self):
        return self.role == "OWNER"
    
    def is_customer(self):
        return self.role == "CUSTOMER"
    
    def __str__(self):
        return f"User(User_ID: {self.user_id}, Name: {self.name}, Email: {self.email}, Phone: {self.phone}, and Role: {self.role})"
    
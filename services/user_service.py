"""
- Registers new users
- Get users
- Basic validation
"""

class UserService:
    def __init__(self, user_repo):
        self.user_repo = user_repo
        
    def register_user(self, user_id, name, email, phone, role):
        if self.user_repo.get_by_id(user_id):
            raise ValueError("User with this ID already exists.")
        
        from models import User
        user = User(user_id, name, email, phone, role)
        
        self.user_repo.add(user)
        return user
    
    def get_user(self, user_id):
        return self.user_repo.get_by_id(user_id)
    
    def get_all_users(self):
        return self.user_repo.get_all()
    
    def delete_user(self, user_id):
        return self.user_repo.delete(user_id)
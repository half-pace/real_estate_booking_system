"""
User model for authentication and user management
"""
import hashlib
from datetime import datetime
from src.utils.helpers import generate_id


class UserModel:
    """User management operations"""
    
    def __init__(self, db):
        self.collection = db['users']
        
    @staticmethod
    def hash_password(password):
        """Hash password using SHA-256"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def create_user(self, username, password, role='agent'):
        """Create a new user"""
        user_id = generate_id(self.collection, 'U')
        
        user = {
            'user_id': user_id,
            'username': username,
            'password': self.hash_password(password),
            'role': role,
            'created_at': datetime.now()
        }
        
        self.collection.insert_one(user)
        return user_id
    
    def authenticate(self, username, password):
        """Authenticate user"""
        user = self.collection.find_one({
            'username': username,
            'password': self.hash_password(password)
        })
        return user
    
    def get_user(self, user_id):
        """Get user by ID"""
        return self.collection.find_one({'user_id': user_id})
    
    def update_user(self, user_id, update_data):
        """Update user information"""
        result = self.collection.update_one(
            {'user_id': user_id},
            {'$set': update_data}
        )
        return result.modified_count > 0
    
    def delete_user(self, user_id):
        """Delete a user"""
        result = self.collection.delete_one({'user_id': user_id})
        return result.deleted_count > 0
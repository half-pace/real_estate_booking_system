from database.mongo_connection import get_database
from models import User

class MongoUserRepository:
    def __init__(self):
        self.db = get_database()
        self.collection = self.db["users"]
        
    def add(self, user):
        self.collection.insert_one({
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role
        })
        
    def get_by_id(self, user_id):
        data = self.collection.find_one({"user_id": user_id})
        if data:
            return User(
                data["user_id"],
                data["name"],
                data["email"],
                data["phone"],
                data["role"]
            )
        return None 
    
    def get_all(self):
        users = []
        for data in self.collection.find():
            users.append(
                User(
                    data["user_id"],
                    data["name"],
                    data["email"],
                    data["phone"],
                    data["role"]
                )
            )
        return users
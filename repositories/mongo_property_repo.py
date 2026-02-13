from database.mongo_connection import get_database
from models import Property, user

class MongoPropertyRepository:
    def __init__(self):
        self.db = get_database()
        self.collection = self.db["properties"]
        
    def add(self, property_obj):

        self.collection.insert_one({
            "property_id": property_obj.property_id,
            "title": property_obj.title,
            "location": property_obj.location,
            "price_per_day": property_obj.price_per_day,
            "owner_id": property_obj.owner_id,
            "is_available": property_obj.is_available
        })
        
    def get_by_id(self, property_id):
        data = self.collection.find_one({"property_id": property_id})
        if data:
            prop = Property(
                data["property_id"],
                data["title"],
                data["location"],
                data["price_per_day"],
                data["owner_id"]
            )
            prop.is_available = data["is_available"]
            return prop
        return None
    
    def get_all(self):
        properties = []
        for data in self.collection.find():
            prop = Property(
                    data["property_id"],
                    data["title"],
                    data["location"],
                    data["price_per_day"],
                    data["owner_id"]
            )
            prop.is_available = data["is_available"]
            properties.append(prop)
        return properties
    
    def delete(self, property_id):
        result = self.collection.delete_one({"property_id": property_id})
        return result.deleted_count > 0
    
    def update_availability(self, property_id, is_available):
        self.collection.update_one(
            {"property_id": property_id},
            {"$set": {"is_available": is_available}}
        )
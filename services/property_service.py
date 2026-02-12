"""
- Add property (only Owners allowed)\
- List properties
- Remove property (admin or owner)
"""

class PropertyService:
    def __init__(self, property_repo, user_repo):
        self.property_repo = property_repo
        self.user_repo = user_repo
        
    def add_property(self, property_id, title, location, price_per_day, owner_id):
        owner = self.user_repo.get_by_id(owner_id)
        
        if not owner:
            raise ValueError("Owner not found.")
        
        if owner.role != "OWNER":
            raise PermissionError("Only owners can add properties.")
        
        from models import Property 
        property_obj = Property(property_id, title, location, price_per_day, owner_id)
        
        self.property_repo.add(property_obj)
        return property_obj
    
    def get_property(self, property_id):
        return self.property_repo.get_by_id(property_id)
    
    def get_all_properties(self):
        return self.property_repo.get_all()
    
    def delete_property(self, property_id, requester_id):
        requester = self.user_repo.get_by_id(requester_id)
        property_obj = self.property_repo.get_by_id(property_id)
        
        if not property_obj:
            return False
        
        if requester.role == "ADMIN" or property_obj.owner_id == requester_id:
            return self.property_repo.delete(property_id)
        
        raise PermissionError("Not authorized to delete this property.")
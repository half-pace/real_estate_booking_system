class PropertyRepo:
    def __init__(self):
        self.properties = {}
        
    def add(self, property_obj):
        self.properties[property_obj.property_id] = property_obj
        
    def get_by_id(self, property_id):
        return self.properties.get(property_id)
    
    def get_all(self):
        return list(self.properties.values())
    
    def delete(self, property_id):
        if property_id in self.properties:
            del self.properties[property_id]
            return True
        return False
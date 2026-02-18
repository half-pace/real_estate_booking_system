"""
Property model for property management
"""
from datetime import datetime
from src.utils.helpers import generate_id


class PropertyModel:
    """Property management operations"""
    
    def __init__(self, db):
        self.collection = db['properties']
    
    def add_property(self, property_data):
        """Add a new property"""
        property_id = generate_id(self.collection, 'P')
        
        property_doc = {
            'property_id': property_id,
            'property_name': property_data['property_name'],
            'address': property_data['address'],
            'property_type': property_data['property_type'],
            'price_per_day': float(property_data['price_per_day']),
            'bedrooms': int(property_data['bedrooms']),
            'bathrooms': int(property_data['bathrooms']),
            'area_sqft': float(property_data['area_sqft']),
            'amenities': property_data.get('amenities', []),
            'status': 'available',
            'created_at': datetime.now()
        }
        
        self.collection.insert_one(property_doc)
        return property_id
    
    def update_property(self, property_id, update_data):
        """Update property information"""
        result = self.collection.update_one(
            {'property_id': property_id},
            {'$set': update_data}
        )
        return result.modified_count > 0
    
    def delete_property(self, property_id):
        """Delete a property"""
        result = self.collection.delete_one({'property_id': property_id})
        return result.deleted_count > 0
    
    def get_property(self, property_id):
        """Get property by ID"""
        return self.collection.find_one({'property_id': property_id})
    
    def get_all_properties(self):
        """Get all properties"""
        return list(self.collection.find())
    
    def get_available_properties(self):
        """Get available properties"""
        return list(self.collection.find({'status': 'available'}))
    
    def search_properties(self, criteria):
        """Search properties by criteria"""
        query = {}
        
        if 'property_type' in criteria and criteria['property_type']:
            query['property_type'] = criteria['property_type']
            
        if 'min_price' in criteria and criteria['min_price']:
            query['price_per_day'] = {'$gte': float(criteria['min_price'])}
            
        if 'max_price' in criteria and criteria['max_price']:
            if 'price_per_day' in query:
                query['price_per_day']['$lte'] = float(criteria['max_price'])
            else:
                query['price_per_day'] = {'$lte': float(criteria['max_price'])}
                
        if 'bedrooms' in criteria and criteria['bedrooms']:
            query['bedrooms'] = {'$gte': int(criteria['bedrooms'])}
            
        if 'status' in criteria and criteria['status']:
            query['status'] = criteria['status']
        
        return list(self.collection.find(query))
    
    def update_property_status(self, property_id, status):
        """Update property status"""
        return self.update_property(property_id, {'status': status})
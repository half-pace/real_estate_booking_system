"""
Customer model for customer management
"""
from datetime import datetime
from src.utils.helpers import generate_id
from src.utils.validators import validate_email, validate_phone


class CustomerModel:
    """Customer management operations"""
    
    def __init__(self, db):
        self.collection = db['customers']
    
    def add_customer(self, customer_data):
        """Add a new customer"""
        # Validate data
        if not validate_email(customer_data.get('email', '')):
            raise ValueError("Invalid email format")
        
        if not validate_phone(customer_data.get('phone', '')):
            raise ValueError("Invalid phone format")
        
        customer_id = generate_id(self.collection, 'C')
        
        customer = {
            'customer_id': customer_id,
            'full_name': customer_data['full_name'],
            'email': customer_data['email'],
            'phone': customer_data['phone'],
            'address': customer_data['address'],
            'id_proof_type': customer_data['id_proof_type'],
            'id_proof_number': customer_data['id_proof_number'],
            'registration_date': datetime.now()
        }
        
        self.collection.insert_one(customer)
        return customer_id
    
    def update_customer(self, customer_id, update_data):
        """Update customer information"""
        # Validate email if provided
        if 'email' in update_data and not validate_email(update_data['email']):
            raise ValueError("Invalid email format")
        
        # Validate phone if provided
        if 'phone' in update_data and not validate_phone(update_data['phone']):
            raise ValueError("Invalid phone format")
        
        result = self.collection.update_one(
            {'customer_id': customer_id},
            {'$set': update_data}
        )
        return result.modified_count > 0
    
    def delete_customer(self, customer_id):
        """Delete a customer"""
        result = self.collection.delete_one({'customer_id': customer_id})
        return result.deleted_count > 0
    
    def get_customer(self, customer_id):
        """Get customer by ID"""
        return self.collection.find_one({'customer_id': customer_id})
    
    def get_all_customers(self):
        """Get all customers"""
        return list(self.collection.find())
    
    def search_customers(self, query):
        """Search customers by name, email, or phone"""
        return list(self.collection.find({
            '$or': [
                {'full_name': {'$regex': query, '$options': 'i'}},
                {'email': {'$regex': query, '$options': 'i'}},
                {'phone': {'$regex': query, '$options': 'i'}}
            ]
        }))
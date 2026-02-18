"""
Payment model for payment management
"""
from datetime import datetime
from src.utils.helpers import generate_id


class PaymentModel:
    """Payment management operations"""
    
    def __init__(self, db):
        self.collection = db['payments']
        self.bookings = db['bookings']
    
    def record_payment(self, payment_data):
        """Record a new payment"""
        payment_id = generate_id(self.collection, 'PAY')
        
        payment = {
            'payment_id': payment_id,
            'booking_id': payment_data['booking_id'],
            'customer_id': payment_data['customer_id'],
            'amount_paid': float(payment_data['amount_paid']),
            'payment_date': datetime.now(),
            'payment_method': payment_data['payment_method'],
            'payment_status': 'completed'
        }
        
        self.collection.insert_one(payment)
        
        # Update booking status to confirmed
        self.bookings.update_one(
            {'booking_id': payment_data['booking_id']},
            {'$set': {'booking_status': 'confirmed'}}
        )
        
        return payment_id
    
    def get_payment(self, payment_id):
        """Get payment by ID"""
        return self.collection.find_one({'payment_id': payment_id})
    
    def get_booking_payments(self, booking_id):
        """Get payments for a booking"""
        return list(self.collection.find({'booking_id': booking_id}))
    
    def get_customer_payments(self, customer_id):
        """Get payments for a customer"""
        return list(self.collection.find({'customer_id': customer_id}))
    
    def get_revenue_report(self, start_date=None, end_date=None):
        """Generate revenue report"""
        query = {'payment_status': 'completed'}
        
        if start_date and end_date:
            query['payment_date'] = {'$gte': start_date, '$lte': end_date}
        
        payments = list(self.collection.find(query))
        total_revenue = sum(p['amount_paid'] for p in payments)
        
        return {
            'total_payments': len(payments),
            'total_revenue': total_revenue,
            'payments': payments
        }
    
    def get_booking_statistics(self):
        """Get booking statistics"""
        total_bookings = self.bookings.count_documents({})
        confirmed = self.bookings.count_documents({'booking_status': 'confirmed'})
        pending = self.bookings.count_documents({'booking_status': 'pending'})
        cancelled = self.bookings.count_documents({'booking_status': 'cancelled'})
        completed = self.bookings.count_documents({'booking_status': 'completed'})
        
        return {
            'total': total_bookings,
            'confirmed': confirmed,
            'pending': pending,
            'cancelled': cancelled,
            'completed': completed
        }
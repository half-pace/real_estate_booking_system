"""
Validation functions
"""
import re


def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_phone(phone):
    """Validate phone number format"""
    # Remove spaces, dashes, and parentheses
    cleaned = re.sub(r'[\s\-\(\)]', '', phone)
    
    # Check if it contains only digits and optional + at the start
    pattern = r'^\+?\d{10,15}$'
    return re.match(pattern, cleaned) is not None


def validate_date_range(start_date, end_date):
    """Validate date range"""
    return end_date > start_date


def validate_positive_number(value):
    """Validate positive number"""
    try:
        num = float(value)
        return num > 0
    except (ValueError, TypeError):
        return False
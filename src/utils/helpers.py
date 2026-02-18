"""
Helper functions
"""
from datetime import datetime


def generate_id(collection, prefix):
    """Generate unique ID for entities"""
    count = collection.count_documents({})
    return f"{prefix}{str(count + 1).zfill(4)}"


def format_currency(amount):
    """Format amount as currency"""
    return f"${amount:,.2f}"


def format_date(date, format_str='%Y-%m-%d'):
    """Format date"""
    if isinstance(date, datetime):
        return date.strftime(format_str)
    return str(date)


def calculate_days(start_date, end_date):
    """Calculate number of days between dates"""
    return (end_date - start_date).days


def clear_screen():
    """Clear console screen"""
    import os
    os.system('cls' if os.name == 'nt' else 'clear')
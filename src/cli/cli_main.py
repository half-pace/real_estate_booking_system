"""
CLI Main Application
Command-line interface for Real Estate Booking System
"""
import sys
from datetime import datetime
from src.database.models import DatabaseManager
from src.config.settings import DEFAULT_ADMIN
from src.utils.helpers import clear_screen, format_currency, format_date


class RealEstateBookingCLI:
    """Command-line interface for the booking system"""
    
    def __init__(self):
        try:
            self.db = DatabaseManager()
            self.current_user = None
            self.ensure_default_admin()
        except Exception as e:
            print(f"Error connecting to database: {e}")
            print("Please ensure MongoDB is running on localhost:27017")
            sys.exit(1)
    
    def ensure_default_admin(self):
        """Create default admin if doesn't exist"""
        admin = self.db.users.collection.find_one({'username': DEFAULT_ADMIN['username']})
        if not admin:
            self.db.users.create_user(
                DEFAULT_ADMIN['username'],
                DEFAULT_ADMIN['password'],
                DEFAULT_ADMIN['role']
            )
    
    def print_header(self, title):
        """Print formatted header"""
        clear_screen()
        print("=" * 70)
        print(f"  {title}".center(70))
        print("=" * 70)
        print()
    
    def print_menu(self, options):
        """Print menu options"""
        for i, option in enumerate(options, 1):
            print(f"  {i}. {option}")
        print("  0. Go Back/Exit")
        print()
    
    def get_choice(self, max_choice):
        """Get user choice"""
        while True:
            try:
                choice = int(input("Enter your choice: "))
                if 0 <= choice <= max_choice:
                    return choice
                print(f"Please enter a number between 0 and {max_choice}")
            except ValueError:
                print("Please enter a valid number")
    
    def get_input(self, prompt, required=True):
        """Get user input"""
        while True:
            value = input(prompt).strip()
            if value or not required:
                return value
            print("This field is required.")
    
    def get_date_input(self, prompt):
        """Get date input from user"""
        while True:
            date_str = input(prompt + " (YYYY-MM-DD): ")
            try:
                return datetime.strptime(date_str, "%Y-%m-%d")
            except ValueError:
                print("Invalid date format. Please use YYYY-MM-DD")
    
    def login(self):
        """User login"""
        self.print_header("Login - Real Estate Booking System")
        username = self.get_input("Username: ")
        password = self.get_input("Password: ")
        
        user = self.db.users.authenticate(username, password)
        if user:
            self.current_user = user
            print(f"\n✓ Welcome {username}!")
            input("\nPress Enter to continue...")
            return True
        else:
            print("\n✗ Invalid credentials!")
            input("\nPress Enter to continue...")
            return False
    
    # Customer Management
    def customer_menu(self):
        """Customer management menu"""
        while True:
            self.print_header("Customer Management")
            options = [
                "Add New Customer",
                "View All Customers",
                "Search Customer",
                "Update Customer",
                "Delete Customer",
                "View Customer Bookings"
            ]
            self.print_menu(options)
            
            choice = self.get_choice(len(options))
            
            if choice == 0:
                break
            elif choice == 1:
                self.add_customer()
            elif choice == 2:
                self.view_all_customers()
            elif choice == 3:
                self.search_customer()
            elif choice == 4:
                self.update_customer()
            elif choice == 5:
                self.delete_customer()
            elif choice == 6:
                self.view_customer_bookings()
    
    def add_customer(self):
        """Add new customer"""
        self.print_header("Add New Customer")
        
        customer_data = {
            'full_name': self.get_input("Full Name: "),
            'email': self.get_input("Email: "),
            'phone': self.get_input("Phone: "),
            'address': self.get_input("Address: "),
            'id_proof_type': self.get_input("ID Proof Type (Passport/License/etc): "),
            'id_proof_number': self.get_input("ID Proof Number: ")
        }
        
        try:
            customer_id = self.db.customers.add_customer(customer_data)
            print(f"\n✓ Customer added successfully! Customer ID: {customer_id}")
        except Exception as e:
            print(f"\n✗ Error adding customer: {e}")
        
        input("\nPress Enter to continue...")
    
    def view_all_customers(self):
        """View all customers"""
        self.print_header("All Customers")
        
        customers = self.db.customers.get_all_customers()
        if not customers:
            print("No customers found.")
        else:
            for customer in customers:
                self.print_customer(customer)
                print("-" * 70)
        
        input("\nPress Enter to continue...")
    
    def search_customer(self):
        """Search customers"""
        self.print_header("Search Customer")
        
        query = self.get_input("Enter search term (name/email/phone): ")
        customers = self.db.customers.search_customers(query)
        
        if not customers:
            print("\nNo customers found.")
        else:
            print(f"\nFound {len(customers)} customer(s):\n")
            for customer in customers:
                self.print_customer(customer)
                print("-" * 70)
        
        input("\nPress Enter to continue...")
    
    def update_customer(self):
        """Update customer"""
        self.print_header("Update Customer")
        
        customer_id = self.get_input("Enter Customer ID: ")
        customer = self.db.customers.get_customer(customer_id)
        
        if not customer:
            print("\n✗ Customer not found!")
            input("\nPress Enter to continue...")
            return
        
        print("\nCurrent Information:")
        self.print_customer(customer)
        
        print("\nEnter new information (press Enter to keep current value):")
        
        update_data = {}
        
        new_name = self.get_input(f"Full Name [{customer['full_name']}]: ", False)
        if new_name:
            update_data['full_name'] = new_name
        
        new_email = self.get_input(f"Email [{customer['email']}]: ", False)
        if new_email:
            update_data['email'] = new_email
        
        new_phone = self.get_input(f"Phone [{customer['phone']}]: ", False)
        if new_phone:
            update_data['phone'] = new_phone
        
        new_address = self.get_input(f"Address [{customer['address']}]: ", False)
        if new_address:
            update_data['address'] = new_address
        
        if update_data:
            try:
                if self.db.customers.update_customer(customer_id, update_data):
                    print("\n✓ Customer updated successfully!")
                else:
                    print("\n✗ Error updating customer!")
            except Exception as e:
                print(f"\n✗ Error: {e}")
        else:
            print("\nNo changes made.")
        
        input("\nPress Enter to continue...")
    
    def delete_customer(self):
        """Delete customer"""
        self.print_header("Delete Customer")
        
        customer_id = self.get_input("Enter Customer ID: ")
        customer = self.db.customers.get_customer(customer_id)
        
        if not customer:
            print("\n✗ Customer not found!")
            input("\nPress Enter to continue...")
            return
        
        print("\nCustomer to delete:")
        self.print_customer(customer)
        
        confirm = self.get_input("\nAre you sure you want to delete this customer? (yes/no): ")
        if confirm.lower() == 'yes':
            if self.db.customers.delete_customer(customer_id):
                print("\n✓ Customer deleted successfully!")
            else:
                print("\n✗ Error deleting customer!")
        else:
            print("\nDeletion cancelled.")
        
        input("\nPress Enter to continue...")
    
    def view_customer_bookings(self):
        """View customer bookings"""
        self.print_header("View Customer Bookings")
        
        customer_id = self.get_input("Enter Customer ID: ")
        bookings = self.db.bookings.get_customer_bookings(customer_id)
        
        if not bookings:
            print("\nNo bookings found for this customer.")
        else:
            print(f"\nFound {len(bookings)} booking(s):\n")
            for booking in bookings:
                self.print_booking(booking)
                print("-" * 70)
        
        input("\nPress Enter to continue...")
    
    def print_customer(self, customer):
        """Print customer details"""
        print(f"Customer ID: {customer['customer_id']}")
        print(f"Name: {customer['full_name']}")
        print(f"Email: {customer['email']}")
        print(f"Phone: {customer['phone']}")
        print(f"Address: {customer['address']}")
        print(f"ID Proof: {customer['id_proof_type']} - {customer['id_proof_number']}")
        print(f"Registered: {format_date(customer['registration_date'])}")
    
    # Property Management
    def property_menu(self):
        """Property management menu"""
        while True:
            self.print_header("Property Management")
            options = [
                "Add New Property",
                "View All Properties",
                "View Available Properties",
                "Search Properties",
                "Update Property",
                "Delete Property",
                "Change Property Status"
            ]
            self.print_menu(options)
            
            choice = self.get_choice(len(options))
            
            if choice == 0:
                break
            elif choice == 1:
                self.add_property()
            elif choice == 2:
                self.view_all_properties()
            elif choice == 3:
                self.view_available_properties()
            elif choice == 4:
                self.search_properties()
            elif choice == 5:
                self.update_property()
            elif choice == 6:
                self.delete_property()
            elif choice == 7:
                self.change_property_status()
    
    def add_property(self):
        """Add new property"""
        self.print_header("Add New Property")
        
        property_data = {
            'property_name': self.get_input("Property Name: "),
            'address': self.get_input("Address: "),
            'property_type': self.get_input("Type (house/apartment/commercial): "),
            'price_per_day': self.get_input("Price per Day: "),
            'bedrooms': self.get_input("Number of Bedrooms: "),
            'bathrooms': self.get_input("Number of Bathrooms: "),
            'area_sqft': self.get_input("Area (sq ft): "),
            'amenities': []
        }
        
        amenities_str = self.get_input("Amenities (comma-separated): ", False)
        if amenities_str:
            property_data['amenities'] = [a.strip() for a in amenities_str.split(',')]
        
        try:
            property_id = self.db.properties.add_property(property_data)
            print(f"\n✓ Property added successfully! Property ID: {property_id}")
        except Exception as e:
            print(f"\n✗ Error adding property: {e}")
        
        input("\nPress Enter to continue...")
    
    def view_all_properties(self):
        """View all properties"""
        self.print_header("All Properties")
        
        properties = self.db.properties.get_all_properties()
        if not properties:
            print("No properties found.")
        else:
            for prop in properties:
                self.print_property(prop)
                print("-" * 70)
        
        input("\nPress Enter to continue...")
    
    def view_available_properties(self):
        """View available properties"""
        self.print_header("Available Properties")
        
        properties = self.db.properties.get_available_properties()
        if not properties:
            print("No available properties found.")
        else:
            for prop in properties:
                self.print_property(prop)
                print("-" * 70)
        
        input("\nPress Enter to continue...")
    
    def search_properties(self):
        """Search properties"""
        self.print_header("Search Properties")
        
        print("Enter search criteria (press Enter to skip):\n")
        
        criteria = {}
        
        prop_type = self.get_input("Property Type (house/apartment/commercial): ", False)
        if prop_type:
            criteria['property_type'] = prop_type
        
        min_price = self.get_input("Minimum Price: ", False)
        if min_price:
            criteria['min_price'] = min_price
        
        max_price = self.get_input("Maximum Price: ", False)
        if max_price:
            criteria['max_price'] = max_price
        
        bedrooms = self.get_input("Minimum Bedrooms: ", False)
        if bedrooms:
            criteria['bedrooms'] = bedrooms
        
        properties = self.db.properties.search_properties(criteria)
        
        if not properties:
            print("\nNo properties found matching criteria.")
        else:
            print(f"\nFound {len(properties)} propertie(s):\n")
            for prop in properties:
                self.print_property(prop)
                print("-" * 70)
        
        input("\nPress Enter to continue...")
    
    def update_property(self):
        """Update property"""
        self.print_header("Update Property")
        
        property_id = self.get_input("Enter Property ID: ")
        prop = self.db.properties.get_property(property_id)
        
        if not prop:
            print("\n✗ Property not found!")
            input("\nPress Enter to continue...")
            return
        
        print("\nCurrent Information:")
        self.print_property(prop)
        
        print("\nEnter new information (press Enter to keep current value):")
        
        update_data = {}
        
        new_name = self.get_input(f"Property Name [{prop['property_name']}]: ", False)
        if new_name:
            update_data['property_name'] = new_name
        
        new_address = self.get_input(f"Address [{prop['address']}]: ", False)
        if new_address:
            update_data['address'] = new_address
        
        new_price = self.get_input(f"Price per Day [{prop['price_per_day']}]: ", False)
        if new_price:
            update_data['price_per_day'] = float(new_price)
        
        if update_data:
            if self.db.properties.update_property(property_id, update_data):
                print("\n✓ Property updated successfully!")
            else:
                print("\n✗ Error updating property!")
        else:
            print("\nNo changes made.")
        
        input("\nPress Enter to continue...")
    
    def delete_property(self):
        """Delete property"""
        self.print_header("Delete Property")
        
        property_id = self.get_input("Enter Property ID: ")
        prop = self.db.properties.get_property(property_id)
        
        if not prop:
            print("\n✗ Property not found!")
            input("\nPress Enter to continue...")
            return
        
        print("\nProperty to delete:")
        self.print_property(prop)
        
        confirm = self.get_input("\nAre you sure you want to delete this property? (yes/no): ")
        if confirm.lower() == 'yes':
            if self.db.properties.delete_property(property_id):
                print("\n✓ Property deleted successfully!")
            else:
                print("\n✗ Error deleting property!")
        else:
            print("\nDeletion cancelled.")
        
        input("\nPress Enter to continue...")
    
    def change_property_status(self):
        """Change property status"""
        self.print_header("Change Property Status")
        
        property_id = self.get_input("Enter Property ID: ")
        prop = self.db.properties.get_property(property_id)
        
        if not prop:
            print("\n✗ Property not found!")
            input("\nPress Enter to continue...")
            return
        
        print(f"\nCurrent Status: {prop['status']}")
        print("\nAvailable statuses:")
        print("  1. available")
        print("  2. booked")
        print("  3. maintenance")
        
        status_choice = self.get_choice(3)
        
        statuses = ['available', 'booked', 'maintenance']
        if status_choice > 0:
            new_status = statuses[status_choice - 1]
            if self.db.properties.update_property_status(property_id, new_status):
                print(f"\n✓ Property status changed to: {new_status}")
            else:
                print("\n✗ Error updating status!")
        
        input("\nPress Enter to continue...")
    
    def print_property(self, prop):
        """Print property details"""
        print(f"Property ID: {prop['property_id']}")
        print(f"Name: {prop['property_name']}")
        print(f"Address: {prop['address']}")
        print(f"Type: {prop['property_type']}")
        print(f"Price: {format_currency(prop['price_per_day'])}/day")
        print(f"Bedrooms: {prop['bedrooms']}, Bathrooms: {prop['bathrooms']}")
        print(f"Area: {prop['area_sqft']} sq ft")
        if prop['amenities']:
            print(f"Amenities: {', '.join(prop['amenities'])}")
        print(f"Status: {prop['status']}")
    
    # Booking Management
    def booking_menu(self):
        """Booking management menu"""
        while True:
            self.print_header("Booking Management")
            options = [
                "Create New Booking",
                "View All Bookings",
                "View Booking Details",
                "Update Booking Status",
                "Cancel Booking",
                "View Property Bookings"
            ]
            self.print_menu(options)
            
            choice = self.get_choice(len(options))
            
            if choice == 0:
                break
            elif choice == 1:
                self.create_booking()
            elif choice == 2:
                self.view_all_bookings()
            elif choice == 3:
                self.view_booking_details()
            elif choice == 4:
                self.update_booking_status()
            elif choice == 5:
                self.cancel_booking()
            elif choice == 6:
                self.view_property_bookings()
    
    def create_booking(self):
        """Create new booking"""
        self.print_header("Create New Booking")
        
        customer_id = self.get_input("Customer ID: ")
        customer = self.db.customers.get_customer(customer_id)
        if not customer:
            print("\n✗ Customer not found!")
            input("\nPress Enter to continue...")
            return
        
        property_id = self.get_input("Property ID: ")
        prop = self.db.properties.get_property(property_id)
        if not prop:
            print("\n✗ Property not found!")
            input("\nPress Enter to continue...")
            return
        
        if prop['status'] != 'available':
            print(f"\n✗ Property is not available (Status: {prop['status']})")
            input("\nPress Enter to continue...")
            return
        
        print(f"\nProperty: {prop['property_name']}")
        print(f"Price: {format_currency(prop['price_per_day'])}/day\n")
        
        check_in = self.get_date_input("Check-in Date")
        check_out = self.get_date_input("Check-out Date")
        
        if check_out <= check_in:
            print("\n✗ Check-out date must be after check-in date!")
            input("\nPress Enter to continue...")
            return
        
        num_occupants = int(self.get_input("Number of Occupants: "))
        
        days = (check_out - check_in).days
        total_amount = days * prop['price_per_day']
        
        print(f"\nBooking Summary:")
        print(f"Duration: {days} days")
        print(f"Total Amount: {format_currency(total_amount)}")
        
        confirm = self.get_input("\nConfirm booking? (yes/no): ")
        if confirm.lower() == 'yes':
            booking_data = {
                'customer_id': customer_id,
                'property_id': property_id,
                'check_in_date': check_in,
                'check_out_date': check_out,
                'num_occupants': num_occupants
            }
            
            booking_id, error = self.db.bookings.create_booking(booking_data)
            if booking_id:
                print(f"\n✓ Booking created successfully! Booking ID: {booking_id}")
            else:
                print(f"\n✗ Error creating booking: {error}")
        else:
            print("\nBooking cancelled.")
        
        input("\nPress Enter to continue...")
    
    def view_all_bookings(self):
        """View all bookings"""
        self.print_header("All Bookings")
        
        bookings = self.db.bookings.get_all_bookings()
        if not bookings:
            print("No bookings found.")
        else:
            for booking in bookings:
                self.print_booking(booking)
                print("-" * 70)
        
        input("\nPress Enter to continue...")
    
    def view_booking_details(self):
        """View booking details"""
        self.print_header("Booking Details")
        
        booking_id = self.get_input("Enter Booking ID: ")
        booking = self.db.bookings.get_booking(booking_id)
        
        if not booking:
            print("\n✗ Booking not found!")
        else:
            self.print_booking_detailed(booking)
        
        input("\nPress Enter to continue...")
    
    def update_booking_status(self):
        """Update booking status"""
        self.print_header("Update Booking Status")
        
        booking_id = self.get_input("Enter Booking ID: ")
        booking = self.db.bookings.get_booking(booking_id)
        
        if not booking:
            print("\n✗ Booking not found!")
            input("\nPress Enter to continue...")
            return
        
        print(f"\nCurrent Status: {booking['booking_status']}")
        print("\nAvailable statuses:")
        print("  1. pending")
        print("  2. confirmed")
        print("  3. cancelled")
        print("  4. completed")
        
        status_choice = self.get_choice(4)
        
        statuses = ['pending', 'confirmed', 'cancelled', 'completed']
        if status_choice > 0:
            new_status = statuses[status_choice - 1]
            if self.db.bookings.update_booking_status(booking_id, new_status):
                print(f"\n✓ Booking status updated to: {new_status}")
            else:
                print("\n✗ Error updating status!")
        
        input("\nPress Enter to continue...")
    
    def cancel_booking(self):
        """Cancel booking"""
        self.print_header("Cancel Booking")
        
        booking_id = self.get_input("Enter Booking ID: ")
        booking = self.db.bookings.get_booking(booking_id)
        
        if not booking:
            print("\n✗ Booking not found!")
            input("\nPress Enter to continue...")
            return
        
        print("\nBooking to cancel:")
        self.print_booking(booking)
        
        confirm = self.get_input("\nAre you sure you want to cancel this booking? (yes/no): ")
        if confirm.lower() == 'yes':
            if self.db.bookings.cancel_booking(booking_id):
                print("\n✓ Booking cancelled successfully!")
            else:
                print("\n✗ Error cancelling booking!")
        else:
            print("\nCancellation aborted.")
        
        input("\nPress Enter to continue...")
    
    def view_property_bookings(self):
        """View property bookings"""
        self.print_header("View Property Bookings")
        
        property_id = self.get_input("Enter Property ID: ")
        bookings = self.db.bookings.get_property_bookings(property_id)
        
        if not bookings:
            print("\nNo bookings found for this property.")
        else:
            print(f"\nFound {len(bookings)} booking(s):\n")
            for booking in bookings:
                self.print_booking(booking)
                print("-" * 70)
        
        input("\nPress Enter to continue...")
    
    def print_booking(self, booking):
        """Print booking details"""
        print(f"Booking ID: {booking['booking_id']}")
        print(f"Customer ID: {booking['customer_id']}")
        print(f"Property ID: {booking['property_id']}")
        print(f"Check-in: {format_date(booking['check_in_date'])}")
        print(f"Check-out: {format_date(booking['check_out_date'])}")
        print(f"Occupants: {booking['num_occupants']}")
        print(f"Total Amount: {format_currency(booking['total_amount'])}")
        print(f"Status: {booking['booking_status']}")
    
    def print_booking_detailed(self, booking):
        """Print detailed booking information"""
        self.print_booking(booking)
        
        # Get customer details
        customer = self.db.customers.get_customer(booking['customer_id'])
        if customer:
            print(f"\nCustomer: {customer['full_name']}")
            print(f"Email: {customer['email']}")
            print(f"Phone: {customer['phone']}")
        
        # Get property details
        prop = self.db.properties.get_property(booking['property_id'])
        if prop:
            print(f"\nProperty: {prop['property_name']}")
            print(f"Address: {prop['address']}")
            print(f"Type: {prop['property_type']}")
        
        # Get payments
        payments = self.db.payments.get_booking_payments(booking['booking_id'])
        if payments:
            print(f"\nPayments:")
            for payment in payments:
                print(f"  - {payment['payment_id']}: {format_currency(payment['amount_paid'])} "
                      f"({payment['payment_method']}) - {payment['payment_status']}")
    
    # Payment Management
    def payment_menu(self):
        """Payment management menu"""
        while True:
            self.print_header("Payment Management")
            options = [
                "Record Payment",
                "View Payment Details",
                "View Booking Payments",
                "View Customer Payments"
            ]
            self.print_menu(options)
            
            choice = self.get_choice(len(options))
            
            if choice == 0:
                break
            elif choice == 1:
                self.record_payment()
            elif choice == 2:
                self.view_payment_details()
            elif choice == 3:
                self.view_booking_payments()
            elif choice == 4:
                self.view_customer_payments()
    
    def record_payment(self):
        """Record payment"""
        self.print_header("Record Payment")
        
        booking_id = self.get_input("Booking ID: ")
        booking = self.db.bookings.get_booking(booking_id)
        
        if not booking:
            print("\n✗ Booking not found!")
            input("\nPress Enter to continue...")
            return
        
        print(f"\nBooking Total: {format_currency(booking['total_amount'])}")
        print(f"Status: {booking['booking_status']}\n")
        
        amount = float(self.get_input("Amount to Pay: $"))
        
        print("\nPayment Methods:")
        print("  1. Cash")
        print("  2. Card")
        print("  3. Online")
        
        method_choice = self.get_choice(3)
        methods = ['cash', 'card', 'online']
        payment_method = methods[method_choice - 1] if method_choice > 0 else 'cash'
        
        payment_data = {
            'booking_id': booking_id,
            'customer_id': booking['customer_id'],
            'amount_paid': amount,
            'payment_method': payment_method
        }
        
        try:
            payment_id = self.db.payments.record_payment(payment_data)
            print(f"\n✓ Payment recorded successfully! Payment ID: {payment_id}")
        except Exception as e:
            print(f"\n✗ Error recording payment: {e}")
        
        input("\nPress Enter to continue...")
    
    def view_payment_details(self):
        """View payment details"""
        self.print_header("Payment Details")
        
        payment_id = self.get_input("Enter Payment ID: ")
        payment = self.db.payments.get_payment(payment_id)
        
        if not payment:
            print("\n✗ Payment not found!")
        else:
            self.print_payment(payment)
        
        input("\nPress Enter to continue...")
    
    def view_booking_payments(self):
        """View booking payments"""
        self.print_header("Booking Payments")
        
        booking_id = self.get_input("Enter Booking ID: ")
        payments = self.db.payments.get_booking_payments(booking_id)
        
        if not payments:
            print("\nNo payments found for this booking.")
        else:
            for payment in payments:
                self.print_payment(payment)
                print("-" * 70)
        
        input("\nPress Enter to continue...")
    
    def view_customer_payments(self):
        """View customer payments"""
        self.print_header("Customer Payments")
        
        customer_id = self.get_input("Enter Customer ID: ")
        payments = self.db.payments.get_customer_payments(customer_id)
        
        if not payments:
            print("\nNo payments found for this customer.")
        else:
            total = sum(p['amount_paid'] for p in payments)
            print(f"Total Paid: {format_currency(total)}\n")
            for payment in payments:
                self.print_payment(payment)
                print("-" * 70)
        
        input("\nPress Enter to continue...")
    
    def print_payment(self, payment):
        """Print payment details"""
        print(f"Payment ID: {payment['payment_id']}")
        print(f"Booking ID: {payment['booking_id']}")
        print(f"Customer ID: {payment['customer_id']}")
        print(f"Amount: {format_currency(payment['amount_paid'])}")
        print(f"Date: {format_date(payment['payment_date'], '%Y-%m-%d %H:%M:%S')}")
        print(f"Method: {payment['payment_method']}")
        print(f"Status: {payment['payment_status']}")
    
    # Reports
    def reports_menu(self):
        """Reports and analytics menu"""
        while True:
            self.print_header("Reports & Analytics")
            options = [
                "Revenue Report",
                "Booking Statistics",
                "Available Properties Report",
                "Customer Statistics"
            ]
            self.print_menu(options)
            
            choice = self.get_choice(len(options))
            
            if choice == 0:
                break
            elif choice == 1:
                self.revenue_report()
            elif choice == 2:
                self.booking_statistics()
            elif choice == 3:
                self.available_properties_report()
            elif choice == 4:
                self.customer_statistics()
    
    def revenue_report(self):
        """Generate revenue report"""
        self.print_header("Revenue Report")
        
        print("Enter date range (press Enter to skip for all-time):")
        start_date_str = self.get_input("Start Date (YYYY-MM-DD): ", False)
        end_date_str = self.get_input("End Date (YYYY-MM-DD): ", False)
        
        start_date = None
        end_date = None
        
        if start_date_str:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
        if end_date_str:
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
        
        report = self.db.payments.get_revenue_report(start_date, end_date)
        
        print(f"\nTotal Payments: {report['total_payments']}")
        print(f"Total Revenue: {format_currency(report['total_revenue'])}")
        print(f"\nPayment Breakdown:")
        
        for payment in report['payments']:
            print(f"  {payment['payment_id']}: {format_currency(payment['amount_paid'])} - "
                  f"{format_date(payment['payment_date'])}")
        
        input("\nPress Enter to continue...")
    
    def booking_statistics(self):
        """Show booking statistics"""
        self.print_header("Booking Statistics")
        
        stats = self.db.payments.get_booking_statistics()
        
        print(f"Total Bookings: {stats['total']}")
        print(f"Confirmed: {stats['confirmed']}")
        print(f"Pending: {stats['pending']}")
        print(f"Cancelled: {stats['cancelled']}")
        print(f"Completed: {stats['completed']}")
        
        if stats['total'] > 0:
            print(f"\nConfirmation Rate: {(stats['confirmed'] / stats['total'] * 100):.1f}%")
            print(f"Cancellation Rate: {(stats['cancelled'] / stats['total'] * 100):.1f}%")
        
        input("\nPress Enter to continue...")
    
    def available_properties_report(self):
        """Show available properties report"""
        self.print_header("Available Properties Report")
        
        properties = self.db.properties.get_available_properties()
        
        print(f"Total Available Properties: {len(properties)}\n")
        
        for prop in properties:
            print(f"{prop['property_id']}: {prop['property_name']}")
            print(f"  Type: {prop['property_type']}, Price: {format_currency(prop['price_per_day'])}/day")
            print(f"  {prop['bedrooms']} bed, {prop['bathrooms']} bath, {prop['area_sqft']} sq ft")
            print()
        
        input("Press Enter to continue...")
    
    def customer_statistics(self):
        """Show customer statistics"""
        self.print_header("Customer Statistics")
        
        total_customers = len(self.db.customers.get_all_customers())
        total_bookings = len(self.db.bookings.get_all_bookings())
        
        print(f"Total Customers: {total_customers}")
        print(f"Total Bookings: {total_bookings}")
        
        if total_customers > 0:
            print(f"Average Bookings per Customer: {(total_bookings / total_customers):.2f}")
        
        input("\nPress Enter to continue...")
    
    # Main Menu
    def main_menu(self):
        """Main application menu"""
        while True:
            self.print_header("Real Estate Booking Management System")
            print(f"Logged in as: {self.current_user['username']} ({self.current_user['role']})\n")
            
            options = [
                "Customer Management",
                "Property Management",
                "Booking Management",
                "Payment Management",
                "Reports & Analytics"
            ]
            self.print_menu(options)
            
            choice = self.get_choice(len(options))
            
            if choice == 0:
                print("\nThank you for using the system!")
                break
            elif choice == 1:
                self.customer_menu()
            elif choice == 2:
                self.property_menu()
            elif choice == 3:
                self.booking_menu()
            elif choice == 4:
                self.payment_menu()
            elif choice == 5:
                self.reports_menu()
    
    def run(self):
        """Main application entry point"""
        self.print_header("Welcome to Real Estate Booking System")
        
        if self.login():
            self.main_menu()
        
        self.db.close()
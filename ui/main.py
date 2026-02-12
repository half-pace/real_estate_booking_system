from models import User
from repositories import UserRepo, PropertyRepo, BookingRepo
from services  import UserService, PropertyService, BookingService

class RealEstateCLI:
    def __init__(self):
        #initializing repositories
        self.user_repo = UserRepo()
        self.property_repo = PropertyRepo()
        self.booking_repo = BookingRepo()
        
        #initializing services
        self.user_service = UserService(self.user_repo)
        self.property_service = PropertyService(self.property_repo, self.user_repo)
        self.booking_service = BookingService(
            self.booking_repo,
            self.property_repo,
            self.user_repo
        )
        
    # main
    def start(self):
        while True:
            print("\n=== REAL ESTATE MANAGEMENT SYSTEM ===")
            print("1. Register User")
            print("2. Add Property")
            print("3. View Properties")
            print("4. Book Property")
            print("5. View Bookings")
            print("6. Exit")
            
            choice = input("Choose Option: ")
            
            try:
                if choice == "1":
                    self.register_user()
                elif choice == "2":
                    self.add_property()
                elif choice == "3":
                    self.view_properties()
                elif choice == "4":
                    self.book_property()
                elif choice == "5":
                    self.view_bookings()
                elif choice == "6":
                    print("Exiting...")
                    break
                else:
                    print("Invalid Choice!")
            except Exception as e:
                print(f"Error: {e}")
                
    # user registration
    def register_user(self):
        user_id = int(input("User ID: "))
        name = input("Name: ")
        email = input("Email: ")
        phone = input("Phone: ")
        role = input("Role (ADMIN / OWNER / CUSTOMER): ")
        
        user = self.user_service.register_user(
            user_id, name, email, phone, role
        )
        
        print("User Registered:", user)
        
    # property addition
    def add_property(self):
        property_id = int(input("Property ID: "))
        title = input("Title: ")
        location = input("Location: ")
        price = float(input("Price per day: "))
        owner_id = int(input("Owner ID: "))
        
        property_obj = self.property_service.add_property(
            property_id, title, location, price, owner_id
        )
        
        print("Property Added:", property_obj)
        
    def view_properties(self):
        properties = self.property_service.get_all_properties()
        
        if not properties:
            print("No Properties Available!")
            return
        
        for prop in properties:
            print(prop)
            
    #booking 
    def book_property(self):
        booking_id = int(input("Booking ID: "))
        property_id = int(input("Property ID: "))
        customer_id = int(input("Customer ID: "))
        start_date = input("Start Date (YYYY-MM-DD): ")
        end_date = input("End Date (YYYY-MM-DD): ")
        days = int(input("Number of Days: "))
        
        booking = self.booking_service.create_booking(
            booking_id,
            property_id,
            customer_id,
            start_date,
            end_date,
            days
        )
        
        print("Booking Successful: ", booking)
        
    def view_bookings(self):
        bookings = self.booking_service.get_all_bookings()
        
        if not bookings:
            print("No bookkings found!")
            return
        
        for booking in bookings:
            print(booking)
        
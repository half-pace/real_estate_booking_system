# from ui.main import RealEstateCLI

# if __name__ == "__main__":
#     app = RealEstateCLI()
#     app.start()

from repositories.mongo_user_repo import MongoUserRepository
from repositories.mongo_property_repo import MongoPropertyRepository
from repositories.mongo_booking_repo import MongoBookingRepository

from services import UserService, PropertyService, BookingService
from gui.main_window import run_app

user_repo = MongoUserRepository()
property_repo = MongoPropertyRepository()
booking_repo = MongoBookingRepository()

user_service = UserService(user_repo)
property_service = PropertyService(property_repo, user_repo)
booking_service = BookingService(booking_repo, property_repo, user_repo)

run_app(user_service, property_service, booking_service)

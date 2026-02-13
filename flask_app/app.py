from flask import Flask 
from repositories.mongo_user_repo import MongoUserRepository
from repositories.mongo_property_repo import MongoPropertyRepository
from repositories.mongo_booking_repo import MongoBookingRepository
from services import UserService, PropertyService, BookingService

def create_app():
    app = Flask(__name__)
    app.secret_key = "secret_key"
    
    #initializing repositories
    user_repo = MongoUserRepository()
    property_repo = MongoPropertyRepository()
    booking_repo = MongoBookingRepository()
    
    #initializing services
    app.user_service = UserService(user_repo)
    app.property_service = PropertyService(property_repo, user_repo)
    app.booking_service = BookingService(booking_repo, property_repo, user_repo)
    
    from flask_app.routes import register_routes
    register_routes(app)
    
    return app
    
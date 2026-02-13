import sys
from PyQt5.QtWidgets import QApplication 
from gui.login_window import LoginWindow

def run_app(user_service, property_service, booking_service):
    app = QApplication(sys.argv)
    window = LoginWindow(user_service, property_service, booking_service)
    window.show()
    
    sys.exit(app.exec_())
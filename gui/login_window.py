from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel, QLineEdit, QPushButton, QMessageBox
from gui.dashboard import Dashboard 

class LoginWindow(QWidget):
    def __init__(self, user_service, property_service, booking_service):
        super().__init__()
        self.user_service = user_service
        self.property_service = property_service
        self.booking_service = booking_service
        
        self.setWindowTitle("Login")
        self.setGeometry(100, 100, 300, 200)
        
        layout = QVBoxLayout()
        
        self.user_id_input = QLineEdit()
        self.user_id_input.setPlaceholderText("Enter User ID")
        
        login_button = QPushButton("Login")
        login_button.clicked.connect(self.login)
        
        layout.addWidget(QLabel("Real Estate Login"))
        layout.addWidget(self.user_id_input)
        layout.addWidget(login_button)
        
        self.setLayout(layout)
        
    def login(self):
        user_id = int(self.user_id_input.text())
        user = self.user_service.get_user(user_id)
        
        if user:
            self.dashboard = Dashboard(
                user,
                self.property_service,
                self.booking_service
            )
            self.dashboard.show()
            self.close()
        else:
            QMessageBox.warning(self, "Error", "User not found. Please try again.")
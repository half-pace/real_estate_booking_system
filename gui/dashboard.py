from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel, QPushButton

class Dashboard(QWidget):
    def __init__(self, user, property_service, booking_service):
        super().__init__()
        
        self.user = user
        self.property_service = property_service
        self.booking_service = booking_service
        
        self.setWindowTitle("Dashboard")
        self.setGeometry(200, 200, 400, 300)
        
        layout = QVBoxLayout()
        
        #welcome_label = QLabel(f"Welcome, {self.user.name}!")
        layout.addWidget(QLabel(f"Welcome, {self.user.name} ({self.user.role})!"))
        
        view_props_btn = QPushButton("View Properties")
        view_props_btn.clicked.connect(self.view_properties)
        
        layout.addWidget(view_props_btn)
        
        self.setLayout(layout)
        
    def view_properties(self):
        properties = self.property_service.get_all_properties()
        print(properties)
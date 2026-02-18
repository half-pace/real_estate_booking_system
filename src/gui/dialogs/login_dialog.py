"""
Login Dialog for GUI
"""
from PyQt5.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QFormLayout,
    QLineEdit, QPushButton, QMessageBox, QLabel
)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont


class LoginDialog(QDialog):
    """Login dialog for user authentication"""
    
    def __init__(self, db):
        super().__init__()
        self.db = db
        self.user = None
        self.init_ui()
    
    def init_ui(self):
        """Initialize UI components"""
        self.setWindowTitle("Login - Real Estate Booking System")
        self.setFixedSize(400, 200)
        self.setModal(True)
        
        layout = QVBoxLayout()
        
        # Title
        title = QLabel("Real Estate Booking System")
        title.setFont(QFont("Arial", 16, QFont.Bold))
        title.setAlignment(Qt.AlignCenter)
        layout.addWidget(title)
        
        # Subtitle
        subtitle = QLabel("Please login to continue")
        subtitle.setAlignment(Qt.AlignCenter)
        layout.addWidget(subtitle)
        
        layout.addSpacing(20)
        
        # Form
        form_layout = QFormLayout()
        
        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Enter username")
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Enter password")
        self.password_input.setEchoMode(QLineEdit.Password)
        
        form_layout.addRow("Username:", self.username_input)
        form_layout.addRow("Password:", self.password_input)
        
        layout.addLayout(form_layout)
        
        layout.addSpacing(10)
        
        # Hint
        hint = QLabel("Default: admin / admin123")
        hint.setStyleSheet("color: gray; font-size: 10px;")
        hint.setAlignment(Qt.AlignCenter)
        layout.addWidget(hint)
        
        layout.addSpacing(10)
        
        # Buttons
        btn_layout = QHBoxLayout()
        self.login_btn = QPushButton("Login")
        self.login_btn.setDefault(True)
        self.cancel_btn = QPushButton("Cancel")
        
        self.login_btn.clicked.connect(self.login)
        self.cancel_btn.clicked.connect(self.reject)
        self.password_input.returnPressed.connect(self.login)
        
        btn_layout.addWidget(self.login_btn)
        btn_layout.addWidget(self.cancel_btn)
        
        layout.addLayout(btn_layout)
        
        self.setLayout(layout)
        
        # Set focus
        self.username_input.setFocus()
    
    def login(self):
        """Handle login attempt"""
        username = self.username_input.text().strip()
        password = self.password_input.text()
        
        if not username or not password:
            QMessageBox.warning(self, "Error", "Please enter both username and password!")
            return
        
        user = self.db.users.authenticate(username, password)
        if user:
            self.user = user
            self.accept()
        else:
            QMessageBox.warning(self, "Login Failed", "Invalid username or password!")
            self.password_input.clear()
            self.password_input.setFocus()
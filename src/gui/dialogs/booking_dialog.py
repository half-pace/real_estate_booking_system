"""
Booking Dialog for creating bookings
"""
from PyQt5.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QFormLayout,
    QPushButton, QMessageBox, QComboBox, QDateEdit, QSpinBox, QLabel
)
from PyQt5.QtCore import QDate
from PyQt5.QtGui import QFont
from datetime import datetime


class BookingDialog(QDialog):
    """Dialog for creating bookings"""
    
    def __init__(self, db):
        super().__init__()
        self.db = db
        self.init_ui()
    
    def init_ui(self):
        """Initialize UI components"""
        self.setWindowTitle("Create New Booking")
        self.setMinimumWidth(500)
        
        layout = QVBoxLayout()
        
        # Form
        form_layout = QFormLayout()
        
        self.customer_input = QComboBox()
        self.property_input = QComboBox()
        
        self.check_in_input = QDateEdit()
        self.check_in_input.setCalendarPopup(True)
        self.check_in_input.setDate(QDate.currentDate())
        self.check_in_input.setDisplayFormat("yyyy-MM-dd")
        
        self.check_out_input = QDateEdit()
        self.check_out_input.setCalendarPopup(True)
        self.check_out_input.setDate(QDate.currentDate().addDays(1))
        self.check_out_input.setDisplayFormat("yyyy-MM-dd")
        
        self.occupants_input = QSpinBox()
        self.occupants_input.setRange(1, 20)
        self.occupants_input.setValue(2)
        
        # Populate customers
        customers = self.db.customers.get_all_customers()
        if not customers:
            QMessageBox.warning(self, "No Customers", "No customers found. Please add customers first.")
            self.reject()
            return
        
        for customer in customers:
            self.customer_input.addItem(
                f"{customer['customer_id']} - {customer['full_name']}",
                customer['customer_id']
            )
        
        # Populate available properties
        properties = self.db.properties.get_available_properties()
        if not properties:
            QMessageBox.warning(self, "No Properties", "No available properties found.")
            self.reject()
            return
        
        for prop in properties:
            self.property_input.addItem(
                f"{prop['property_id']} - {prop['property_name']} (${prop['price_per_day']:.2f}/day)",
                prop['property_id']
            )
        
        # Connect property selection to update summary
        self.property_input.currentIndexChanged.connect(self.update_summary)
        self.check_in_input.dateChanged.connect(self.update_summary)
        self.check_out_input.dateChanged.connect(self.update_summary)
        
        form_layout.addRow("Customer:*", self.customer_input)
        form_layout.addRow("Property:*", self.property_input)
        form_layout.addRow("Check-in Date:*", self.check_in_input)
        form_layout.addRow("Check-out Date:*", self.check_out_input)
        form_layout.addRow("Number of Occupants:*", self.occupants_input)
        
        layout.addLayout(form_layout)
        
        # Summary section
        self.summary_label = QLabel()
        self.summary_label.setFont(QFont("Arial", 10))
        self.summary_label.setStyleSheet("background: #e8f4f8; padding: 10px; border-radius: 5px;")
        layout.addWidget(self.summary_label)
        
        # Initial summary
        self.update_summary()
        
        # Buttons
        btn_layout = QHBoxLayout()
        self.create_btn = QPushButton("Create Booking")
        self.cancel_btn = QPushButton("Cancel")
        
        self.create_btn.clicked.connect(self.create_booking)
        self.cancel_btn.clicked.connect(self.reject)
        
        btn_layout.addStretch()
        btn_layout.addWidget(self.create_btn)
        btn_layout.addWidget(self.cancel_btn)
        
        layout.addLayout(btn_layout)
        
        self.setLayout(layout)
    
    def update_summary(self):
        """Update booking summary"""
        property_id = self.property_input.currentData()
        if not property_id:
            return
        
        prop = self.db.properties.get_property(property_id)
        if not prop:
            return
        
        check_in = self.check_in_input.date().toPyDate()
        check_out = self.check_out_input.date().toPyDate()
        
        if check_out <= check_in:
            self.summary_label.setText("⚠️ Check-out date must be after check-in date")
            self.summary_label.setStyleSheet("background: #ffe8e8; padding: 10px; border-radius: 5px;")
            return
        
        days = (check_out - check_in).days
        total = days * prop['price_per_day']
        
        summary = f"""
        <b>Booking Summary:</b><br>
        Property: {prop['property_name']}<br>
        Duration: {days} day(s)<br>
        Price per day: ${prop['price_per_day']:.2f}<br>
        <b>Total Amount: ${total:.2f}</b>
        """
        
        self.summary_label.setText(summary)
        self.summary_label.setStyleSheet("background: #e8f4f8; padding: 10px; border-radius: 5px;")
    
    def create_booking(self):
        """Create the booking"""
        customer_id = self.customer_input.currentData()
        property_id = self.property_input.currentData()
        
        if not customer_id or not property_id:
            QMessageBox.warning(self, "Error", "Please select customer and property!")
            return
        
        check_in = self.check_in_input.date().toPyDate()
        check_out = self.check_out_input.date().toPyDate()
        
        if check_out <= check_in:
            QMessageBox.warning(self, "Error", "Check-out date must be after check-in date!")
            return
        
        booking_data = {
            'customer_id': customer_id,
            'property_id': property_id,
            'check_in_date': datetime.combine(check_in, datetime.min.time()),
            'check_out_date': datetime.combine(check_out, datetime.min.time()),
            'num_occupants': self.occupants_input.value()
        }
        
        try:
            booking_id, error = self.db.bookings.create_booking(booking_data)
            if booking_id:
                QMessageBox.information(
                    self, "Success",
                    f"Booking created successfully!\n\nBooking ID: {booking_id}"
                )
                self.accept()
            else:
                QMessageBox.warning(self, "Error", f"Failed to create booking:\n{error}")
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Error creating booking:\n{str(e)}")
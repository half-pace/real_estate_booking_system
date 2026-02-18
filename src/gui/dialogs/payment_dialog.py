"""
Payment Dialog for recording payments
"""
from PyQt5.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QFormLayout,
    QPushButton, QMessageBox, QComboBox, QDoubleSpinBox, QLabel
)
from PyQt5.QtGui import QFont
from src.config.settings import PAYMENT_METHODS


class PaymentDialog(QDialog):
    """Dialog for recording payments"""
    
    def __init__(self, db, booking_id=None):
        super().__init__()
        self.db = db
        self.booking_id = booking_id
        self.init_ui()
    
    def init_ui(self):
        """Initialize UI components"""
        self.setWindowTitle("Record Payment")
        self.setMinimumWidth(450)
        
        layout = QVBoxLayout()
        
        # Form
        form_layout = QFormLayout()
        
        self.booking_input = QComboBox()
        self.amount_input = QDoubleSpinBox()
        self.amount_input.setRange(0, 1000000)
        self.amount_input.setPrefix("$")
        self.amount_input.setDecimals(2)
        
        self.method_input = QComboBox()
        self.method_input.addItems(PAYMENT_METHODS)
        
        # Populate bookings
        bookings = self.db.bookings.get_all_bookings()
        pending_bookings = [b for b in bookings if b['booking_status'] in ['pending', 'confirmed']]
        
        if not pending_bookings:
            QMessageBox.warning(self, "No Bookings", "No bookings available for payment.")
            self.reject()
            return
        
        for booking in pending_bookings:
            customer = self.db.customers.get_customer(booking['customer_id'])
            customer_name = customer['full_name'] if customer else "Unknown"
            
            self.booking_input.addItem(
                f"{booking['booking_id']} - {customer_name} - ${booking['total_amount']:.2f} ({booking['booking_status']})",
                booking
            )
        
        # If specific booking provided, select it
        if self.booking_id:
            for i in range(self.booking_input.count()):
                booking = self.booking_input.itemData(i)
                if booking['booking_id'] == self.booking_id:
                    self.booking_input.setCurrentIndex(i)
                    break
        
        # Update amount when booking changes
        self.booking_input.currentIndexChanged.connect(self.update_amount)
        self.update_amount()
        
        form_layout.addRow("Booking:*", self.booking_input)
        form_layout.addRow("Amount:*", self.amount_input)
        form_layout.addRow("Payment Method:*", self.method_input)
        
        layout.addLayout(form_layout)
        
        # Info section
        self.info_label = QLabel()
        self.info_label.setFont(QFont("Arial", 9))
        self.info_label.setStyleSheet("background: #f0f0f0; padding: 8px; border-radius: 5px;")
        layout.addWidget(self.info_label)
        self.update_info()
        
        # Buttons
        btn_layout = QHBoxLayout()
        self.record_btn = QPushButton("Record Payment")
        self.cancel_btn = QPushButton("Cancel")
        
        self.record_btn.clicked.connect(self.record_payment)
        self.cancel_btn.clicked.connect(self.reject)
        
        btn_layout.addStretch()
        btn_layout.addWidget(self.record_btn)
        btn_layout.addWidget(self.cancel_btn)
        
        layout.addLayout(btn_layout)
        
        self.setLayout(layout)
    
    def update_amount(self):
        """Update amount based on selected booking"""
        booking = self.booking_input.currentData()
        if booking:
            self.amount_input.setValue(booking['total_amount'])
            self.update_info()
    
    def update_info(self):
        """Update booking information"""
        booking = self.booking_input.currentData()
        if not booking:
            return
        
        # Get existing payments
        payments = self.db.payments.get_booking_payments(booking['booking_id'])
        total_paid = sum(p['amount_paid'] for p in payments)
        balance = booking['total_amount'] - total_paid
        
        info = f"""
        <b>Booking Details:</b><br>
        Total Amount: ${booking['total_amount']:.2f}<br>
        Already Paid: ${total_paid:.2f}<br>
        Balance: ${balance:.2f}
        """
        
        self.info_label.setText(info)
    
    def record_payment(self):
        """Record the payment"""
        booking = self.booking_input.currentData()
        if not booking:
            QMessageBox.warning(self, "Error", "Please select a booking!")
            return
        
        amount = self.amount_input.value()
        if amount <= 0:
            QMessageBox.warning(self, "Error", "Amount must be greater than 0!")
            return
        
        payment_data = {
            'booking_id': booking['booking_id'],
            'customer_id': booking['customer_id'],
            'amount_paid': amount,
            'payment_method': self.method_input.currentText()
        }
        
        try:
            payment_id = self.db.payments.record_payment(payment_data)
            QMessageBox.information(
                self, "Success",
                f"Payment recorded successfully!\n\nPayment ID: {payment_id}"
            )
            self.accept()
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Error recording payment:\n{str(e)}")
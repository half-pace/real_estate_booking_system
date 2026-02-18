"""
Customer Dialog for adding/editing customers
"""
from PyQt5.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QFormLayout,
    QLineEdit, QPushButton, QMessageBox, QTextEdit, QComboBox
)
from src.config.settings import ID_PROOF_TYPES


class CustomerDialog(QDialog):
    """Dialog for customer details"""
    
    def __init__(self, db, customer=None):
        super().__init__()
        self.db = db
        self.customer = customer
        self.init_ui()
    
    def init_ui(self):
        """Initialize UI components"""
        title = "Edit Customer" if self.customer else "Add New Customer"
        self.setWindowTitle(title)
        self.setMinimumWidth(500)
        
        layout = QVBoxLayout()
        
        # Form
        form_layout = QFormLayout()
        
        self.name_input = QLineEdit()
        self.email_input = QLineEdit()
        self.phone_input = QLineEdit()
        self.address_input = QTextEdit()
        self.address_input.setMaximumHeight(80)
        self.id_proof_type_input = QComboBox()
        self.id_proof_type_input.addItems(ID_PROOF_TYPES)
        self.id_proof_number_input = QLineEdit()
        
        # Populate if editing
        if self.customer:
            self.name_input.setText(self.customer['full_name'])
            self.email_input.setText(self.customer['email'])
            self.phone_input.setText(self.customer['phone'])
            self.address_input.setPlainText(self.customer['address'])
            self.id_proof_type_input.setCurrentText(self.customer['id_proof_type'])
            self.id_proof_number_input.setText(self.customer['id_proof_number'])
        
        form_layout.addRow("Full Name:*", self.name_input)
        form_layout.addRow("Email:*", self.email_input)
        form_layout.addRow("Phone:*", self.phone_input)
        form_layout.addRow("Address:*", self.address_input)
        form_layout.addRow("ID Proof Type:*", self.id_proof_type_input)
        form_layout.addRow("ID Proof Number:*", self.id_proof_number_input)
        
        layout.addLayout(form_layout)
        
        # Buttons
        btn_layout = QHBoxLayout()
        self.save_btn = QPushButton("Save")
        self.cancel_btn = QPushButton("Cancel")
        
        self.save_btn.clicked.connect(self.save)
        self.cancel_btn.clicked.connect(self.reject)
        
        btn_layout.addStretch()
        btn_layout.addWidget(self.save_btn)
        btn_layout.addWidget(self.cancel_btn)
        
        layout.addLayout(btn_layout)
        
        self.setLayout(layout)
    
    def save(self):
        """Save customer data"""
        customer_data = {
            'full_name': self.name_input.text().strip(),
            'email': self.email_input.text().strip(),
            'phone': self.phone_input.text().strip(),
            'address': self.address_input.toPlainText().strip(),
            'id_proof_type': self.id_proof_type_input.currentText(),
            'id_proof_number': self.id_proof_number_input.text().strip()
        }
        
        # Validation
        if not all([
            customer_data['full_name'],
            customer_data['email'],
            customer_data['phone'],
            customer_data['address'],
            customer_data['id_proof_number']
        ]):
            QMessageBox.warning(self, "Validation Error", "Please fill all required fields!")
            return
        
        try:
            if self.customer:
                # Update existing customer
                self.db.customers.update_customer(self.customer['customer_id'], customer_data)
                QMessageBox.information(self, "Success", "Customer updated successfully!")
            else:
                # Add new customer
                customer_id = self.db.customers.add_customer(customer_data)
                QMessageBox.information(self, "Success", f"Customer added successfully!\nID: {customer_id}")
            
            self.accept()
        except ValueError as e:
            QMessageBox.warning(self, "Validation Error", str(e))
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Error saving customer: {str(e)}")
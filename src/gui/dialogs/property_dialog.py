"""
Property Dialog for adding/editing properties
"""
from PyQt5.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QFormLayout,
    QLineEdit, QPushButton, QMessageBox, QTextEdit, QComboBox,
    QSpinBox, QDoubleSpinBox
)
from src.config.settings import PROPERTY_TYPES


class PropertyDialog(QDialog):
    """Dialog for property details"""
    
    def __init__(self, db, property_doc=None):
        super().__init__()
        self.db = db
        self.property = property_doc
        self.init_ui()
    
    def init_ui(self):
        """Initialize UI components"""
        title = "Edit Property" if self.property else "Add New Property"
        self.setWindowTitle(title)
        self.setMinimumWidth(500)
        
        layout = QVBoxLayout()
        
        # Form
        form_layout = QFormLayout()
        
        self.name_input = QLineEdit()
        self.address_input = QTextEdit()
        self.address_input.setMaximumHeight(60)
        self.type_input = QComboBox()
        self.type_input.addItems(PROPERTY_TYPES)
        
        self.price_input = QDoubleSpinBox()
        self.price_input.setRange(0, 1000000)
        self.price_input.setPrefix("$")
        self.price_input.setDecimals(2)
        
        self.bedrooms_input = QSpinBox()
        self.bedrooms_input.setRange(0, 20)
        
        self.bathrooms_input = QSpinBox()
        self.bathrooms_input.setRange(0, 20)
        
        self.area_input = QDoubleSpinBox()
        self.area_input.setRange(0, 100000)
        self.area_input.setSuffix(" sq ft")
        self.area_input.setDecimals(2)
        
        self.amenities_input = QLineEdit()
        
        # Populate if editing
        if self.property:
            self.name_input.setText(self.property['property_name'])
            self.address_input.setPlainText(self.property['address'])
            self.type_input.setCurrentText(self.property['property_type'])
            self.price_input.setValue(self.property['price_per_day'])
            self.bedrooms_input.setValue(self.property['bedrooms'])
            self.bathrooms_input.setValue(self.property['bathrooms'])
            self.area_input.setValue(self.property['area_sqft'])
            if self.property['amenities']:
                self.amenities_input.setText(", ".join(self.property['amenities']))
        
        form_layout.addRow("Property Name:*", self.name_input)
        form_layout.addRow("Address:*", self.address_input)
        form_layout.addRow("Type:*", self.type_input)
        form_layout.addRow("Price per Day:*", self.price_input)
        form_layout.addRow("Bedrooms:*", self.bedrooms_input)
        form_layout.addRow("Bathrooms:*", self.bathrooms_input)
        form_layout.addRow("Area:*", self.area_input)
        form_layout.addRow("Amenities:", self.amenities_input)
        
        layout.addLayout(form_layout)
        
        # Hint
        hint = QLineEdit()
        hint.setReadOnly(True)
        hint.setText("Amenities: Comma-separated (e.g., pool, gym, parking)")
        hint.setStyleSheet("background: #f0f0f0; border: none; color: gray;")
        layout.addWidget(hint)
        
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
        """Save property data"""
        amenities_str = self.amenities_input.text().strip()
        amenities = [a.strip() for a in amenities_str.split(',')] if amenities_str else []
        
        property_data = {
            'property_name': self.name_input.text().strip(),
            'address': self.address_input.toPlainText().strip(),
            'property_type': self.type_input.currentText(),
            'price_per_day': self.price_input.value(),
            'bedrooms': self.bedrooms_input.value(),
            'bathrooms': self.bathrooms_input.value(),
            'area_sqft': self.area_input.value(),
            'amenities': amenities
        }
        
        # Validation
        if not property_data['property_name'] or not property_data['address']:
            QMessageBox.warning(self, "Validation Error", "Property name and address are required!")
            return
        
        if property_data['price_per_day'] <= 0:
            QMessageBox.warning(self, "Validation Error", "Price must be greater than 0!")
            return
        
        try:
            if self.property:
                # Update existing property
                self.db.properties.update_property(self.property['property_id'], property_data)
                QMessageBox.information(self, "Success", "Property updated successfully!")
            else:
                # Add new property
                property_id = self.db.properties.add_property(property_data)
                QMessageBox.information(self, "Success", f"Property added successfully!\nID: {property_id}")
            
            self.accept()
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Error saving property: {str(e)}")
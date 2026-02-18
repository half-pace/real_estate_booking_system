"""
Main Window for GUI Application
"""
from PyQt5.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLabel, QTableWidget, QTableWidgetItem,
    QMessageBox, QTabWidget, QGroupBox, QHeaderView,
    QLineEdit, QComboBox, QTextEdit, QInputDialog
)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont

from src.gui.dialogs.customer_dialog import CustomerDialog
from src.gui.dialogs.property_dialog import PropertyDialog
from src.gui.dialogs.booking_dialog import BookingDialog
from src.gui.dialogs.payment_dialog import PaymentDialog
from src.config.settings import PROPERTY_TYPES, PROPERTY_STATUSES, BOOKING_STATUSES
from src.utils.helpers import format_currency, format_date


class MainWindow(QMainWindow):
    """Main application window"""
    
    def __init__(self, db, user):
        super().__init__()
        self.db = db
        self.user = user
        self.init_ui()
    
    def init_ui(self):
        """Initialize UI components"""
        self.setWindowTitle("Real Estate Booking Management System")
        self.setGeometry(100, 100, 1400, 800)
        
        # Central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        main_layout = QVBoxLayout()
        central_widget.setLayout(main_layout)
        
        # Header
        header_layout = QHBoxLayout()
        
        title = QLabel("Real Estate Booking Management System")
        title.setFont(QFont("Arial", 16, QFont.Bold))
        header_layout.addWidget(title)
        
        header_layout.addStretch()
        
        user_label = QLabel(f"👤 {self.user['username']} ({self.user['role']})")
        user_label.setFont(QFont("Arial", 10))
        header_layout.addWidget(user_label)
        
        main_layout.addLayout(header_layout)
        
        # Tab widget
        self.tabs = QTabWidget()
        main_layout.addWidget(self.tabs)
        
        # Create tabs
        self.create_customer_tab()
        self.create_property_tab()
        self.create_booking_tab()
        self.create_payment_tab()
        self.create_reports_tab()
        
        # Status bar
        self.statusBar().showMessage("Ready")
    
    # ==================== CUSTOMER TAB ====================
    
    def create_customer_tab(self):
        """Create customer management tab"""
        tab = QWidget()
        layout = QVBoxLayout()
        tab.setLayout(layout)
        
        # Toolbar
        toolbar = QHBoxLayout()
        
        add_btn = QPushButton("➕ Add Customer")
        edit_btn = QPushButton("✏️ Edit Customer")
        delete_btn = QPushButton("🗑️ Delete Customer")
        refresh_btn = QPushButton("🔄 Refresh")
        
        add_btn.clicked.connect(self.add_customer)
        edit_btn.clicked.connect(self.edit_customer)
        delete_btn.clicked.connect(self.delete_customer)
        refresh_btn.clicked.connect(self.load_customers)
        
        toolbar.addWidget(add_btn)
        toolbar.addWidget(edit_btn)
        toolbar.addWidget(delete_btn)
        toolbar.addStretch()
        toolbar.addWidget(refresh_btn)
        
        layout.addLayout(toolbar)
        
        # Search
        search_layout = QHBoxLayout()
        search_layout.addWidget(QLabel("🔍 Search:"))
        self.customer_search = QLineEdit()
        self.customer_search.setPlaceholderText("Search by name, email, or phone...")
        self.customer_search.textChanged.connect(self.search_customers)
        search_layout.addWidget(self.customer_search)
        layout.addLayout(search_layout)
        
        # Table
        self.customer_table = QTableWidget()
        self.customer_table.setColumnCount(7)
        self.customer_table.setHorizontalHeaderLabels([
            "Customer ID", "Name", "Email", "Phone", "Address", "ID Proof", "Registered"
        ])
        self.customer_table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.customer_table.setSelectionBehavior(QTableWidget.SelectRows)
        self.customer_table.setEditTriggers(QTableWidget.NoEditTriggers)
        self.customer_table.doubleClicked.connect(self.edit_customer)
        layout.addWidget(self.customer_table)
        
        self.tabs.addTab(tab, "👥 Customers")
        self.load_customers()
    
    def load_customers(self):
        """Load all customers"""
        customers = self.db.customers.get_all_customers()
        self.display_customers(customers)
        self.statusBar().showMessage(f"Loaded {len(customers)} customers")
    
    def display_customers(self, customers):
        """Display customers in table"""
        self.customer_table.setRowCount(len(customers))
        for i, customer in enumerate(customers):
            self.customer_table.setItem(i, 0, QTableWidgetItem(customer['customer_id']))
            self.customer_table.setItem(i, 1, QTableWidgetItem(customer['full_name']))
            self.customer_table.setItem(i, 2, QTableWidgetItem(customer['email']))
            self.customer_table.setItem(i, 3, QTableWidgetItem(customer['phone']))
            self.customer_table.setItem(i, 4, QTableWidgetItem(customer['address']))
            self.customer_table.setItem(i, 5, QTableWidgetItem(
                f"{customer['id_proof_type']}: {customer['id_proof_number']}"
            ))
            self.customer_table.setItem(i, 6, QTableWidgetItem(
                format_date(customer['registration_date'])
            ))
    
    def search_customers(self):
        """Search customers"""
        query = self.customer_search.text().strip()
        if query:
            customers = self.db.customers.search_customers(query)
        else:
            customers = self.db.customers.get_all_customers()
        self.display_customers(customers)
        self.statusBar().showMessage(f"Found {len(customers)} customers")
    
    def add_customer(self):
        """Add new customer"""
        dialog = CustomerDialog(self.db)
        if dialog.exec_():
            self.load_customers()
    
    def edit_customer(self):
        """Edit selected customer"""
        row = self.customer_table.currentRow()
        if row < 0:
            QMessageBox.warning(self, "No Selection", "Please select a customer to edit!")
            return
        
        customer_id = self.customer_table.item(row, 0).text()
        customer = self.db.customers.get_customer(customer_id)
        
        if customer:
            dialog = CustomerDialog(self.db, customer)
            if dialog.exec_():
                self.load_customers()
    
    def delete_customer(self):
        """Delete selected customer"""
        row = self.customer_table.currentRow()
        if row < 0:
            QMessageBox.warning(self, "No Selection", "Please select a customer to delete!")
            return
        
        customer_id = self.customer_table.item(row, 0).text()
        customer_name = self.customer_table.item(row, 1).text()
        
        reply = QMessageBox.question(
            self, "Confirm Delete",
            f"Are you sure you want to delete customer:\n{customer_name} ({customer_id})?",
            QMessageBox.Yes | QMessageBox.No
        )
        
        if reply == QMessageBox.Yes:
            if self.db.customers.delete_customer(customer_id):
                QMessageBox.information(self, "Success", "Customer deleted successfully!")
                self.load_customers()
            else:
                QMessageBox.critical(self, "Error", "Failed to delete customer!")
    
    # ==================== PROPERTY TAB ====================
    
    def create_property_tab(self):
        """Create property management tab"""
        tab = QWidget()
        layout = QVBoxLayout()
        tab.setLayout(layout)
        
        # Toolbar
        toolbar = QHBoxLayout()
        
        add_btn = QPushButton("➕ Add Property")
        edit_btn = QPushButton("✏️ Edit Property")
        delete_btn = QPushButton("🗑️ Delete Property")
        refresh_btn = QPushButton("🔄 Refresh")
        
        add_btn.clicked.connect(self.add_property)
        edit_btn.clicked.connect(self.edit_property)
        delete_btn.clicked.connect(self.delete_property)
        refresh_btn.clicked.connect(self.load_properties)
        
        toolbar.addWidget(add_btn)
        toolbar.addWidget(edit_btn)
        toolbar.addWidget(delete_btn)
        toolbar.addStretch()
        toolbar.addWidget(refresh_btn)
        
        layout.addLayout(toolbar)
        
        # Filters
        filter_layout = QHBoxLayout()
        
        filter_layout.addWidget(QLabel("Type:"))
        self.property_type_filter = QComboBox()
        self.property_type_filter.addItem("All")
        self.property_type_filter.addItems(PROPERTY_TYPES)
        self.property_type_filter.currentTextChanged.connect(self.filter_properties)
        filter_layout.addWidget(self.property_type_filter)
        
        filter_layout.addWidget(QLabel("Status:"))
        self.property_status_filter = QComboBox()
        self.property_status_filter.addItem("All")
        self.property_status_filter.addItems(PROPERTY_STATUSES)
        self.property_status_filter.currentTextChanged.connect(self.filter_properties)
        filter_layout.addWidget(self.property_status_filter)
        
        filter_layout.addStretch()
        
        layout.addLayout(filter_layout)
        
        # Table
        self.property_table = QTableWidget()
        self.property_table.setColumnCount(9)
        self.property_table.setHorizontalHeaderLabels([
            "Property ID", "Name", "Type", "Price/Day", "Beds", "Baths", "Area (sqft)", "Amenities", "Status"
        ])
        self.property_table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.property_table.setSelectionBehavior(QTableWidget.SelectRows)
        self.property_table.setEditTriggers(QTableWidget.NoEditTriggers)
        self.property_table.doubleClicked.connect(self.edit_property)
        layout.addWidget(self.property_table)
        
        self.tabs.addTab(tab, "🏠 Properties")
        self.load_properties()
    
    def load_properties(self):
        """Load all properties"""
        properties = self.db.properties.get_all_properties()
        self.display_properties(properties)
        self.statusBar().showMessage(f"Loaded {len(properties)} properties")
    
    def display_properties(self, properties):
        """Display properties in table"""
        self.property_table.setRowCount(len(properties))
        for i, prop in enumerate(properties):
            self.property_table.setItem(i, 0, QTableWidgetItem(prop['property_id']))
            self.property_table.setItem(i, 1, QTableWidgetItem(prop['property_name']))
            self.property_table.setItem(i, 2, QTableWidgetItem(prop['property_type']))
            self.property_table.setItem(i, 3, QTableWidgetItem(format_currency(prop['price_per_day'])))
            self.property_table.setItem(i, 4, QTableWidgetItem(str(prop['bedrooms'])))
            self.property_table.setItem(i, 5, QTableWidgetItem(str(prop['bathrooms'])))
            self.property_table.setItem(i, 6, QTableWidgetItem(f"{prop['area_sqft']:.0f}"))
            self.property_table.setItem(i, 7, QTableWidgetItem(", ".join(prop['amenities'][:3])))
            
            # Color code status
            status_item = QTableWidgetItem(prop['status'])
            if prop['status'] == 'available':
                status_item.setBackground(Qt.green)
            elif prop['status'] == 'booked':
                status_item.setBackground(Qt.yellow)
            else:
                status_item.setBackground(Qt.gray)
            self.property_table.setItem(i, 8, status_item)
    
    def filter_properties(self):
        """Filter properties by type and status"""
        prop_type = self.property_type_filter.currentText()
        status = self.property_status_filter.currentText()
        
        criteria = {}
        if prop_type != "All":
            criteria['property_type'] = prop_type
        if status != "All":
            criteria['status'] = status
        
        if criteria:
            properties = self.db.properties.search_properties(criteria)
        else:
            properties = self.db.properties.get_all_properties()
        
        self.display_properties(properties)
        self.statusBar().showMessage(f"Found {len(properties)} properties")
    
    def add_property(self):
        """Add new property"""
        dialog = PropertyDialog(self.db)
        if dialog.exec_():
            self.load_properties()
    
    def edit_property(self):
        """Edit selected property"""
        row = self.property_table.currentRow()
        if row < 0:
            QMessageBox.warning(self, "No Selection", "Please select a property to edit!")
            return
        
        property_id = self.property_table.item(row, 0).text()
        prop = self.db.properties.get_property(property_id)
        
        if prop:
            dialog = PropertyDialog(self.db, prop)
            if dialog.exec_():
                self.load_properties()
    
    def delete_property(self):
        """Delete selected property"""
        row = self.property_table.currentRow()
        if row < 0:
            QMessageBox.warning(self, "No Selection", "Please select a property to delete!")
            return
        
        property_id = self.property_table.item(row, 0).text()
        property_name = self.property_table.item(row, 1).text()
        
        reply = QMessageBox.question(
            self, "Confirm Delete",
            f"Are you sure you want to delete property:\n{property_name} ({property_id})?",
            QMessageBox.Yes | QMessageBox.No
        )
        
        if reply == QMessageBox.Yes:
            if self.db.properties.delete_property(property_id):
                QMessageBox.information(self, "Success", "Property deleted successfully!")
                self.load_properties()
            else:
                QMessageBox.critical(self, "Error", "Failed to delete property!")
    
    # ==================== BOOKING TAB ====================
    
    def create_booking_tab(self):
        """Create booking management tab"""
        tab = QWidget()
        layout = QVBoxLayout()
        tab.setLayout(layout)
        
        # Toolbar
        toolbar = QHBoxLayout()
        
        add_btn = QPushButton("➕ Create Booking")
        status_btn = QPushButton("✏️ Update Status")
        cancel_btn = QPushButton("❌ Cancel Booking")
        refresh_btn = QPushButton("🔄 Refresh")
        
        add_btn.clicked.connect(self.create_booking)
        status_btn.clicked.connect(self.update_booking_status)
        cancel_btn.clicked.connect(self.cancel_booking)
        refresh_btn.clicked.connect(self.load_bookings)
        
        toolbar.addWidget(add_btn)
        toolbar.addWidget(status_btn)
        toolbar.addWidget(cancel_btn)
        toolbar.addStretch()
        toolbar.addWidget(refresh_btn)
        
        layout.addLayout(toolbar)
        
        # Table
        self.booking_table = QTableWidget()
        self.booking_table.setColumnCount(9)
        self.booking_table.setHorizontalHeaderLabels([
            "Booking ID", "Customer ID", "Property ID", "Check-in", 
            "Check-out", "Days", "Occupants", "Amount", "Status"
        ])
        self.booking_table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.booking_table.setSelectionBehavior(QTableWidget.SelectRows)
        self.booking_table.setEditTriggers(QTableWidget.NoEditTriggers)
        layout.addWidget(self.booking_table)
        
        self.tabs.addTab(tab, "📅 Bookings")
        self.load_bookings()
    
    def load_bookings(self):
        """Load all bookings"""
        bookings = self.db.bookings.get_all_bookings()
        self.display_bookings(bookings)
        self.statusBar().showMessage(f"Loaded {len(bookings)} bookings")
    
    def display_bookings(self, bookings):
        """Display bookings in table"""
        self.booking_table.setRowCount(len(bookings))
        for i, booking in enumerate(bookings):
            days = (booking['check_out_date'] - booking['check_in_date']).days
            
            self.booking_table.setItem(i, 0, QTableWidgetItem(booking['booking_id']))
            self.booking_table.setItem(i, 1, QTableWidgetItem(booking['customer_id']))
            self.booking_table.setItem(i, 2, QTableWidgetItem(booking['property_id']))
            self.booking_table.setItem(i, 3, QTableWidgetItem(format_date(booking['check_in_date'])))
            self.booking_table.setItem(i, 4, QTableWidgetItem(format_date(booking['check_out_date'])))
            self.booking_table.setItem(i, 5, QTableWidgetItem(str(days)))
            self.booking_table.setItem(i, 6, QTableWidgetItem(str(booking['num_occupants'])))
            self.booking_table.setItem(i, 7, QTableWidgetItem(format_currency(booking['total_amount'])))
            
            # Color code status
            status_item = QTableWidgetItem(booking['booking_status'])
            if booking['booking_status'] == 'confirmed':
                status_item.setBackground(Qt.green)
            elif booking['booking_status'] == 'pending':
                status_item.setBackground(Qt.yellow)
            elif booking['booking_status'] == 'cancelled':
                status_item.setBackground(Qt.red)
            else:
                status_item.setBackground(Qt.gray)
            self.booking_table.setItem(i, 8, status_item)
    
    def create_booking(self):
        """Create new booking"""
        dialog = BookingDialog(self.db)
        if dialog.exec_():
            self.load_bookings()
            self.load_properties()  # Refresh properties as status may change
    
    def update_booking_status(self):
        """Update booking status"""
        row = self.booking_table.currentRow()
        if row < 0:
            QMessageBox.warning(self, "No Selection", "Please select a booking!")
            return
        
        booking_id = self.booking_table.item(row, 0).text()
        current_status = self.booking_table.item(row, 8).text()
        
        status, ok = QInputDialog.getItem(
            self, "Update Status",
            f"Current status: {current_status}\n\nSelect new status:",
            BOOKING_STATUSES, 0, False
        )
        
        if ok and status:
            if self.db.bookings.update_booking_status(booking_id, status):
                QMessageBox.information(self, "Success", f"Booking status updated to: {status}")
                self.load_bookings()
                self.load_properties()
            else:
                QMessageBox.critical(self, "Error", "Failed to update status!")
    
    def cancel_booking(self):
        """Cancel booking"""
        row = self.booking_table.currentRow()
        if row < 0:
            QMessageBox.warning(self, "No Selection", "Please select a booking to cancel!")
            return
        
        booking_id = self.booking_table.item(row, 0).text()
        
        reply = QMessageBox.question(
            self, "Confirm Cancel",
            f"Are you sure you want to cancel booking {booking_id}?",
            QMessageBox.Yes | QMessageBox.No
        )
        
        if reply == QMessageBox.Yes:
            if self.db.bookings.cancel_booking(booking_id):
                QMessageBox.information(self, "Success", "Booking cancelled successfully!")
                self.load_bookings()
                self.load_properties()
            else:
                QMessageBox.critical(self, "Error", "Failed to cancel booking!")
    
    # ==================== PAYMENT TAB ====================
    
    def create_payment_tab(self):
        """Create payment management tab"""
        tab = QWidget()
        layout = QVBoxLayout()
        tab.setLayout(layout)
        
        # Toolbar
        toolbar = QHBoxLayout()
        
        record_btn = QPushButton("➕ Record Payment")
        refresh_btn = QPushButton("🔄 Refresh")
        
        record_btn.clicked.connect(self.record_payment)
        refresh_btn.clicked.connect(self.load_payments)
        
        toolbar.addWidget(record_btn)
        toolbar.addStretch()
        toolbar.addWidget(refresh_btn)
        
        layout.addLayout(toolbar)
        
        # Table
        self.payment_table = QTableWidget()
        self.payment_table.setColumnCount(7)
        self.payment_table.setHorizontalHeaderLabels([
            "Payment ID", "Booking ID", "Customer ID", "Amount", "Date", "Method", "Status"
        ])
        self.payment_table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.payment_table.setSelectionBehavior(QTableWidget.SelectRows)
        self.payment_table.setEditTriggers(QTableWidget.NoEditTriggers)
        layout.addWidget(self.payment_table)
        
        self.tabs.addTab(tab, "💰 Payments")
        self.load_payments()
    
    def load_payments(self):
        """Load all payments"""
        report = self.db.payments.get_revenue_report()
        payments = report['payments']
        self.display_payments(payments)
        self.statusBar().showMessage(f"Loaded {len(payments)} payments - Total: {format_currency(report['total_revenue'])}")
    
    def display_payments(self, payments):
        """Display payments in table"""
        self.payment_table.setRowCount(len(payments))
        for i, payment in enumerate(payments):
            self.payment_table.setItem(i, 0, QTableWidgetItem(payment['payment_id']))
            self.payment_table.setItem(i, 1, QTableWidgetItem(payment['booking_id']))
            self.payment_table.setItem(i, 2, QTableWidgetItem(payment['customer_id']))
            self.payment_table.setItem(i, 3, QTableWidgetItem(format_currency(payment['amount_paid'])))
            self.payment_table.setItem(i, 4, QTableWidgetItem(
                format_date(payment['payment_date'], '%Y-%m-%d %H:%M')
            ))
            self.payment_table.setItem(i, 5, QTableWidgetItem(payment['payment_method']))
            self.payment_table.setItem(i, 6, QTableWidgetItem(payment['payment_status']))
    
    def record_payment(self):
        """Record new payment"""
        dialog = PaymentDialog(self.db)
        if dialog.exec_():
            self.load_payments()
            self.load_bookings()
    
    # ==================== REPORTS TAB ====================
    
    def create_reports_tab(self):
        """Create reports and analytics tab"""
        tab = QWidget()
        layout = QVBoxLayout()
        tab.setLayout(layout)
        
        # Revenue Report
        revenue_group = QGroupBox("💵 Revenue Report")
        revenue_layout = QVBoxLayout()
        
        revenue_btn = QPushButton("Generate Revenue Report")
        revenue_btn.clicked.connect(self.show_revenue_report)
        revenue_layout.addWidget(revenue_btn)
        
        self.revenue_label = QLabel("Total Revenue: $0.00")
        self.revenue_label.setFont(QFont("Arial", 14, QFont.Bold))
        self.revenue_label.setStyleSheet("color: green; padding: 10px;")
        revenue_layout.addWidget(self.revenue_label)
        
        revenue_group.setLayout(revenue_layout)
        layout.addWidget(revenue_group)
        
        # Booking Statistics
        stats_group = QGroupBox("📊 Booking Statistics")
        stats_layout = QVBoxLayout()
        
        stats_btn = QPushButton("Generate Statistics")
        stats_btn.clicked.connect(self.show_booking_stats)
        stats_layout.addWidget(stats_btn)
        
        self.stats_text = QTextEdit()
        self.stats_text.setReadOnly(True)
        self.stats_text.setMaximumHeight(200)
        self.stats_text.setFont(QFont("Courier", 10))
        stats_layout.addWidget(self.stats_text)
        
        stats_group.setLayout(stats_layout)
        layout.addWidget(stats_group)
        
        # Available Properties
        avail_group = QGroupBox("🏘️ Available Properties")
        avail_layout = QVBoxLayout()
        
        avail_btn = QPushButton("Show Available Properties")
        avail_btn.clicked.connect(self.show_available_properties)
        avail_layout.addWidget(avail_btn)
        
        self.avail_label = QLabel("Total Available: 0")
        self.avail_label.setFont(QFont("Arial", 12))
        avail_layout.addWidget(self.avail_label)
        
        self.avail_text = QTextEdit()
        self.avail_text.setReadOnly(True)
        self.avail_text.setMaximumHeight(200)
        avail_layout.addWidget(self.avail_text)
        
        avail_group.setLayout(avail_layout)
        layout.addWidget(avail_group)
        
        layout.addStretch()
        
        self.tabs.addTab(tab, "📈 Reports")
    
    def show_revenue_report(self):
        """Show revenue report"""
        report = self.db.payments.get_revenue_report()
        self.revenue_label.setText(
            f"Total Revenue: {format_currency(report['total_revenue'])} "
            f"({report['total_payments']} payments)"
        )
        self.statusBar().showMessage("Revenue report generated")
    
    def show_booking_stats(self):
        """Show booking statistics"""
        stats = self.db.payments.get_booking_statistics()
        
        text = f"""
╔════════════════════════════════════╗
║     BOOKING STATISTICS             ║
╠════════════════════════════════════╣
║ Total Bookings:        {stats['total']:>10} ║
║ Confirmed:             {stats['confirmed']:>10} ║
║ Pending:               {stats['pending']:>10} ║
║ Cancelled:             {stats['cancelled']:>10} ║
║ Completed:             {stats['completed']:>10} ║
╠════════════════════════════════════╣
"""
        
        if stats['total'] > 0:
            conf_rate = (stats['confirmed'] / stats['total'] * 100)
            canc_rate = (stats['cancelled'] / stats['total'] * 100)
            text += f"║ Confirmation Rate:     {conf_rate:>9.1f}% ║\n"
            text += f"║ Cancellation Rate:     {canc_rate:>9.1f}% ║\n"
        
        text += "╚════════════════════════════════════╝"
        
        self.stats_text.setText(text)
        self.statusBar().showMessage("Statistics generated")
    
    def show_available_properties(self):
        """Show available properties"""
        properties = self.db.properties.get_available_properties()
        self.avail_label.setText(f"Total Available: {len(properties)}")
        
        text = ""
        for prop in properties:
            text += f"🏠 {prop['property_id']}: {prop['property_name']}\n"
            text += f"   Type: {prop['property_type']}, Price: {format_currency(prop['price_per_day'])}/day\n"
            text += f"   {prop['bedrooms']} bed, {prop['bathrooms']} bath, {prop['area_sqft']:.0f} sq ft\n"
            text += f"   Address: {prop['address']}\n\n"
        
        if not text:
            text = "No available properties found."
        
        self.avail_text.setText(text)
        self.statusBar().showMessage(f"Found {len(properties)} available properties")
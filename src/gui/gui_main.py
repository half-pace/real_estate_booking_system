"""
GUI Main Entry Point
"""
import sys
from PyQt5.QtWidgets import QApplication, QMessageBox, QDialog
from PyQt5.QtGui import QPalette, QColor
from PyQt5.QtCore import Qt

from src.database.models import DatabaseManager
from src.gui.dialogs.login_dialog import LoginDialog
from src.gui.windows.main_window import MainWindow
from src.config.settings import DEFAULT_ADMIN


def main():
    """Main entry point for GUI application"""
    app = QApplication(sys.argv)
    app.setStyle('Fusion')
    
    # Set application palette
    palette = QPalette()
    palette.setColor(QPalette.Window, QColor(240, 240, 240))
    palette.setColor(QPalette.WindowText, Qt.black)
    palette.setColor(QPalette.Base, QColor(255, 255, 255))
    palette.setColor(QPalette.AlternateBase, QColor(245, 245, 245))
    palette.setColor(QPalette.ToolTipBase, Qt.white)
    palette.setColor(QPalette.ToolTipText, Qt.black)
    palette.setColor(QPalette.Text, Qt.black)
    palette.setColor(QPalette.Button, QColor(240, 240, 240))
    palette.setColor(QPalette.ButtonText, Qt.black)
    palette.setColor(QPalette.Link, QColor(42, 130, 218))
    palette.setColor(QPalette.Highlight, QColor(42, 130, 218))
    palette.setColor(QPalette.HighlightedText, Qt.white)
    app.setPalette(palette)
    
    # Initialize database
    try:
        db = DatabaseManager()
        
        # Create default admin if doesn't exist
        admin = db.users.collection.find_one({'username': DEFAULT_ADMIN['username']})
        if not admin:
            db.users.create_user(
                DEFAULT_ADMIN['username'],
                DEFAULT_ADMIN['password'],
                DEFAULT_ADMIN['role']
            )
            print(f"Created default admin: {DEFAULT_ADMIN['username']}")
            
    except Exception as e:
        QMessageBox.critical(
            None, "Database Error",
            f"Could not connect to database:\n{str(e)}\n\n"
            "Please ensure MongoDB is running on localhost:27017"
        )
        return 1
    
    # Show login dialog
    login_dialog = LoginDialog(db)
    if login_dialog.exec_() == QDialog.Accepted:
        # Show main window
        window = MainWindow(db, login_dialog.user)
        window.show()
        return app.exec_()
    else:
        db.close()
        return 0


if __name__ == "__main__":
    sys.exit(main())
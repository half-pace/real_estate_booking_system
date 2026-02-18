#!/usr/bin/env python3
"""
Entry point for GUI version of Real Estate Booking System
"""
import sys
from PyQt5.QtWidgets import QApplication
from src.gui.gui_main import main

if __name__ == "__main__":
    sys.exit(main())
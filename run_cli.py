#!/usr/bin/env python3
"""
Entry point for CLI version of Real Estate Booking System
"""
import sys
from src.cli.cli_main import RealEstateBookingCLI

if __name__ == "__main__":
    try:
        app = RealEstateBookingCLI()
        app.run()
    except KeyboardInterrupt:
        print("\n\nApplication terminated by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\nFatal error: {e}")
        sys.exit(1)
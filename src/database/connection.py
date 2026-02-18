"""
Database connection management
"""
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from src.config.settings import DATABASE_CONFIG


class DatabaseConnection:
    """Singleton database connection manager"""
    
    _instance = None
    _client = None
    _db = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._client is None:
            self.connect()
    
    def connect(self):
        """Establish database connection"""
        try:
            connection_string = f"mongodb://{DATABASE_CONFIG['host']}:{DATABASE_CONFIG['port']}/"
            self._client = MongoClient(connection_string, serverSelectionTimeoutMS=5000)
            
            # Test connection
            self._client.admin.command('ping')
            
            self._db = self._client[DATABASE_CONFIG['database']]
            print(f"Connected to MongoDB: {DATABASE_CONFIG['database']}")
            
        except ConnectionFailure as e:
            raise ConnectionError(f"Failed to connect to MongoDB: {e}")
    
    @property
    def db(self):
        """Get database instance"""
        if self._db is None:
            self.connect()
        return self._db
    
    @property
    def client(self):
        """Get MongoDB client"""
        return self._client
    
    def close(self):
        """Close database connection"""
        if self._client:
            self._client.close()
            self._client = None
            self._db = None
            print("Database connection closed")
    
    def get_collection(self, collection_name):
        """Get a specific collection"""
        return self.db[collection_name]


# Global database instance
db_connection = DatabaseConnection()
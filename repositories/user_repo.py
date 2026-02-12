class UserRepo:
    def __init__(self):
        self.users = {}
        
    #methods
    def add(self, user):
        self.user[user.user_id] = user
    
    def get_by_id(self, user_id):
        return self.users.get(user_id)
    
    def get_all(self):
        return list(self.users.values())
    
    def delete(self, user_id):
        if user_id in self.users:
            del self.users[user_id]
            return True 
        return False
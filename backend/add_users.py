from auth import get_password_hash, load_users, save_users

def add_missing_users():
    users = load_users()
    
    new_users = [
        {"email": "user1@ultronfx.com", "password": "user123", "name": "User One"},
        {"email": "user2@ultronfx.com", "password": "user123", "name": "User Two"}
    ]
    
    for u in new_users:
        if u["email"] not in users:
            print(f"Adding {u['email']}...")
            users[u["email"]] = {
                "username": u["email"],
                "email": u["email"],
                "full_name": u["name"],
                "hashed_password": get_password_hash(u["password"]),
                "disabled": False
            }
        else:
            print(f"User {u['email']} already exists. Updating password...")
            users[u["email"]]["hashed_password"] = get_password_hash(u["password"])
            
    save_users(users)
    print("Users added/updated successfully.")

if __name__ == "__main__":
    add_missing_users()

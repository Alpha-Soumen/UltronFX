from auth import get_password_hash, save_users, load_users

def create_users():
    # Load existing users to preserve them
    users_db = load_users()
    
    new_users = [
        {
            "email": "user1@ultronfx.com",
            "password": "user123",
            "full_name": "Permanent User 1"
        },
        {
            "email": "user2@ultronfx.com",
            "password": "user123",
            "full_name": "Permanent User 2"
        }
    ]
    
    for user in new_users:
        hashed_password = get_password_hash(user["password"])
        users_db[user["email"]] = {
            "username": user["email"],
            "email": user["email"],
            "full_name": user["full_name"],
            "hashed_password": hashed_password,
            "disabled": False
        }
        print(f"Created user: {user['email']} / {user['password']}")
    
    save_users(users_db)
    print("All users saved to users.json")

if __name__ == "__main__":
    create_users()

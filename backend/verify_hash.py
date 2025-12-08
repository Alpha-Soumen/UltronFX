from auth import verify_password, load_users

def check_user():
    users = load_users()
    user = users.get("user1@ultronfx.com")
    if not user:
        print("User not found")
        return

    password = "user123"
    hashed = user["hashed_password"]
    
    is_valid = verify_password(password, hashed)
    print(f"User: {user['email']}")
    print(f"Password: {password}")
    print(f"Hash: {hashed}")
    print(f"Valid: {is_valid}")

if __name__ == "__main__":
    check_user()

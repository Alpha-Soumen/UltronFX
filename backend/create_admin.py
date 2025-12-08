from auth import get_password_hash, save_users

def create_admin():
    email = "admin@ultronfx.com"
    password = "admin123"
    full_name = "Admin User"
    
    hashed_password = get_password_hash(password)
    
    user_db = {
        email: {
            "username": email,
            "email": email,
            "full_name": full_name,
            "hashed_password": hashed_password,
            "disabled": False
        }
    }
    
    save_users(user_db)
    print(f"Created admin user: {email} / {password}")

if __name__ == "__main__":
    create_admin()

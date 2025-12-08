import urllib.request
import urllib.parse
import json

def test_flow():
    # 1. Login
    url_token = "http://localhost:8000/token"
    data = urllib.parse.urlencode({
        "username": "admin@ultronfx.com",
        "password": "admin123"
    }).encode()
    
    print("Attempting Login...")
    try:
        req = urllib.request.Request(url_token, data=data, method="POST")
        with urllib.request.urlopen(req) as response:
            token_data = json.loads(response.read().decode())
            access_token = token_data["access_token"]
            print(f"Login Success! Token: {access_token[:20]}...")
    except Exception as e:
        print(f"Login Failed: {e}")
        return

    # 2. Get User
    url_user = "http://localhost:8000/users/me"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    print("Attempting to fetch User Profile...")
    try:
        req = urllib.request.Request(url_user, headers=headers, method="GET")
        with urllib.request.urlopen(req) as response:
            user_data = json.loads(response.read().decode())
            print(f"User Fetch Success! User: {user_data}")
    except urllib.error.HTTPError as e:
        print(f"User Fetch Failed: {e.code} - {e.read().decode()}")
    except Exception as e:
        print(f"User Fetch Failed: {e}")

if __name__ == "__main__":
    test_flow()

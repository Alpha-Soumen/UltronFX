try:
    from jose import jwt
    print("jose imported")
except ImportError as e:
    print(f"jose failed: {e}")

try:
    from passlib.context import CryptContext
    print("passlib imported")
except ImportError as e:
    print(f"passlib failed: {e}")

try:
    import multipart
    print("multipart imported")
except ImportError as e:
    print(f"multipart failed: {e}")

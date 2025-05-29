"""
Script to test the authentication system.
"""
import requests
import json
import os
import sys
from dotenv import load_dotenv
from requests.exceptions import ConnectionError

# Load environment variables
load_dotenv()

# API URL
API_URL = "http://localhost:8000"

def test_email_login():
    """Test email/password login"""
    print("\n=== Testing Email/Password Login ===")
    
    # Login credentials
    data = {
        "username": "user@corpai.com",  # Using username field for OAuth2PasswordRequestForm
        "password": "User@123"
    }
    
    try:
        # Make login request
        response = requests.post(
            f"{API_URL}/auth/login",
            data=data,  # Use data instead of json for OAuth2PasswordRequestForm
            timeout=5  # Add timeout to avoid hanging
        )
        
        # Print response
        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Login successful!")
            print(f"Access token: {result['access_token'][:20]}...")
            print(f"User: {result['user']['email']}")
            return result['access_token']
        else:
            print(f"Login failed: {response.text}")
            return None
    except ConnectionError:
        print(f"Connection error: Could not connect to {API_URL}")
        print("Make sure the backend server is running.")
        return None
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def test_user_info(token):
    """Test getting user info with token"""
    print("\n=== Testing User Info Endpoint ===")
    
    if not token:
        print("No token available, skipping test")
        return
    
    try:
        # Make request with token
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            f"{API_URL}/auth/me",
            headers=headers,
            timeout=5  # Add timeout to avoid hanging
        )
        
        # Print response
        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"User info: {json.dumps(result, indent=2)}")
        else:
            print(f"Failed to get user info: {response.text}")
    except ConnectionError:
        print(f"Connection error: Could not connect to {API_URL}")
        print("Make sure the backend server is running.")
    except Exception as e:
        print(f"Error: {str(e)}")

def test_oauth_urls():
    """Test OAuth login URLs"""
    print("\n=== Testing OAuth Login URLs ===")
    
    # Test Google OAuth URL
    print("Google OAuth URL:")
    print(f"{API_URL}/auth/google/login")
    
    # Test GitHub OAuth URL
    print("GitHub OAuth URL:")
    print(f"{API_URL}/auth/github/login")
    
    print("\nTo test OAuth login, open these URLs in a browser.")

if __name__ == "__main__":
    print("=== Authentication System Test ===")
    
    # Test email login
    token = test_email_login()
    
    # Test user info
    test_user_info(token)
    
    # Test OAuth URLs
    test_oauth_urls()
    
    print("\nTest completed!")

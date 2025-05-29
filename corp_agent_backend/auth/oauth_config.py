import os
from typing import Dict, List, Any

# Google OAuth configuration
GOOGLE_CONFIG: Dict[str, Any] = {
    'client_id': os.getenv('GOOGLE_CLIENT_ID'),
    'client_secret': os.getenv('GOOGLE_CLIENT_SECRET'),
    'redirect_uri': f"{os.getenv('FRONTEND_URL')}/auth/google/callback",
    'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
    'token_uri': 'https://oauth2.googleapis.com/token',
    'userinfo_uri': 'https://www.googleapis.com/oauth2/v3/userinfo',
    'scopes': ['openid', 'email', 'profile']
}

# GitHub OAuth configuration
GITHUB_CONFIG: Dict[str, Any] = {
    'client_id': os.getenv('GITHUB_CLIENT_ID'),
    'client_secret': os.getenv('GITHUB_CLIENT_SECRET'),
    'redirect_uri': f"{os.getenv('FRONTEND_URL')}/auth/github/callback",
    'auth_uri': 'https://github.com/login/oauth/authorize',
    'token_uri': 'https://github.com/login/oauth/access_token',
    'userinfo_uri': 'https://api.github.com/user',
    'email_uri': 'https://api.github.com/user/emails',
    'scopes': ['read:user', 'user:email']
}

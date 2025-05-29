# Authentication System Guide for CORP AI

This guide explains how to use and test the authentication system implemented for CORP AI, including both email/password authentication and OAuth (Google and GitHub).

## Setup

### 1. Database Setup

The database has been set up with the following tables:
- `users`: Stores user information, including OAuth details
- `roles`: Defines user roles (admin, user)
- `subscription_plans`: Available subscription plans
- `user_subscriptions`: User subscription information
- `password_resets`: Password reset tokens

To check the database status, run:
```bash
python3 db/check_database.py
```

### 2. Test Users

Two test users have been created for you:

1. **Admin User**:
   - Email: admin@corpai.com
   - Password: Admin@123

2. **Regular User**:
   - Email: user@corpai.com
   - Password: User@123

## Authentication Methods

### 1. Email/Password Authentication

Users can register and login using their email and password. The system securely hashes passwords and generates JWT tokens for authentication.

**Login Endpoint**: `POST /auth/login`
**Register Endpoint**: `POST /auth/register`

### 2. OAuth Authentication

Users can authenticate using Google or GitHub accounts. The system will:
- Create a new user account if the email doesn't exist
- Link the OAuth provider to an existing account with the same email
- Update user information (profile picture, name) from the OAuth provider

**Google OAuth**: `/auth/google/login`
**GitHub OAuth**: `/auth/github/login`

## Testing the Authentication System

### Running the Backend Server

To run the backend server:
```bash
cd /home/john/Desktop/CORP\ AI/corp_agent_backend
python3 run.py
```

### Testing Email/Password Authentication

You can test the email/password authentication using the test script:
```bash
python3 test_auth.py
```

This will:
1. Attempt to login with the test user credentials
2. Fetch user information using the JWT token
3. Display OAuth URLs for testing

### Testing OAuth Authentication

To test OAuth authentication:
1. Start the backend server
2. Open a browser and navigate to:
   - Google OAuth: http://localhost:8000/auth/google/login
   - GitHub OAuth: http://localhost:8000/auth/github/login
3. Complete the authentication flow on the provider's website
4. You will be redirected back to your application with a JWT token

## Frontend Integration

The frontend has been updated to:
1. Provide OAuth buttons on login and registration pages
2. Handle OAuth redirects and callbacks
3. Store authentication tokens securely

## Security Considerations

The authentication system includes:
- CSRF protection using state tokens
- Secure password hashing
- JWT token-based authentication
- Cookie-based token storage with security flags
- Proper error handling and validation

## Troubleshooting

If you encounter issues:

1. **Database Issues**:
   - Run `python3 db/reset_database.py` to reset the database
   - Run `python3 db/create_tables.py` to recreate the tables
   - Run `python3 db/create_admin_user.py` and `python3 db/create_test_user.py` to recreate test users

2. **OAuth Issues**:
   - Check that your OAuth credentials are correctly set in `.env`
   - Ensure the redirect URIs are correctly configured in the OAuth provider console
   - Check the server logs for detailed error messages

3. **Connection Issues**:
   - Make sure the backend server is running
   - Check that the frontend is correctly configured to connect to the backend
   - Verify that CORS is properly configured to allow cross-origin requests

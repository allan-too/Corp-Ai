# README.md (add LLM section)
```markdown
## Custom LLM (CORP)

We fine-tune Llama-2 via LoRA to create the `corp-llm-loRA` model. Steps:

1. **Prepare data**: Place raw JSONL files in `llm/data/raw/` with format `{ "text": "Your prompt + response"}`.
2. **Preprocess**: `python llm/preprocess.py` to tokenize and save dataset.
3. **Train**: `python llm/train.py` to fine-tune the model using PEFT.
4. **Load in Agent**: `corp_agent.py` will automatically load from `models/corp-llm-loRA`.
markdown
## Authentication & Subscription

- **Register**: `POST /auth/register` with `{email, password, role}` → returns JWT.
- **Login**: `POST /auth/login` with same body → returns JWT.
- **Subscribe**: `POST /auth/subscribe` with `{plan_id}`, header `Authorization: Bearer <token>`.
- Roles and subscription status enforced on `/tools` endpoints.

Make sure to seed `roles` and `subscription_plans` in your database before use.


# CORP AI - OAuth Integration Guide for AI Agent

## Overview
This document provides instructions for integrating Google and GitHub OAuth authentication into the existing CORP AI web application backend.

## Current Authentication System
The frontend currently uses a custom authentication system that communicates with a backend API at:
- Base URL: `http://localhost:8000` (configurable via `VITE_API_URL`)
- Login endpoint: `POST /auth/login`
- Register endpoint: `POST /auth/register`
- Token-based authentication using JWT

## Required OAuth Integration

### 1. Google OAuth Setup

#### Frontend Requirements:
- Add Google OAuth button to Login and Register pages
- Implement Google Sign-In flow
- Handle OAuth callback and token exchange

#### Backend Requirements:
Add the following endpoints to your existing backend:

```python
# New endpoints needed
POST /auth/google/login     # Handle Google OAuth login
POST /auth/google/register  # Handle Google OAuth registration
GET /auth/google/callback   # OAuth callback handler
```

#### Google Cloud Console Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google Identity Toolkit API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)
7. Save Client ID and Client Secret for backend configuration

#### Required User Data from Google:
- Email address (primary identifier)
- Full name
- Profile picture URL
- Google user ID

### 2. GitHub OAuth Setup

#### Frontend Requirements:
- Add GitHub OAuth button to Login and Register pages
- Implement GitHub Sign-In flow
- Handle OAuth callback and token exchange

#### Backend Requirements:
Add the following endpoints:

```python
# New endpoints needed
POST /auth/github/login     # Handle GitHub OAuth login
POST /auth/github/register  # Handle GitHub OAuth registration
GET /auth/github/callback   # OAuth callback handler
```

#### GitHub Developer Settings Setup:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in application details:
   - Application name: "CORP AI"
   - Homepage URL: `https://yourdomain.com`
   - Authorization callback URL: `http://localhost:3000/auth/github/callback`
4. Save Client ID and Client Secret for backend configuration

#### Required User Data from GitHub:
- Email address (primary identifier)
- Username
- Full name
- Avatar URL
- GitHub user ID

### 3. Backend Implementation Guide

#### Environment Variables Needed:
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# OAuth callback URLs
FRONTEND_URL=http://localhost:3000
```

#### Database Schema Updates:
Add OAuth provider information to your user table:

```sql
ALTER TABLE users ADD COLUMN oauth_provider VARCHAR(50);
ALTER TABLE users ADD COLUMN oauth_id VARCHAR(255);
ALTER TABLE users ADD COLUMN profile_picture_url TEXT;
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
```

#### OAuth Flow Implementation:

1. **Google OAuth Flow:**
   ```python
   # 1. Frontend redirects to Google OAuth
   # 2. User authorizes on Google
   # 3. Google redirects to /auth/google/callback with code
   # 4. Backend exchanges code for access token
   # 5. Backend fetches user info from Google API
   # 6. Backend creates/updates user in database
   # 7. Backend returns JWT token to frontend
   ```

2. **GitHub OAuth Flow:**
   ```python
   # 1. Frontend redirects to GitHub OAuth
   # 2. User authorizes on GitHub
   # 3. GitHub redirects to /auth/github/callback with code
   # 4. Backend exchanges code for access token
   # 5. Backend fetches user info from GitHub API
   # 6. Backend creates/updates user in database
   # 7. Backend returns JWT token to frontend
   ```

### 4. Frontend Integration Requirements

#### Install Required Dependencies:
```bash
npm install @google-cloud/oauth2 @octokit/oauth-app
```

#### Frontend OAuth Buttons:
Add these buttons to Login.tsx and Register.tsx:
- "Continue with Google" button
- "Continue with GitHub" button

#### OAuth Redirect Handling:
Create callback pages to handle OAuth redirects:
- `/auth/google/callback`
- `/auth/github/callback`

### 5. Security Considerations

#### CSRF Protection:
- Use state parameter in OAuth flows
- Validate state parameter on callback

#### Token Security:
- Store OAuth tokens securely
- Implement token refresh logic
- Use HTTPS in production

#### User Data Validation:
- Validate email addresses from OAuth providers
- Handle cases where email is not provided
- Implement proper error handling

### 6. Error Handling

#### Common OAuth Errors:
- User denies authorization
- Invalid OAuth configuration
- Network timeouts
- Invalid state parameter
- Email already exists with different provider

#### Error Response Format:
```json
{
  "error": "oauth_error",
  "message": "User denied authorization",
  "provider": "google"
}
```

### 7. Testing Requirements

#### Test Cases:
1. New user registration via Google OAuth
2. New user registration via GitHub OAuth
3. Existing user login via Google OAuth
4. Existing user login via GitHub OAuth
5. Error handling for denied authorization
6. Error handling for network issues
7. State parameter validation

### 8. Production Deployment

#### Required Updates:
1. Update OAuth redirect URIs to production URLs
2. Configure CORS for production domain
3. Update environment variables
4. Test OAuth flows in production environment
5. Monitor OAuth success/failure rates

### 9. Integration Steps for AI Agent

1. **Backend Setup:**
   - Install OAuth libraries for your backend framework
   - Add OAuth endpoints to your API
   - Update database schema
   - Configure environment variables

2. **Frontend Integration:**
   - Add OAuth buttons to authentication pages
   - Implement OAuth redirect handling
   - Update authentication context to handle OAuth tokens
   - Add callback route handlers

3. **Testing:**
   - Test OAuth flows in development
   - Verify user data is correctly stored
   - Test error scenarios

4. **Security Review:**
   - Implement CSRF protection
   - Validate OAuth configurations
   - Review token handling security

## Additional Notes

- The current authentication system uses JWT tokens stored in localStorage
- OAuth integration should maintain compatibility with existing email/password authentication
- Consider implementing account linking for users who sign up with different methods
- Implement proper logout handling for OAuth sessions

## Support Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [JWT Token Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

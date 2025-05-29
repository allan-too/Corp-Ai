from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
import requests
import datetime

from db.session import get_db
from auth.auth_controller import (
    create_access_token, 
    generate_oauth_state, 
    store_oauth_state, 
    verify_oauth_state,
    get_google_user_info,
    get_github_user_info,
    process_oauth_user
)
from auth.oauth_config import GOOGLE_CONFIG, GITHUB_CONFIG

router = APIRouter(prefix="/auth", tags=["oauth"])

@router.get("/google/login")
async def google_login():
    """
    Initiate Google OAuth login flow
    """
    # Generate state token for CSRF protection
    state = generate_oauth_state()
    store_oauth_state(state, "google")
    
    # Build authorization URL
    auth_url = (
        f"{GOOGLE_CONFIG['auth_uri']}?"
        f"response_type=code&"
        f"client_id={GOOGLE_CONFIG['client_id']}&"
        f"redirect_uri={GOOGLE_CONFIG['redirect_uri']}&"
        f"scope={'%20'.join(GOOGLE_CONFIG['scopes'])}&"
        f"state={state}"
    )
    
    # Redirect directly to Google's auth page
    return RedirectResponse(url=auth_url)

@router.get("/google/callback")
async def google_callback(
    code: str, 
    state: str, 
    db: Session = Depends(get_db)
):
    """
    Handle Google OAuth callback
    """
    # Verify state to prevent CSRF
    if not verify_oauth_state(state, "google"):
        raise HTTPException(status_code=400, detail="Invalid state parameter")
    
    # Exchange code for tokens
    token_data = {
        'code': code,
        'client_id': GOOGLE_CONFIG['client_id'],
        'client_secret': GOOGLE_CONFIG['client_secret'],
        'redirect_uri': GOOGLE_CONFIG['redirect_uri'],
        'grant_type': 'authorization_code'
    }
    
    token_response = requests.post(GOOGLE_CONFIG['token_uri'], data=token_data)
    if not token_response.ok:
        raise HTTPException(status_code=400, detail="Failed to retrieve token")
        
    token_json = token_response.json()
    access_token = token_json.get('access_token')
    
    # Get user info with access token
    user_data = get_google_user_info(access_token)
    
    # Process the user (create or update)
    user = process_oauth_user(db, "google", user_data)
    
    # Generate JWT token
    token_expires = datetime.timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=token_expires
    )
    
    # Set the token in a cookie and redirect to dashboard
    response = RedirectResponse(url="/dashboard", status_code=status.HTTP_303_SEE_OTHER)
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=3600,
        expires=3600,
        samesite="lax",
        secure=False  # Set to True in production with HTTPS
    )
    
    return response

@router.get("/github/login")
async def github_login():
    """
    Initiate GitHub OAuth login flow
    """
    # Generate state token for CSRF protection
    state = generate_oauth_state()
    store_oauth_state(state, "github")
    
    # Build authorization URL
    auth_url = (
        f"{GITHUB_CONFIG['auth_uri']}?"
        f"client_id={GITHUB_CONFIG['client_id']}&"
        f"redirect_uri={GITHUB_CONFIG['redirect_uri']}&"
        f"scope={'%20'.join(GITHUB_CONFIG['scopes'])}&"
        f"state={state}"
    )
    
    # Redirect directly to GitHub's auth page
    return RedirectResponse(url=auth_url)

@router.get("/github/callback")
async def github_callback(
    code: str, 
    state: str, 
    db: Session = Depends(get_db)
):
    """
    Handle GitHub OAuth callback
    """
    # Verify state to prevent CSRF
    if not verify_oauth_state(state, "github"):
        raise HTTPException(status_code=400, detail="Invalid state parameter")
    
    # Exchange code for tokens
    headers = {'Accept': 'application/json'}
    token_data = {
        'code': code,
        'client_id': GITHUB_CONFIG['client_id'],
        'client_secret': GITHUB_CONFIG['client_secret'],
        'redirect_uri': GITHUB_CONFIG['redirect_uri'],
    }
    
    token_response = requests.post(GITHUB_CONFIG['token_uri'], headers=headers, data=token_data)
    if not token_response.ok:
        raise HTTPException(status_code=400, detail="Failed to retrieve token")
        
    token_json = token_response.json()
    access_token = token_json.get('access_token')
    
    # Get user info with access token
    user_data = get_github_user_info(access_token)
    
    # Process the user (create or update)
    user = process_oauth_user(db, "github", user_data)
    
    # Generate JWT token
    token_expires = datetime.timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=token_expires
    )
    
    # Set the token in a cookie and redirect to dashboard
    response = RedirectResponse(url="/dashboard", status_code=status.HTTP_303_SEE_OTHER)
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=3600,
        expires=3600,
        samesite="lax",
        secure=False  # Set to True in production with HTTPS
    )
    
    return response

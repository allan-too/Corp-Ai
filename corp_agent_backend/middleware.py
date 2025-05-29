from fastapi import FastAPI, Request, Response, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# Try to import rate limiting, but make it optional
try:
    from fastapi_limiter import FastAPILimiter
    from fastapi_limiter.depends import RateLimiter
    RATE_LIMITING_AVAILABLE = True
except ImportError:
    RATE_LIMITING_AVAILABLE = False
    print("WARNING: fastapi_limiter not available. Rate limiting will be disabled.")
    
    # Create dummy classes for when rate limiting is not available
    class FastAPILimiter:
        @staticmethod
        async def init(*args, **kwargs):
            pass
            
    class RateLimiter:
        def __init__(self, *args, **kwargs):
            pass
            
        async def __call__(self, *args, **kwargs):
            pass
# Try to import Redis, but make it optional
try:
    import redis.asyncio as redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    print("WARNING: redis.asyncio not available. Redis features will be disabled.")
    
    # Create dummy class for when Redis is not available
    class redis:
        @staticmethod
        def from_url(*args, **kwargs):
            return None
import time
import logging
import json
import traceback
from typing import Callable, Dict, Any, Optional
from config import settings
import uuid

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("corp_ai")

class RequestLoggingMiddleware:
    """Middleware for logging requests and responses"""
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
            
        # Create a request object
        request = Request(scope)
        request_id = str(uuid.uuid4())
        
        # Store request_id in request state
        request.state.request_id = request_id
        
        # Log request
        path = scope.get("path", "")
        method = scope.get("method", "")
        logger.info(f"Request {request_id} started: {method} {path}")
        
        start_time = time.time()
        
        # Create a modified send function to capture response status
        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                # Log response
                process_time = time.time() - start_time
                status_code = message["status"]
                logger.info(
                    f"Request {request_id} completed: {method} {path} "
                    f"- Status: {status_code} - Time: {process_time:.4f}s"
                )
                
                # Add custom headers
                headers = message.get("headers", [])
                headers.append((b"X-Process-Time", str(process_time).encode()))
                headers.append((b"X-Request-ID", request_id.encode()))
                message["headers"] = headers
                
            await send(message)
        
        try:
            await self.app(scope, receive, send_wrapper)
        except Exception as e:
            process_time = time.time() - start_time
            logger.error(
                f"Request {request_id} failed: {method} {path} "
                f"- Error: {str(e)} - Time: {process_time:.4f}s"
            )
            logger.error(traceback.format_exc())
            
            # Send error response
            await send({
                "type": "http.response.start",
                "status": 500,
                "headers": [
                    (b"content-type", b"application/json"),
                    (b"X-Request-ID", request_id.encode())
                ]
            })
            
            body = json.dumps({
                "detail": "Internal server error",
                "request_id": request_id
            }).encode("utf-8")
            
            await send({
                "type": "http.response.body",
                "body": body
            })

class ErrorHandlerMiddleware:
    """Middleware for handling and formatting errors"""
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        
        request_id = str(uuid.uuid4())
        
        # Create a modified receive function to store the request_id
        async def receive_wrapper():
            message = await receive()
            if message["type"] == "http.request":
                # Store request_id in request state
                # This is a bit of a hack since we don't have direct access to request.state
                scope["request_id"] = request_id
            return message
        
        # Create a modified send function to handle errors
        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                # Add request ID header
                headers = message.get("headers", [])
                headers.append((b"X-Request-ID", request_id.encode()))
                message["headers"] = headers
            await send(message)
        
        try:
            await self.app(scope, receive_wrapper, send_wrapper)
        except Exception as e:
            # Log the error
            logger.error(f"Unhandled exception in request {request_id}: {str(e)}")
            logger.error(traceback.format_exc())
            
            # Determine status code and error details
            status_code = 500
            error_detail = "Internal server error"
            error_content = {"detail": error_detail, "request_id": request_id}
            
            if isinstance(e, StarletteHTTPException):
                status_code = e.status_code
                error_detail = str(e.detail)
                error_content = {"detail": error_detail, "request_id": request_id}
            elif isinstance(e, RequestValidationError):
                status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
                error_content = {
                    "detail": "Validation error",
                    "errors": [err for err in e.errors()],
                    "request_id": request_id
                }
            
            # Send error response
            await send({
                "type": "http.response.start",
                "status": status_code,
                "headers": [
                    (b"content-type", b"application/json"),
                    (b"X-Request-ID", request_id.encode())
                ]
            })
            
            body = json.dumps(error_content).encode("utf-8")
            
            await send({
                "type": "http.response.body",
                "body": body
            })

async def setup_middlewares(app: FastAPI) -> None:
    """Set up all middlewares for the application"""
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, replace with specific origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Add custom error handler middleware
    app.middleware("http")(ErrorHandlerMiddleware())
    
    # Add request logging middleware
    app.middleware("http")(RequestLoggingMiddleware())
    
    # Set up rate limiting if enabled and available
    if RATE_LIMITING_AVAILABLE and REDIS_AVAILABLE and settings.RATE_LIMIT_ENABLED and settings.RATE_LIMIT_REDIS_URL:
        try:
            redis_instance = redis.from_url(settings.RATE_LIMIT_REDIS_URL)
            await FastAPILimiter.init(redis_instance)
            logger.info("Rate limiting initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize rate limiting: {str(e)}")
            logger.error(traceback.format_exc())
    else:
        if settings.RATE_LIMIT_ENABLED:
            if not RATE_LIMITING_AVAILABLE:
                logger.warning("Rate limiting is enabled but fastapi_limiter is not available")
            elif not REDIS_AVAILABLE:
                logger.warning("Rate limiting is enabled but redis.asyncio is not available")
            else:
                logger.warning("Rate limiting is enabled but not properly configured")
        else:
            logger.info("Rate limiting is disabled")


# Rate limiter dependency for routes
def rate_limit(
    times: int = settings.RATE_LIMIT_DEFAULT_LIMIT,
    seconds: int = settings.RATE_LIMIT_DEFAULT_PERIOD
):
    """Rate limiting dependency that can be applied to routes"""
    if RATE_LIMITING_AVAILABLE and settings.RATE_LIMIT_ENABLED:
        return RateLimiter(times=times, seconds=seconds)
    
    # If rate limiting is disabled or not available, return a no-op dependency
    async def skip_limiter():
        pass
    
    return skip_limiter

# Custom exception handlers
def register_exception_handlers(app: FastAPI) -> None:
    """Register custom exception handlers"""
    
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
        logger.warning(f"HTTP exception in request {request_id}: {exc.status_code} - {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail, "request_id": request_id}
        )
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
        logger.warning(f"Validation error in request {request_id}: {exc.errors()}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": "Validation error",
                "errors": exc.errors(),
                "request_id": request_id
            }
        )
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
        logger.error(f"Unhandled exception in request {request_id}: {str(exc)}")
        logger.error(traceback.format_exc())
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "Internal server error",
                "request_id": request_id
            }
        )

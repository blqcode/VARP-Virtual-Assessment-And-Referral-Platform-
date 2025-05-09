# VARP API Documentation

## Base URL
```
http://localhost:3000/api/auth
```

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### 1. Register User
Register a new user in the system.

**Endpoint:** `POST /register`

**Request Body:**
```json
{
    "name": "string",
    "email": "string",
    "regNumber": "string (9 digits)",
    "password": "string",
    "role": "student" | "admin"
}
```

**Response (201 Created):**
```json
{
    "user": {
        "_id": "string",
        "name": "string",
        "email": "string",
        "regNumber": "string",
        "role": "string",
        "createdAt": "date",
        "updatedAt": "date"
    },
    "token": "string"
}
```

**Error Responses:**
- `409 Conflict`: Email or registration number already exists
- `422 Unprocessable Entity`: Validation error
  - Invalid email format
  - Registration number not 9 digits
  - Missing required fields
  - Invalid role value

### 2. Login
Authenticate a user and get access token.

**Endpoint:** `POST /login`

**Request Body:**
```json
{
    "regNumber": "string",
    "password": "string"
}
```

**Response (200 OK):**
```json
{
    "user": {
        "_id": "string",
        "name": "string",
        "email": "string",
        "regNumber": "string",
        "role": "string",
        "createdAt": "date",
        "updatedAt": "date"
    },
    "token": "string"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `404 Not Found`: User not found
- `422 Unprocessable Entity`: Missing required fields

### 3. Get Current User
Get information about the currently authenticated user.

**Endpoint:** `GET /user`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "user": {
        "_id": "string",
        "name": "string",
        "email": "string",
        "regNumber": "string",
        "role": "string",
        "createdAt": "date",
        "updatedAt": "date"
    }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token

### 4. Logout
Logout the current user.

**Endpoint:** `POST /logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token

## Error Response Format
All error responses follow this format:
```json
{
    "status": "error",
    "message": "Error description"
}
```

## Validation Rules

### User Registration
- Name: Required, non-empty string
- Email: Required, valid email format, unique
- Registration Number: Required, exactly 9 digits, unique
- Password: Required, minimum length 6 characters
- Role: Required, must be either "student" or "admin"

### User Login
- Registration Number: Required, must exist in database
- Password: Required, must match stored password

## Security Features
- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Rate limiting on login attempts
- Input validation and sanitization
- CORS enabled for development
- Helmet security headers

## Development Notes
- MongoDB indexes are set up for email and registration number uniqueness
- JWT tokens expire after 24 hours
- All timestamps are in UTC
- Error messages are user-friendly and descriptive

## Testing
The API can be tested using any HTTP client (Postman, curl, etc.) or by implementing the endpoints in your frontend application.

Example curl command for registration:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "regNumber": "123456789",
    "password": "password123",
    "role": "student"
  }'
```

Example curl command for login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "regNumber": "123456789",
    "password": "password123"
  }'
```

## Integration Guide

### Frontend Integration

#### 1. User Registration Flow
```javascript
// Example using fetch API
async function registerUser(userData) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message);
        }
        
        // Store token in localStorage or secure cookie
        localStorage.setItem('authToken', data.token);
        
        return data.user;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
}
```

#### 2. User Login Flow
```javascript
async function loginUser(credentials) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message);
        }
        
        // Store token in localStorage or secure cookie
        localStorage.setItem('authToken', data.token);
        
        return data.user;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}
```

#### 3. Authentication Middleware
```javascript
// Create an axios instance with auth interceptor
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for handling token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

#### 4. Protected Route Component (React Example)
```javascript
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

// Usage in router
<Route 
    path="/dashboard" 
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    } 
/>
```

### Backend Integration

#### 1. Verify Token Middleware
```javascript
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'No token provided'
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }
};
```

#### 2. Role-Based Access Control
```javascript
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'Unauthorized access'
            });
        }
        next();
    };
};

// Usage in routes
router.get('/admin-only', 
    verifyToken, 
    checkRole(['admin']), 
    adminController.getData
);
```

### Security Best Practices

1. **Token Storage**
   - Store tokens in HttpOnly cookies for web applications
   - Use secure storage (Keychain/Keystore) for mobile apps
   - Never store tokens in localStorage for production apps

2. **Token Refresh**
   - Implement token refresh mechanism for long-lived sessions
   - Store refresh tokens securely
   - Rotate refresh tokens on use

3. **CORS Configuration**
   - Configure CORS to only allow requests from trusted domains
   - Use environment variables for allowed origins
   ```javascript
   app.use(cors({
       origin: process.env.ALLOWED_ORIGINS.split(','),
       credentials: true
   }));
   ```

4. **Rate Limiting**
   - Implement rate limiting for authentication endpoints
   - Use IP-based and user-based rate limiting
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const authLimiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 5 // limit each IP to 5 requests per windowMs
   });
   
   app.use('/api/auth/login', authLimiter);
   ```

### Environment Configuration

Create a `.env` file in your application:
```env
# API Configuration
API_URL=http://localhost:3000/api
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Error Handling

Implement consistent error handling across your application:
```javascript
// Frontend error handler
const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error
        const { status, data } = error.response;
        switch (status) {
            case 401:
                // Handle unauthorized
                break;
            case 403:
                // Handle forbidden
                break;
            case 422:
                // Handle validation errors
                break;
            default:
                // Handle other errors
                break;
        }
    } else if (error.request) {
        // Request made but no response
        console.error('No response received');
    } else {
        // Error in request setup
        console.error('Request setup error:', error.message);
    }
};
```

This authentication API is designed to be a standalone service that can be integrated with any frontend or backend application. The modular design allows for easy integration while maintaining security and scalability. 
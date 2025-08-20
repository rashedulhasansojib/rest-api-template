# Authentication & Authorization Guide

This guide explains how to use the JWT-based authentication and role-based access control system.

## 🔐 Authentication Flow

### 1. User Registration

```bash
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "role": "user"  // optional, defaults to "user"
}
```

### 2. User Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user",
      "status": "active",
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

### 3. Using the Token

Include the token in the Authorization header for protected routes:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛡️ User Roles & Permissions

### Role Hierarchy

- **user**: Basic user with limited access
- **moderator**: Can view all users, moderate content
- **admin**: Full access to all resources

### Permission Matrix

| Endpoint                 | Public | User     | Moderator | Admin |
| ------------------------ | ------ | -------- | --------- | ----- |
| `POST /api/users`        | ✅     | ✅       | ✅        | ✅    |
| `POST /api/auth/login`   | ✅     | ✅       | ✅        | ✅    |
| `GET /api/auth/me`       | ❌     | ✅       | ✅        | ✅    |
| `POST /api/auth/logout`  | ❌     | ✅       | ✅        | ✅    |
| `POST /api/auth/refresh` | ❌     | ✅       | ✅        | ✅    |
| `GET /api/users`         | ❌     | ❌       | ✅        | ✅    |
| `GET /api/users/:id`     | ❌     | Own only | ✅        | ✅    |
| `PUT /api/users/:id`     | ❌     | Own only | Own only  | ✅    |
| `DELETE /api/users/:id`  | ❌     | ❌       | ❌        | ✅    |

## 📋 API Endpoints

### Authentication Endpoints

#### Login

```bash
POST /api/auth/login
```

- **Public**: Yes
- **Body**: `{ email, password }`
- **Returns**: User info + JWT token

#### Get Current User

```bash
GET /api/auth/me
```

- **Auth Required**: Yes
- **Returns**: Current user profile

#### Logout

```bash
POST /api/auth/logout
```

- **Auth Required**: Yes
- **Note**: Client-side token removal (JWT is stateless)

#### Refresh Token

```bash
POST /api/auth/refresh
```

- **Auth Required**: Yes
- **Returns**: New JWT token

### User Management Endpoints

#### Create User

```bash
POST /api/users
```

- **Public**: Yes (registration)
- **Body**: `{ name, email, password, confirmPassword, role? }`

#### Get All Users

```bash
GET /api/users?page=1&limit=10
```

- **Auth Required**: Yes
- **Roles**: Admin, Moderator
- **Query Params**: `page`, `limit`

#### Get User by ID

```bash
GET /api/users/:id
```

- **Auth Required**: Yes
- **Access**: Own profile or Admin

#### Update User

```bash
PUT /api/users/:id
```

- **Auth Required**: Yes
- **Access**: Own profile or Admin
- **Body**: `{ name?, email?, role?, status? }`

#### Delete User

```bash
DELETE /api/users/:id
```

- **Auth Required**: Yes
- **Roles**: Admin only

## 🔧 User Status Management

### User Status Values

- **active**: User can login and use the system
- **inactive**: User account is disabled
- **suspended**: User account is temporarily suspended

### Status Checks

The system automatically checks user status during login:

- `suspended` users receive 403 error
- `inactive` users receive 403 error
- Only `active` users can login successfully

## 💡 Usage Examples

### Frontend Integration (JavaScript)

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    return data.data.user;
  }
  throw new Error(data.message);
};

// Make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get current user
const getCurrentUser = async () => {
  const response = await fetchWithAuth('/api/auth/me');
  return response.json();
};
```

### cURL Examples

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123!"}'

# Get current user (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Get all users (admin/moderator only)
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer TOKEN"

# Update user status (admin only)
curl -X PUT http://localhost:3000/api/users/USER_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"suspended"}'
```

## 🚨 Security Best Practices

1. **Token Storage**: Store JWT tokens securely (httpOnly cookies recommended for web apps)
2. **Token Expiration**: Tokens expire in 7 days by default (configurable)
3. **HTTPS Only**: Always use HTTPS in production
4. **Password Requirements**: Strong password validation enforced
5. **Rate Limiting**: Implement rate limiting on auth endpoints
6. **Account Lockout**: Consider implementing account lockout after failed attempts

## 🔄 Token Refresh Strategy

```javascript
// Auto-refresh token before expiration
const refreshToken = async () => {
  const response = await fetchWithAuth('/api/auth/refresh', {
    method: 'POST',
  });

  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    return data.data.token;
  }

  // Redirect to login if refresh fails
  window.location.href = '/login';
};

// Set up automatic refresh (e.g., every 6 days)
setInterval(refreshToken, 6 * 24 * 60 * 60 * 1000);
```

## 🛠️ Customization

### Adding New Roles

1. Update `UserRole` enum in `src/types/user.types.ts`
2. Update user model schema in `src/models/user.model.ts`
3. Update validation schema in `src/schemas/user.schema.ts`
4. Add role-specific route protection

### Custom Permissions

Create custom middleware for specific permission checks:

```typescript
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user has specific permission
    // Implementation depends on your permission system
  };
};
```

This authentication system provides a solid foundation for secure user management with role-based access control.

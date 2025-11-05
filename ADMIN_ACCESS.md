# Admin Dashboard Access Guide

## Problem
The admin dashboard requires a user with `role: "admin"` (case-insensitive variations: "admin", "Super Admin", "superadmin").

## Solutions

### Option 1: Check Backend Default Admin Credentials
Your backend might have default admin credentials. Common defaults:
- **Email**: `admin@example.com` or `admin@dml.com` 
- **Password**: `admin` or `admin123` or `password`

### Option 2: Update User Role in Database
1. Sign up a regular user through the frontend at `/auth/signup`
2. Access your database (SQLite, PostgreSQL, MySQL, etc.)
3. Find the user in the `users` table
4. Update the `role` field to `"admin"` (or `"Admin"` or `"super admin"` - the code handles all variations)
5. Log in with that user account

### Option 3: Create Admin User via Backend API
If your backend has an admin user creation endpoint, you can use it directly:

```bash
# Example curl command (adjust URL and credentials)
curl -X POST http://localhost:5000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dml.com",
    "password": "your_secure_password",
    "name": "Admin User",
    "role": "Super Admin"
  }'
```

### Option 4: Check Backend Seed Scripts
Your backend might have seed/initialization scripts that create a default admin user. Check:
- `seed.py` or `init_db.py` files
- Database migration scripts
- Backend README.md

## Testing Admin Access
After creating/updating an admin user:
1. Go to `/auth/signin`
2. Log in with the admin credentials
3. You should be redirected to `/admin` automatically
4. If redirected to `/dashboard` instead, check:
   - Browser console for errors
   - Network tab to see the `/api/user/profile` response
   - Verify the `role` field in the response is `"admin"`, `"Admin"`, or `"Super Admin"`

## Backend API Endpoint
The frontend expects the backend to:
- **Endpoint**: `GET /api/user/profile`
- **Response format**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"  // This must be "admin", "Admin", "Super Admin", or "superadmin"
  }
}
```

## Notes
- The frontend checks for admin role case-insensitively
- Supported role values: `"admin"`, `"super admin"`, `"superadmin"`
- If the role doesn't match, you'll be redirected to the user dashboard


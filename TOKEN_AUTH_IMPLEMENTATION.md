# Token-Based Authentication Implementation

## Overview
Added JWT token-based authentication to support mobile browsers that block third-party cookies, while maintaining backward compatibility with session-based authentication for desktop browsers.

## Changes Made

### Backend Changes

#### 1. `requirements.txt`
- **Added**: `PyJWT==2.8.0` for JWT token generation and verification

#### 2. `routes/users.py`
- **Added imports**: `jwt` and `timedelta`
- **Added helper functions**:
  - `generate_token(user_id, email)`: Creates JWT tokens with 7-day expiration
  - `verify_token(token)`: Validates and decodes JWT tokens
  - `get_user_id_from_request()`: Gets user_id from either session (desktop) or Authorization header (mobile)
  - `get_admin_user_id()`: Helper for admin endpoints supporting both auth methods

- **Updated endpoints**:
  - `POST /api/user/signup`: Now returns a `token` field in the response
  - `POST /api/user/login`: Now returns a `token` field in the response
  - `GET /api/user/profile`: Now accepts both session cookies and Bearer tokens
  - `GET /api/admin/users`: Now accepts both session cookies and Bearer tokens
  - `POST /api/admin/users`: Now accepts both session cookies and Bearer tokens
  - `PUT /api/admin/users/<user_id>`: Now accepts both session cookies and Bearer tokens
  - `DELETE /api/admin/users/<user_id>`: Now accepts both session cookies and Bearer tokens

#### 3. `utils/auth_utils.py`
- **Added imports**: `jwt` and `request`
- **Added functions**:
  - `verify_token(token)`: Validates JWT tokens
  - `get_user_id_from_request()`: Checks both session and Authorization header
- **Updated functions**:
  - `get_current_user()`: Now uses `get_user_id_from_request()` to support both auth methods
  - `require_admin()`: Automatically supports token auth through updated `get_current_user()`

### Frontend Changes

#### 1. `src/hooks/useAuth.ts`
- **Updated `signUp` function**: 
  - Stores JWT token in `localStorage` when received from backend
  - Token is saved with key `auth_token`

- **Updated `signIn` function**:
  - Stores JWT token in `localStorage` when received from backend
  - Token is saved with key `auth_token`

- **Updated `signOut` function**:
  - Removes token from `localStorage` on logout
  - Clears `auth_token` key

#### 2. `src/lib/api.ts`
- **Updated `request` method**:
  - Checks for `auth_token` in `localStorage`
  - Adds `Authorization: Bearer <token>` header to all requests if token exists
  - Token is sent alongside session cookies for maximum compatibility

## How It Works

### Desktop Browsers (Existing Behavior - No Changes)
1. User signs up/logs in
2. Backend sets session cookie
3. Frontend uses session cookie for all requests
4. Everything works as before

### Mobile Browsers (New Behavior)
1. User signs up/logs in
2. Backend sets session cookie (may be blocked) AND returns JWT token
3. Frontend stores token in `localStorage`
4. Frontend sends token in `Authorization` header with every request
5. Backend checks Authorization header if no session cookie found
6. Authentication works even if cookies are blocked

### Hybrid Approach (Best of Both Worlds)
- Desktop: Uses session cookies (more secure, httpOnly)
- Mobile: Uses JWT tokens (works around cookie restrictions)
- Backend: Accepts both methods transparently
- No breaking changes to existing functionality

## Security Considerations

1. **Token Expiration**: Tokens expire after 7 days
2. **HTTPS Required**: Tokens only work over HTTPS in production
3. **localStorage**: Tokens stored in localStorage (accessible to JavaScript but necessary for mobile)
4. **Session Cookies**: Still used on desktop for better security
5. **Backward Compatible**: Existing users/sessions continue to work

## Testing

### To Test on Desktop:
1. Clear cookies and localStorage
2. Sign up or log in
3. Should work normally with session cookies

### To Test on Mobile:
1. Open site on mobile browser
2. Sign up or log in
3. Should redirect to dashboard (no longer redirects to login)
4. Refresh page - should stay logged in
5. Check Application → Local Storage → auth_token should exist

### To Test Token Auth Specifically:
1. Open browser DevTools
2. Go to Application → Cookies
3. Delete all cookies
4. Stay on same page (already have token in localStorage)
5. Try to access protected resource - should still work via token

## Migration Notes

- **No database changes required**
- **No breaking changes** - existing sessions continue to work
- **No frontend changes needed** for users - automatic
- **Deploy backend first**, then frontend (or together)
- **PyJWT must be installed** on backend: `pip install PyJWT==2.8.0`

## Rollback Plan

If issues occur, the changes are backward compatible:
1. Frontend will still work with session cookies only
2. Backend will continue accepting session cookies
3. Remove token generation code from backend if needed
4. Remove token storage code from frontend if needed

## Status

✅ Backend implementation complete
✅ Frontend implementation complete
✅ Backward compatibility maintained
✅ No breaking changes
⏳ Ready for testing
⏳ Ready for deployment

## Next Steps

1. **Test locally** with both desktop and mobile browsers
2. **Deploy to staging** (if available)
3. **Deploy to production**:
   - Backend: Push to GitHub, Render auto-deploys
   - Frontend: Push to GitHub, Netlify auto-deploys
4. **Monitor** for any authentication issues
5. **Test mobile signup** specifically on iOS Safari and Android Chrome


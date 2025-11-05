# Backend Chat Setup Instructions

## Quick Compatibility Check

Your frontend chatbox is **designed to work with a Flask backend** and includes offline mode fallback. Here's what you need to verify:

## 1. Backend Server Configuration

### Check if backend is running:
- Default URL: `http://localhost:5000`
- API Base: `http://localhost:5000/api`
- Check your `.env` file for `VITE_API_BASE_URL` setting

### Test backend connection:
1. Open browser console (F12)
2. Go to any public page (not admin/dashboard)
3. Open chatbox
4. Check console for API errors

## 2. Required Backend Endpoints

Your backend (in `Backend` folder) needs to implement these endpoints:

### Essential Endpoints (for chatbox to work):
```
POST   /api/chat/sessions
POST   /api/chat/sessions/{sessionId}/messages
GET    /api/chat/sessions/{sessionId}
POST   /api/chat/sessions/{sessionId}/request-agent
GET    /api/chat/sessions/{sessionId}/messages
```

### Admin Endpoints (for admin chat management):
```
GET    /api/chat/sessions
POST   /api/chat/sessions/{sessionId}/agent-message
PATCH  /api/chat/sessions/{sessionId}
POST   /api/chat/sessions/{sessionId}/end
```

## 3. Response Format Examples

### Create Session Response:
```python
# Flask example
@app.route('/api/chat/sessions', methods=['POST'])
def create_chat_session():
    data = request.get_json()
    session_id = create_session(data['email'], data.get('name'))
    return jsonify({
        'success': True,
        'session': {
            'id': session_id,
            'email': data['email'],
            'name': data.get('name'),
            'status': 'active'
        }
    })
```

### Send Message Response:
```python
@app.route('/api/chat/sessions/<session_id>/messages', methods=['POST'])
def send_message(session_id):
    data = request.get_json()
    message = data['message']
    
    # Process message and get AI response
    ai_response = process_message(message, session_id)
    
    return jsonify({
        'success': True,
        'response': ai_response,  # AI assistant response
        'session': {
            'status': 'active'  # or 'waiting_agent', 'agent_assigned', etc.
        }
    })
```

## 4. Database Schema Suggestions

### Chat Sessions Table:
```sql
CREATE TABLE chat_sessions (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    assigned_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Chat Messages Table:
```sql
CREATE TABLE chat_messages (
    id VARCHAR(255) PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    sender VARCHAR(50) NOT NULL,  -- 'user', 'assistant', 'agent'
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
);
```

## 5. CORS Configuration

Make sure your Flask backend has CORS enabled:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=['http://localhost:3000', 'http://localhost:5173'])
```

## 6. Testing the Connection

### Test 1: Check if backend is accessible
```bash
curl http://localhost:5000/api/chat/sessions
```

### Test 2: Create a session
```bash
curl -X POST http://localhost:5000/api/chat/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

### Test 3: Check frontend console
1. Open browser DevTools (F12)
2. Go to Network tab
3. Open chatbox on frontend
4. Check if API calls are being made
5. Check response status codes

## 7. Common Issues & Solutions

### Issue: "Failed to fetch" error
**Solution:**
- Check if backend is running on port 5000
- Verify CORS is enabled
- Check `VITE_API_BASE_URL` in `.env` file

### Issue: "401 Unauthorized" error
**Solution:**
- Ensure admin endpoints require authentication
- Check Flask session configuration
- Verify cookies are being sent

### Issue: Chatbox shows "Offline Mode"
**Solution:**
- Backend is not responding
- Check backend logs for errors
- Verify API endpoints are implemented
- Check network connectivity

### Issue: Messages not appearing
**Solution:**
- Verify message format matches expected structure
- Check `sender` field is one of: 'user', 'assistant', 'agent'
- Ensure timestamps are included
- Check database queries return messages in correct format

## 8. Frontend Offline Mode

The frontend will automatically:
- ✅ Work in offline mode if backend is unavailable
- ✅ Use local AI responses as fallback
- ✅ Show "Offline Mode" indicator
- ✅ Still allow basic chat functionality

## 9. Next Steps

1. **Check your backend** - Verify all endpoints are implemented
2. **Test connection** - Use the test commands above
3. **Check logs** - Look at backend console for errors
4. **Verify CORS** - Ensure CORS is properly configured
5. **Test chatbox** - Open chatbox on frontend and check console

## 10. Getting Help

If you're still having issues:
1. Check browser console for specific error messages
2. Check backend logs for server errors
3. Verify API endpoint URLs match exactly
4. Test endpoints with curl/Postman first
5. Check `CHAT_API_COMPATIBILITY.md` for detailed endpoint specs


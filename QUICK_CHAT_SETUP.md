# Quick Chat API Setup Guide

## Your Backend Status

✅ **Backend is running** at `http://localhost:5000`  
❌ **Chat endpoints are not implemented yet**

## What You Need to Do

Your backend needs to implement the chat API endpoints. Here's a quick setup guide:

### 1. Add Chat Routes to Your Flask Backend

Create a new file in your backend (e.g., `routes/chat.py` or add to your main app):

```python
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

chat_bp = Blueprint('chat', __name__)

# In-memory storage (replace with database)
chat_sessions = {}
chat_messages = {}

@chat_bp.route('/api/chat/sessions', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def chat_sessions():
    if request.method == 'GET':
        # Get all sessions (admin)
        sessions = list(chat_sessions.values())
        return jsonify({
            'success': True,
            'sessions': sessions
        })
    else:
        # Create new session
        data = request.get_json()
        session_id = f"session_{len(chat_sessions) + 1}"
        session = {
            'id': session_id,
            'email': data.get('email'),
            'name': data.get('name'),
            'status': 'active',
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        }
        chat_sessions[session_id] = session
        return jsonify({
            'success': True,
            'session': session
        })

@chat_bp.route('/api/chat/sessions/<session_id>', methods=['GET', 'PATCH'])
@cross_origin(supports_credentials=True)
def chat_session(session_id):
    if request.method == 'GET':
        session = chat_sessions.get(session_id)
        if session:
            return jsonify({
                'success': True,
                'session': session
            })
        return jsonify({'error': 'Session not found'}), 404
    
    if request.method == 'PATCH':
        data = request.get_json()
        if session_id in chat_sessions:
            chat_sessions[session_id].update(data)
            return jsonify({
                'success': True,
                'session': chat_sessions[session_id]
            })
        return jsonify({'error': 'Session not found'}), 404

@chat_bp.route('/api/chat/sessions/<session_id>/messages', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def chat_messages(session_id):
    if request.method == 'GET':
        messages = chat_messages.get(session_id, [])
        return jsonify({
            'success': True,
            'messages': messages
        })
    
    if request.method == 'POST':
        data = request.get_json()
        message = {
            'id': f"msg_{len(chat_messages.get(session_id, [])) + 1}",
            'text': data.get('message'),
            'sender': 'user',
            'timestamp': datetime.now().isoformat()
        }
        if session_id not in chat_messages:
            chat_messages[session_id] = []
        chat_messages[session_id].append(message)
        
        # Simple AI response (replace with your AI logic)
        ai_response = {
            'id': f"msg_{len(chat_messages[session_id]) + 1}",
            'text': "Thank you for your message! I'm here to help.",
            'sender': 'assistant',
            'timestamp': datetime.now().isoformat()
        }
        chat_messages[session_id].append(ai_response)
        
        return jsonify({
            'success': True,
            'response': ai_response['text'],
            'session': chat_sessions.get(session_id, {})
        })

@chat_bp.route('/api/chat/sessions/<session_id>/request-agent', methods=['POST'])
@cross_origin(supports_credentials=True)
def request_agent(session_id):
    if session_id in chat_sessions:
        chat_sessions[session_id]['status'] = 'waiting_agent'
        return jsonify({
            'success': True,
            'session': chat_sessions[session_id]
        })
    return jsonify({'error': 'Session not found'}), 404

@chat_bp.route('/api/chat/sessions/<session_id>/agent-message', methods=['POST'])
@cross_origin(supports_credentials=True)
def agent_message(session_id):
    data = request.get_json()
    message = {
        'id': f"msg_{len(chat_messages.get(session_id, [])) + 1}",
        'text': data.get('message'),
        'sender': 'agent',
        'timestamp': datetime.now().isoformat()
    }
    if session_id not in chat_messages:
        chat_messages[session_id] = []
    chat_messages[session_id].append(message)
    
    return jsonify({
        'success': True,
        'message': message
    })

@chat_bp.route('/api/chat/sessions/<session_id>/end', methods=['POST'])
@cross_origin(supports_credentials=True)
def end_session(session_id):
    if session_id in chat_sessions:
        chat_sessions[session_id]['status'] = 'ended'
        return jsonify({
            'success': True,
            'session': chat_sessions[session_id]
        })
    return jsonify({'error': 'Session not found'}), 404
```

### 2. Register the Blueprint

In your main Flask app file:

```python
from routes.chat import chat_bp

app.register_blueprint(chat_bp)
```

### 3. Ensure CORS is Enabled

```python
from flask_cors import CORS

CORS(app, supports_credentials=True, origins=['http://localhost:3000', 'http://localhost:5173'])
```

### 4. Required Endpoints Summary

Your backend needs these endpoints:

```
GET    /api/chat/sessions           - Get all sessions (admin)
POST   /api/chat/sessions           - Create session
GET    /api/chat/sessions/{id}     - Get session
PATCH  /api/chat/sessions/{id}     - Update session
GET    /api/chat/sessions/{id}/messages - Get messages
POST   /api/chat/sessions/{id}/messages - Send message
POST   /api/chat/sessions/{id}/request-agent - Request agent
POST   /api/chat/sessions/{id}/agent-message - Agent send message
POST   /api/chat/sessions/{id}/end - End session
```

### 5. Test the Endpoints

After implementing, test with:

```bash
# Test create session
curl -X POST http://localhost:5000/api/chat/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test"}'

# Test get sessions
curl http://localhost:5000/api/chat/sessions
```

### 6. Database Integration (Optional)

Replace the in-memory dictionaries with your database:

```python
# Example with SQLAlchemy
from models import ChatSession, ChatMessage

# Create session
session = ChatSession(email=data['email'], name=data.get('name'))
db.session.add(session)
db.session.commit()
```

## Next Steps

1. Implement the endpoints above in your backend
2. Restart your Flask server
3. Refresh the admin chat management page
4. The connection should work!

For detailed API specifications, see `CHAT_API_COMPATIBILITY.md`.


# Chat API Compatibility Guide

## Frontend Expected API Endpoints

The chatbox frontend expects the following API endpoints to be implemented in your backend:

### Base URL Configuration
- Base URL: `http://localhost:5000/api` (or from `VITE_API_BASE_URL` env variable)
- All endpoints are relative to `/api` base path

---

## Required Chat API Endpoints

### 1. Create Chat Session
**Endpoint:** `POST /api/chat/sessions`

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe" // Optional
}
```

**Expected Response:**
```json
{
  "success": true,
  "session": {
    "id": "session-id-123",
    "_id": "session-id-123", // Alternative field name
    "sessionId": "session-id-123", // Alternative field name
    "email": "user@example.com",
    "name": "John Doe",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Or alternative format:**
```json
{
  "success": true,
  "sessionId": "session-id-123"
}
```

---

### 2. Send Chat Message
**Endpoint:** `POST /api/chat/sessions/{sessionId}/messages`

**Request Body:**
```json
{
  "message": "Hello, I need help with tracking"
}
```

**Expected Response:**
```json
{
  "success": true,
  "response": "AI response text here", // Optional AI response
  "session": {
    "status": "active" | "waiting_agent" | "agent_assigned" | "agent_active",
    "assignedAgent": {
      "name": "Agent Name",
      "email": "agent@example.com"
    } // Optional, if agent is assigned
  }
}
```

**Or alternative format:**
```json
{
  "success": true,
  "message": {
    "id": "msg-id-123",
    "text": "AI response",
    "sender": "assistant"
  }
}
```

---

### 3. Get Chat Session
**Endpoint:** `GET /api/chat/sessions/{sessionId}`

**Expected Response:**
```json
{
  "success": true,
  "session": {
    "id": "session-id-123",
    "status": "active" | "waiting_agent" | "agent_assigned" | "agent_active" | "ended",
    "assignedAgent": {
      "name": "Agent Name",
      "email": "agent@example.com"
    } // Optional
  }
}
```

**Note:** This endpoint should work without authentication (`requiresAuth: false`)

---

### 4. Request Live Agent
**Endpoint:** `POST /api/chat/sessions/{sessionId}/request-agent`

**Request Body:** (empty)

**Expected Response:**
```json
{
  "success": true,
  "session": {
    "status": "waiting_agent"
  }
}
```

---

### 5. Send Agent Message (Admin)
**Endpoint:** `POST /api/chat/sessions/{sessionId}/agent-message`

**Request Body:**
```json
{
  "message": "Hello, how can I help you?"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": {
    "id": "msg-id-123",
    "text": "Hello, how can I help you?",
    "sender": "agent",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

---

### 6. Get All Chat Sessions (Admin)
**Endpoint:** `GET /api/chat/sessions`

**Query Parameters:**
- `status` (optional): Filter by status (all, active, waiting_agent, agent_assigned, ended)
- `email` (optional): Filter by user email
- `dateFrom` (optional): Filter from date
- `dateTo` (optional): Filter to date

**Expected Response:**
```json
{
  "success": true,
  "sessions": [
    {
      "id": "session-id-123",
      "email": "user@example.com",
      "name": "John Doe",
      "status": "active",
      "assignedAgent": "Agent Name" | { "name": "Agent Name", "email": "agent@example.com" },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "messageCount": 5,
      "lastMessage": "Last message text",
      "lastMessageTime": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Or alternative format:**
```json
[
  {
    "id": "session-id-123",
    "email": "user@example.com",
    ...
  }
]
```

---

### 7. Get Chat Messages
**Endpoint:** `GET /api/chat/sessions/{sessionId}/messages`

**Expected Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg-id-123",
      "_id": "msg-id-123", // Alternative field name
      "text": "Message content",
      "message": "Message content", // Alternative field name
      "content": "Message content", // Alternative field name
      "sender": "user" | "assistant" | "agent",
      "type": "user" | "assistant" | "agent", // Alternative field name
      "timestamp": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z", // Alternative field name
      "created_at": "2024-01-01T00:00:00Z" // Alternative field name
    }
  ]
}
```

**Or alternative format:**
```json
[
  {
    "id": "msg-id-123",
    "text": "Message content",
    "sender": "user",
    "timestamp": "2024-01-01T00:00:00Z"
  }
]
```

---

### 8. Update Chat Session (Admin)
**Endpoint:** `PATCH /api/chat/sessions/{sessionId}`

**Request Body:**
```json
{
  "status": "agent_active",
  "assignedAgent": "Agent Name" | "{\"name\":\"Agent Name\",\"email\":\"agent@example.com\"}"
}
```

**Expected Response:**
```json
{
  "success": true,
  "session": {
    "id": "session-id-123",
    "status": "agent_active",
    "assignedAgent": "Agent Name"
  }
}
```

---

### 9. End Chat Session
**Endpoint:** `POST /api/chat/sessions/{sessionId}/end`

**Request Body:** (empty)

**Expected Response:**
```json
{
  "success": true,
  "session": {
    "id": "session-id-123",
    "status": "ended"
  }
}
```

---

## Authentication Requirements

### Public Endpoints (No Auth Required):
- `GET /api/chat/sessions/{sessionId}` - Get session status
- `POST /api/chat/sessions` - Create session (for users)

### Admin Endpoints (Auth Required):
- `GET /api/chat/sessions` - Get all sessions
- `POST /api/chat/sessions/{sessionId}/agent-message` - Send agent message
- `PATCH /api/chat/sessions/{sessionId}` - Update session
- `POST /api/chat/sessions/{sessionId}/end` - End session

**Authentication Method:**
- Uses Flask sessions with `credentials: 'include'`
- Cookies are sent automatically with requests
- On 401/403, frontend redirects to `/auth/signin`

---

## Error Response Format

All endpoints should return errors in this format:

```json
{
  "success": false,
  "error": "Error message here",
  "message": "Error message here" // Alternative field name
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized (redirects to signin)
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Frontend Compatibility Features

The frontend is designed to handle:
1. **Multiple response formats** - Supports `id`, `_id`, `sessionId` fields
2. **Flexible field names** - Handles `email`/`userEmail`, `name`/`userName`, etc.
3. **Offline mode** - Falls back to local AI if backend is unavailable
4. **Error handling** - Graceful error messages and retry functionality
5. **Polling** - Polls every 2 seconds for new messages when in agent mode

---

## Testing Checklist

To verify your backend is compatible:

- [ ] `POST /api/chat/sessions` creates a session and returns session ID
- [ ] `POST /api/chat/sessions/{id}/messages` sends messages and returns AI response
- [ ] `GET /api/chat/sessions/{id}` returns session status
- [ ] `POST /api/chat/sessions/{id}/request-agent` changes status to `waiting_agent`
- [ ] `GET /api/chat/sessions` (admin) returns list of all sessions
- [ ] `GET /api/chat/sessions/{id}/messages` returns message history
- [ ] `POST /api/chat/sessions/{id}/agent-message` (admin) sends agent message
- [ ] `PATCH /api/chat/sessions/{id}` (admin) updates session status
- [ ] `POST /api/chat/sessions/{id}/end` (admin) ends session
- [ ] All endpoints handle errors properly
- [ ] Authentication works for admin endpoints

---

## Notes

1. The frontend will work in **offline mode** if the backend is unavailable
2. All endpoints should return JSON responses
3. CORS must be enabled for `credentials: 'include'` to work
4. Session IDs should be unique and persistent
5. Messages should be stored with timestamps for proper ordering


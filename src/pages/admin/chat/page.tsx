import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../lib/api';
import { toast } from '../../../components/Toast';

interface ChatSession {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'waiting_agent' | 'agent_assigned' | 'agent_active' | 'ended';
  assignedAgent?: string | { name: string; email: string };
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant' | 'agent';
  timestamp: string;
}

const AGENT_NAMES = [
  'Ethan Parker',
  'Michael Cooper',
  'Brenda Allen',
  'Karen Brooks',
  'Christine Hall'
];

const AdminChatPage = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'waiting_agent' | 'agent_assigned' | 'ended'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [showAgentNameModal, setShowAgentNameModal] = useState(false);
  const [selectedAgentName, setSelectedAgentName] = useState<string>('');
  const [pendingAction, setPendingAction] = useState<'join' | 'send' | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth/signin');
      } else {
        // Check if user has admin access (support, manager, or super admin)
        const userRole = user.role?.toLowerCase() || '';
        const hasAdminAccess = userRole === 'admin' || 
                              userRole === 'super admin' || 
                              userRole === 'superadmin' ||
                              userRole === 'manager' ||
                              userRole === 'support';
        
        if (!hasAdminAccess) {
          navigate('/dashboard');
        }
      }
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Get API URL for diagnostics
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    setApiUrl(apiBaseUrl);
    
    // Check if user has admin access (support, manager, or super admin)
    if (user) {
      const userRole = user.role?.toLowerCase() || '';
      const hasAdminAccess = userRole === 'admin' || 
                            userRole === 'super admin' || 
                            userRole === 'superadmin' ||
                            userRole === 'manager' ||
                            userRole === 'support';
      
      if (hasAdminAccess) {
        const runConnectionTest = async () => {
          await testConnection();
          fetchSessions();
        };
        runConnectionTest();
      }
    }
  }, [user, filter]);

  const testConnection = async () => {
    try {
      setConnectionStatus('checking');
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const baseUrl = apiBaseUrl.replace('/api', '') || 'http://localhost:5000';
      
      // First test if backend root is accessible
      try {
        const rootResponse = await fetch(baseUrl, {
          method: 'GET',
          credentials: 'include'
        });
        if (rootResponse.ok) {
          setConnectionStatus('connected');
          // Backend is up, but endpoint might not exist yet
          return;
        }
      } catch (rootError) {
        // If root fails, try API endpoint
      }
      
      // Try to fetch chat sessions endpoint
      const response = await fetch(`${apiBaseUrl}/chat/sessions`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // If we get 404, backend is up but endpoint doesn't exist
      if (response.status === 404) {
        setConnectionStatus('connected');
      } else if (response.ok || response.status === 401 || response.status === 403) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error: any) {
      // Network error - backend is not reachable
      if (error.message?.includes('fetch') || error.message?.includes('Network') || error.message?.includes('Failed to fetch')) {
        setConnectionStatus('disconnected');
      } else {
        // Other errors might mean backend is up but endpoint doesn't exist
        setConnectionStatus('connected');
      }
    }
  };

  // Poll for new messages when viewing a session
  useEffect(() => {
    if (selectedSession && selectedSession.status !== 'ended') {
      const interval = setInterval(() => {
        fetchMessages(selectedSession.id);
      }, 2000);
      setPollingInterval(interval);
      
      return () => {
        clearInterval(interval);
        setPollingInterval(null);
      }
    } else {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    }
  }, [selectedSession?.id, selectedSession?.status]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch chat sessions
      const response = await api.getChatSessions({ status: filter !== 'all' ? filter : undefined }) as any;
      
      // Handle different response formats
      let sessionsData: any[] = [];
      
      if (response && Array.isArray(response)) {
        // Response is directly an array
        sessionsData = response;
      } else if (response && response.sessions && Array.isArray(response.sessions)) {
        // Response has sessions array
        sessionsData = response.sessions;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Response has data array
        sessionsData = response.data;
      } else if (response && response.success && response.sessions) {
        // Response with success flag
        sessionsData = response.sessions;
      } else if (response && response.error) {
        throw new Error(response.error || response.message || 'Failed to fetch chat sessions');
      }
      
      // Map backend response to our format
      const mappedSessions = sessionsData.map((session: any) => ({
        id: session.id || session._id || session.sessionId || session.session_id,
        email: session.email || session.userEmail || session.user_email || session.user?.email || 'Unknown',
        name: session.name || session.userName || session.user_name || session.user?.name || 'Guest',
        status: session.status || session.chatStatus || session.chat_status || 'active',
        assignedAgent: session.assignedAgent || session.assigned_agent || session.agent || session.assignedAgentName,
        createdAt: session.createdAt || session.created_at || session.dateCreated || session.created || session.createdAt || new Date().toISOString(),
        updatedAt: session.updatedAt || session.updated_at || session.dateUpdated || session.updated || session.updatedAt || new Date().toISOString(),
        messageCount: session.messageCount || session.message_count || session.messages?.length || 0,
        lastMessage: session.lastMessage || session.last_message || session.messages?.[session.messages.length - 1]?.text || '',
        lastMessageTime: session.lastMessageTime || session.last_message_time || session.messages?.[session.messages.length - 1]?.timestamp
      }));
      
      setSessions(mappedSessions);
      setConnectionStatus('connected');
      setError(null);
    } catch (error: any) {
      console.error('Error fetching chat sessions:', error);
      setConnectionStatus('disconnected');
      
      // More detailed error handling
      let errorMessage = 'Failed to load chat sessions. ';
      let detailedError = '';
      
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        errorMessage += 'Please check your authentication.';
        detailedError = 'The backend requires authentication. Please ensure you are logged in as an admin.';
      } else if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
        errorMessage += 'You do not have permission to access chat sessions.';
        detailedError = 'Your account does not have admin privileges to access chat management.';
      } else if (error.message?.includes('404') || error.message?.includes('Not Found')) {
        errorMessage += 'Chat endpoint not found.';
        detailedError = `The endpoint ${apiUrl}/chat/sessions does not exist on your backend yet.\n\n✅ Your backend is running at http://localhost:5000\n❌ The chat API endpoint is not implemented\n\nPlease implement the chat endpoints in your backend. See CHAT_API_COMPATIBILITY.md for specifications.`;
      } else if (error.message?.includes('Network') || error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        errorMessage += 'Please check your connection to the backend server.';
        const baseUrl = apiUrl.replace('/api', '') || 'http://localhost:5000';
        detailedError = `Cannot connect to backend at ${apiUrl}.\n\n✅ Backend root is accessible at ${baseUrl}\n❌ API endpoint ${apiUrl}/chat/sessions is not found\n\nPlease ensure:\n1. Backend server is running (✅ Confirmed)\n2. The /api/chat/sessions endpoint is implemented\n3. CORS is enabled on your backend\n\nSee CHAT_API_COMPATIBILITY.md for endpoint specifications.`;
      } else {
        errorMessage += error.message || 'Please check your connection.';
        detailedError = error.message || 'Unknown error occurred.';
      }
      
      setError(detailedError || errorMessage);
      toast.error(errorMessage);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      setLoadingMessages(true);
      setError(null);
      const response = await api.getChatMessages(sessionId) as any;
      
      // Handle different response formats
      if (response && (response.success || response.messages || Array.isArray(response))) {
        const messagesData = response.messages || response.data || response || [];
        
        const mappedMessages = (Array.isArray(messagesData) ? messagesData : []).map((msg: any) => ({
          id: msg.id || msg._id || msg.messageId,
          text: msg.text || msg.message || msg.content || msg.body || '',
          sender: msg.sender || msg.type || (msg.from === 'agent' ? 'agent' : msg.from === 'user' ? 'user' : 'assistant'),
          timestamp: msg.timestamp || msg.createdAt || msg.created_at || msg.dateCreated || msg.time || new Date().toISOString()
        }));
        setMessages(mappedMessages);
        setError(null);
      } else if (response && response.error) {
        throw new Error(response.error || response.message || 'Failed to fetch messages');
      } else {
        // Empty messages array
        setMessages([]);
        setError(null);
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      let errorMessage = 'Failed to load messages';
      
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        errorMessage += '. Please check your authentication.';
      } else if (error.message?.includes('404')) {
        errorMessage += '. Chat session not found.';
      } else if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        errorMessage += '. Please check your connection.';
      } else {
        errorMessage += ': ' + (error.message || 'Unknown error');
      }
      
      setError(errorMessage);
      // Don't show toast for background polling errors
      if (!pollingInterval) {
        toast.error(errorMessage);
      }
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectSession = async (session: ChatSession) => {
    // Check if agent name is selected before allowing any action
    const storedAgentName = localStorage.getItem('selected_agent_name');
    if (!storedAgentName || !AGENT_NAMES.includes(storedAgentName)) {
      // Show modal to select agent name first
      setPendingAction('join');
      setSelectedSession(session);
      setShowAgentNameModal(true);
      return;
    }
    
    setSelectedSession(session);
    setMessages([]); // Clear previous messages
    setError(null);
    await fetchMessages(session.id);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      const messagesContainer = document.getElementById('messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  };

  const handleJoinAsAgent = async (session: ChatSession) => {
    // Always check if agent name is selected (force selection)
    const storedAgentName = localStorage.getItem('selected_agent_name');
    if (!storedAgentName || !AGENT_NAMES.includes(storedAgentName)) {
      // Show modal to select agent name
      setPendingAction('join');
      setSelectedSession(session);
      setShowAgentNameModal(true);
      return;
    }
    
    // Agent name already selected, proceed with join
    await performJoinAsAgent(session, storedAgentName);
  };

  const performJoinAsAgent = async (session: ChatSession, agentName: string) => {
    try {
      setError(null);
      const agentInfo = {
        name: agentName,
        email: user?.email || 'admin@dmllogistics.com'
      };
      
      const response = await api.updateChatSession(session.id, {
        status: 'agent_active',
        assignedAgent: JSON.stringify(agentInfo)
      }) as any;
      
      if (response.success) {
        // Send "joined the chat" message
        await api.sendAgentMessage(session.id, `${agentName} joined the chat.`, agentName) as any;
        
        toast.success(`Joined chat as ${agentName}`);
        await fetchSessions();
        if (selectedSession?.id === session.id) {
          setSelectedSession({ 
            ...session, 
            status: 'agent_active', 
            assignedAgent: agentName 
          });
          await fetchMessages(session.id);
        }
      } else {
        throw new Error(response.error || response.message || 'Failed to join chat');
      }
    } catch (error: any) {
      console.error('Error joining chat:', error);
      const errorMessage = error.message || 'Failed to join chat. Please check your connection and try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleSendAgentMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedSession || isSending) return;

    // Check if agent name is selected
    const storedAgentName = localStorage.getItem('selected_agent_name');
    if (!storedAgentName || !AGENT_NAMES.includes(storedAgentName)) {
      // Show modal to select agent name first
      setPendingAction('send');
      setShowAgentNameModal(true);
      return;
    }

    // If session is not active, join first
    if (selectedSession.status !== 'agent_active' && selectedSession.status !== 'agent_assigned') {
      await performJoinAsAgent(selectedSession, storedAgentName);
    }

    setIsSending(true);
    setError(null);
    const messageText = messageInput.trim();
    
    try {
      const storedAgentName = localStorage.getItem('selected_agent_name') || '';
      const response = await api.sendAgentMessage(selectedSession.id, messageText, storedAgentName) as any;
      
      if (response.success) {
        setMessageInput('');
        // Add message optimistically to UI
        const newMessage: ChatMessage = {
          id: response.message?.id || Date.now().toString(),
          text: messageText,
          sender: 'agent',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMessage]);
        
        // Refresh messages from server to ensure consistency
        await fetchMessages(selectedSession.id);
        toast.success('Message sent');
        
        // Auto-scroll to bottom
        setTimeout(() => {
          const messagesContainer = document.getElementById('messages-container');
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }, 100);
      } else {
        throw new Error(response.error || response.message || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage = error.message || 'Failed to send message. Please check your connection and try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleEndChat = async (sessionId: string) => {
    if (!confirm('Are you sure you want to end this chat session?')) return;

    try {
      setError(null);
      const response = await api.endChatSession(sessionId) as any;
      if (response.success) {
        toast.success('Chat session ended');
        await fetchSessions();
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null);
          setMessages([]);
        }
      } else {
        throw new Error(response.error || response.message || 'Failed to end chat');
      }
    } catch (error: any) {
      console.error('Error ending chat:', error);
      const errorMessage = error.message || 'Failed to end chat. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDeleteConversation = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this entire conversation? This action cannot be undone.')) return;

    try {
      setError(null);
      console.log('Attempting to delete session:', sessionId);
      const response = await api.deleteChatSession(sessionId) as any;
      console.log('Delete response:', response);
      
      // Handle both success formats
      if (response.success || response.message === 'Conversation deleted successfully') {
        toast.success('Conversation deleted successfully');
        await fetchSessions();
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null);
          setMessages([]);
        }
      } else {
        throw new Error(response.error || response.message || 'Failed to delete conversation');
      }
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // More detailed error handling
      let errorMessage = 'Failed to delete conversation. ';
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        errorMessage = 'You do not have permission to delete conversations. Please ensure you are logged in as an admin.';
      } else if (error.message?.includes('404')) {
        errorMessage = 'Conversation not found. It may have already been deleted.';
      } else if (error.message?.includes('Network') || error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        errorMessage = `Network error: Unable to connect to the server at ${apiUrl}/chat/sessions/${sessionId}/delete. Please check:\n1. Backend is running\n2. CORS is enabled\n3. You are logged in as admin`;
      } else {
        errorMessage = error.message || 'Failed to delete conversation. Please try again.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesSearch = searchTerm === '' || 
        session.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (session.name && session.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [sessions, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agent_active':
      case 'agent_assigned':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'waiting_agent':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ended':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'agent_active':
      case 'agent_assigned':
        return 'ri-user-heart-line text-green-600';
      case 'waiting_agent':
        return 'ri-time-line text-yellow-600';
      case 'active':
        return 'ri-message-3-line text-blue-600';
      case 'ended':
        return 'ri-close-circle-line text-gray-600';
      default:
        return 'ri-message-line text-gray-600';
    }
  };

  if (loading && sessions.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4"></i>
            <p className="text-gray-600">Loading chat sessions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chat Management</h1>
            <p className="text-gray-600 mt-1">Manage customer chat sessions and interact as an agent</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'disconnected' ? 'bg-red-500' : 
                'bg-yellow-500 animate-pulse'
              }`} title={connectionStatus === 'connected' ? 'Backend Connected' : connectionStatus === 'disconnected' ? 'Backend Disconnected' : 'Checking...'}></div>
              <span className="text-sm text-gray-600">
                {connectionStatus === 'connected' ? 'Backend Connected' : 
                 connectionStatus === 'disconnected' ? 'Backend Disconnected' : 
                 'Checking Connection...'}
              </span>
            </div>
            <button
              onClick={() => {
                testConnection().then(() => fetchSessions());
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
            >
              <i className="ri-refresh-line"></i>
              <span>Test Connection</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Sessions List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 space-y-3">
              <div className="flex items-center space-x-2">
                <i className="ri-search-line text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'active', 'waiting_agent', 'agent_assigned', 'ended'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-2"></i>
                  <p className="text-gray-600">Loading sessions...</p>
                </div>
              ) : error && sessions.length === 0 ? (
                <div className="p-8 text-center">
                  <i className="ri-error-warning-line text-4xl text-red-500 mb-2"></i>
                  <p className="text-red-600 font-medium mb-1">Error loading sessions</p>
                  <p className="text-sm text-gray-600 mb-4 whitespace-pre-line text-left bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {error}
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-left">
                    <h4 className="font-semibold text-blue-900 mb-2">Troubleshooting Steps:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                      <li><strong>Backend is running</strong> ✅ - Confirmed at <code className="bg-blue-100 px-1 rounded">http://localhost:5000</code></li>
                      <li><strong>Endpoint missing</strong> ❌ - The endpoint <code className="bg-blue-100 px-1 rounded">{apiUrl}/chat/sessions</code> needs to be implemented</li>
                      <li>Check your backend routes - ensure <code className="bg-blue-100 px-1 rounded">/api/chat/sessions</code> is defined</li>
                      <li>Verify CORS is enabled for your frontend URL</li>
                      <li>Review <code className="bg-blue-100 px-1 rounded">CHAT_API_COMPATIBILITY.md</code> for endpoint specifications</li>
                      <li>Check browser console (F12) for detailed error messages</li>
                    </ol>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        testConnection().then(() => fetchSessions());
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <i className="ri-refresh-line mr-2"></i>
                      Retry Connection
                    </button>
                    <a
                      href="/admin/test-connection"
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm inline-block"
                    >
                      <i className="ri-settings-3-line mr-2"></i>
                      Connection Diagnostic
                    </a>
                  </div>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <i className="ri-message-line text-4xl mb-2"></i>
                  <p>No chat sessions found</p>
                  {searchTerm && (
                    <p className="text-sm mt-2">Try adjusting your search or filters</p>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleSelectSession(session)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        selectedSession?.id === session.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{session.name || 'Guest User'}</p>
                          <p className="text-sm text-gray-600 truncate">{session.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                          {session.status.replace('_', ' ')}
                        </span>
                      </div>
                      {session.lastMessage && (
                        <p className="text-sm text-gray-500 truncate mt-1">{session.lastMessage}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </span>
                        {session.messageCount && (
                          <span className="text-xs text-gray-400">
                            <i className="ri-message-line mr-1"></i>
                            {session.messageCount}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat View */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
            {selectedSession ? (
              <>
                {/* Chat Header */}
                <div className={`p-4 border-b border-gray-200 ${
                  selectedSession.status === 'agent_active' || selectedSession.status === 'agent_assigned'
                    ? 'bg-green-50'
                    : selectedSession.status === 'waiting_agent'
                    ? 'bg-yellow-50'
                    : 'bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedSession.status === 'agent_active' || selectedSession.status === 'agent_assigned'
                          ? 'bg-green-500'
                          : selectedSession.status === 'waiting_agent'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}>
                        <i className={`${getStatusIcon(selectedSession.status)} text-white`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedSession.name || 'Guest User'}</h3>
                        <p className="text-sm text-gray-600">{selectedSession.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedSession.status !== 'agent_active' && selectedSession.status !== 'ended' && (
                        <button
                          onClick={() => handleJoinAsAgent(selectedSession)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-2"
                        >
                          <i className="ri-user-add-line"></i>
                          <span>Join as Agent</span>
                        </button>
                      )}
                      {selectedSession.status === 'agent_active' && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium flex items-center space-x-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          <span>You are active</span>
                        </span>
                      )}
                      <div className="flex items-center space-x-2">
                        {selectedSession.status !== 'ended' && (
                          <button
                            onClick={() => handleEndChat(selectedSession.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-2"
                          >
                            <i className="ri-close-line"></i>
                            <span>End Chat</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteConversation(selectedSession.id)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center space-x-2"
                        >
                          <i className="ri-delete-bin-line"></i>
                          <span>Delete Conversation</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div
                  id="messages-container"
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
                >
                  {loadingMessages && messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <i className="ri-loader-4-line text-4xl mb-2 animate-spin text-blue-600"></i>
                      <p>Loading messages...</p>
                    </div>
                  ) : error && messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <i className="ri-error-warning-line text-4xl mb-2 text-red-500"></i>
                      <p className="text-red-600 font-medium mb-1">Error loading messages</p>
                      <p className="text-sm text-gray-600 mb-4">{error}</p>
                      <button
                        onClick={() => selectedSession && fetchMessages(selectedSession.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <i className="ri-refresh-line mr-2"></i>
                        Retry
                      </button>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <i className="ri-message-line text-4xl mb-2"></i>
                      <p>No messages yet</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2`}
                      >
                        {message.sender !== 'user' && (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.sender === 'agent'
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                          }`}>
                            {message.sender === 'agent' ? (
                              <i className="ri-user-heart-line text-white text-sm"></i>
                            ) : (
                              <i className="ri-robot-line text-white text-sm"></i>
                            )}
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : message.sender === 'agent'
                              ? 'bg-green-500 text-white border-2 border-green-400/30'
                              : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                        >
                          {message.sender === 'agent' && (
                            <div className="flex items-center space-x-2 mb-1 pb-1 border-b border-green-300/30">
                              <i className="ri-user-heart-line text-xs"></i>
                              <span className="text-xs font-semibold opacity-95">Agent</span>
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-line">{message.text}</p>
                          <span className={`text-xs mt-2 block ${
                            message.sender === 'user'
                              ? 'text-blue-100'
                              : message.sender === 'agent'
                              ? 'text-green-100'
                              : 'text-gray-500'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        {message.sender === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <i className="ri-user-line text-white text-sm"></i>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                {selectedSession.status !== 'ended' && (
                  <div className="p-4 border-t border-gray-200 bg-white">
                    {selectedSession.status === 'agent_active' || selectedSession.status === 'agent_assigned' ? (
                      <form onSubmit={handleSendAgentMessage} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type your message as agent..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            disabled={isSending}
                          />
                          <button
                            type="submit"
                            disabled={!messageInput.trim() || isSending}
                            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
                          >
                            {isSending ? (
                              <>
                                <i className="ri-loader-4-line animate-spin"></i>
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <i className="ri-send-plane-fill"></i>
                                <span>Send</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          You are responding as an agent. Messages will appear with agent badge.
                        </p>
                      </form>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          <i className="ri-information-line mr-2"></i>
                          Join as agent to send messages to this chat session.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <i className="ri-message-line text-6xl mb-4"></i>
                  <p className="text-lg font-medium">Select a chat session to view messages</p>
                  <p className="text-sm mt-2">Choose a session from the list on the left</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agent Name Selection Modal */}
      {showAgentNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Agent Name</h3>
            <p className="text-sm text-gray-600 mb-4">
              Before joining or replying to a chat, please select your agent name:
            </p>
            <div className="space-y-2 mb-4">
              {AGENT_NAMES.map((name) => (
                <button
                  key={name}
                  onClick={() => setSelectedAgentName(name)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    selectedAgentName === name
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAgentNameModal(false);
                  setSelectedAgentName('');
                  setPendingAction(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!selectedAgentName) {
                    toast.error('Please select an agent name');
                    return;
                  }
                  localStorage.setItem('selected_agent_name', selectedAgentName);
                  setShowAgentNameModal(false);
                  
                  if (pendingAction === 'join' && selectedSession) {
                    await performJoinAsAgent(selectedSession, selectedAgentName);
                  } else if (pendingAction === 'send' && selectedSession) {
                    // Retry sending message
                    const form = document.querySelector('form');
                    if (form) {
                      const event = new Event('submit', { bubbles: true, cancelable: true });
                      form.dispatchEvent(event);
                    }
                  }
                  
                  setSelectedAgentName('');
                  setPendingAction(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminChatPage;

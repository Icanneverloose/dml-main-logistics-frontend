import React, { useState, useRef, useEffect } from 'react'
import { api } from '../lib/api'
import { toast } from './Toast'

interface Message {
  id: string
  text: string
  sender: 'user' | 'assistant' | 'agent'
  timestamp: Date
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatStatus, setChatStatus] = useState<'ai' | 'agent' | 'waiting'>('ai')
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [assignedAgentName, setAssignedAgentName] = useState<string | null>(null)
  const [agentTyping, setAgentTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [lastReadMessageId, setLastReadMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens and check connection
  useEffect(() => {
    if (isOpen && inputRef.current && !showEmailForm) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
    
    // When chat opens, try to reconnect if we're in offline mode
    if (isOpen && sessionId && (isOfflineMode || sessionId.startsWith('offline-'))) {
      // Try to reconnect by creating a new session or checking existing one
      const checkConnection = async () => {
        try {
          // If we have an offline session, try to create a new real session
          if (sessionId.startsWith('offline-') && userEmail) {
            const response = await api.createChatSession(userEmail, userName || undefined) as any
            if (response.success && response.session) {
              const newSessionId = response.session.id || response.session._id || response.sessionId
              setSessionId(newSessionId)
              setIsOfflineMode(false)
              localStorage.setItem('chat_session_id', newSessionId)
              // Reload chat history
              loadChatHistory(newSessionId)
              return
            }
          } else if (!sessionId.startsWith('offline-')) {
            // Try to check existing session
            const response = await api.getChatSession(sessionId) as any
            if (response.success) {
              // Backend is connected, reset offline mode
              setIsOfflineMode(false)
              // Reload chat history to get latest messages
              loadChatHistory(sessionId)
            }
          }
        } catch (error) {
          // Still offline, keep offline mode
          console.log('Backend still unreachable, staying in offline mode')
        }
      }
      checkConnection()
    }
  }, [isOpen, showEmailForm, sessionId, isOfflineMode])

  // Load existing session from localStorage
  useEffect(() => {
    const savedSessionId = localStorage.getItem('chat_session_id')
    const savedEmail = localStorage.getItem('chat_user_email')
    const savedName = localStorage.getItem('chat_user_name')
    const savedLastRead = localStorage.getItem('chat_last_read_message_id')
    
    if (savedSessionId && savedEmail) {
      setSessionId(savedSessionId)
      setUserEmail(savedEmail)
      if (savedName) setUserName(savedName)
      if (savedLastRead) setLastReadMessageId(savedLastRead)
      setShowEmailForm(false)
      // Reset offline mode before loading - will be set correctly by loadChatHistory
      setIsOfflineMode(false)
      loadChatHistory(savedSessionId)
    }
  }, [])

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Poll for new agent messages when in agent mode or when chat is closed (for notifications)
  useEffect(() => {
    if (sessionId && (chatStatus === 'agent' || chatStatus === 'waiting')) {
      const interval = setInterval(() => {
        checkForNewMessages()
        // Check for agent typing status (if backend supports it)
        if (chatStatus === 'agent' && isOpen) {
          checkAgentTyping()
        }
      }, 3000) // Poll every 3 seconds (reduced frequency to avoid message conflicts)
      setPollingInterval(interval)
      
      return () => {
        if (interval) clearInterval(interval)
      }
    } else if (pollingInterval) {
      clearInterval(pollingInterval)
      setPollingInterval(null)
    }
  }, [chatStatus, sessionId, isOpen])

  // Update unread count when messages change and chat is closed
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastReadIndex = lastReadMessageId 
        ? messages.findIndex(m => m.id === lastReadMessageId)
        : -1
      const newUnread = messages.length - (lastReadIndex + 1)
      setUnreadCount(Math.max(0, newUnread))
    } else if (isOpen) {
      // Mark all as read when chat is open
      if (messages.length > 0) {
        const lastMessageId = messages[messages.length - 1].id
        setLastReadMessageId(lastMessageId)
        localStorage.setItem('chat_last_read_message_id', lastMessageId)
        setUnreadCount(0)
      }
    }
  }, [messages, isOpen, lastReadMessageId])

  const loadChatHistory = async (sessionIdToLoad: string) => {
    try {
      const response = await api.getChatMessages(sessionIdToLoad) as any
      if (response.success && response.messages) {
        const loadedMessages = response.messages.map((msg: any) => ({
          id: msg.id || msg._id,
          text: msg.text || msg.message,
          sender: msg.sender === 'agent' ? 'agent' : msg.sender === 'user' ? 'user' : 'assistant',
          timestamp: new Date(msg.timestamp || msg.createdAt)
        }))
        setMessages(loadedMessages)
        
        // Check session status
        const sessionResponse = await api.getChatSession(sessionIdToLoad) as any
        if (sessionResponse.success && sessionResponse.session) {
          const status = sessionResponse.session.status
          if (status === 'agent_assigned' || status === 'agent_active') {
            setChatStatus('agent')
            if (sessionResponse.session.assignedAgent) {
              setAssignedAgentName(sessionResponse.session.assignedAgent.name || sessionResponse.session.assignedAgent)
            }
          } else if (status === 'waiting_agent') {
            setChatStatus('waiting')
          } else if (status === 'ended') {
            // Chat ended, reset to AI mode
            setChatStatus('ai')
            setAssignedAgentName(null)
          } else {
            // Active with no agent
            setChatStatus('ai')
            setAssignedAgentName(null)
          }
        }
        // Successfully loaded, ensure we're not in offline mode
        setIsOfflineMode(false)
      } else {
        // No messages yet, but session exists - not offline
        setIsOfflineMode(false)
      }
    } catch (error: any) {
      console.log('Could not load chat history:', error)
      
      // Check if session doesn't exist (404)
      const isSessionNotFound = error.message?.includes('404') || 
                               error.message?.includes('Not Found') ||
                               error.message?.includes('Session not found') ||
                               error.message?.includes('status 404')
      
      if (isSessionNotFound) {
        // Session doesn't exist - clear invalid session and show email form
        console.log('Session not found, clearing invalid session and resetting')
        localStorage.removeItem('chat_session_id')
        localStorage.removeItem('chat_last_read_message_id')
        setSessionId(null)
        setShowEmailForm(true)
        setMessages([])
        setChatStatus('ai')
        setAssignedAgentName(null)
        setIsOfflineMode(false)
        toast.info('Previous chat session expired. Please start a new chat.')
        return
      }
      
      // Only set offline mode if it's a genuine network/connection error
      const isNetworkError = error.message?.includes('Network') || 
                            error.message?.includes('fetch') || 
                            error.message?.includes('Failed to fetch') ||
                            error.message?.includes('ERR_NETWORK') ||
                            error.message?.includes('ERR_CONNECTION_REFUSED')
      
      if (isNetworkError) {
        setIsOfflineMode(true)
      } else {
        // Not a network error, backend is reachable
        setIsOfflineMode(false)
      }
    }
  }

  const checkForNewMessages = async () => {
    if (!sessionId) return
    try {
      // Check session status first
      const sessionResponse = await api.getChatSession(sessionId) as any
      if (!sessionResponse.success || !sessionResponse.session) {
        // Session not found - clear it and reset
        console.log('Session not found in checkForNewMessages, clearing invalid session')
        localStorage.removeItem('chat_session_id')
        localStorage.removeItem('chat_last_read_message_id')
        setSessionId(null)
        setShowEmailForm(true)
        setMessages([])
        setChatStatus('ai')
        setAssignedAgentName(null)
        return
      }
      
      if (sessionResponse.success && sessionResponse.session) {
        const status = sessionResponse.session.status
        
        // If chat is ended, auto-clear messages
        if (status === 'ended') {
          setMessages([])
          setChatStatus('ai')
          setAssignedAgentName(null)
          setIsOfflineMode(false) // Backend is connected
          return
        }
        
        // Update status - preserve agent status if we're already in agent mode
        if (status === 'agent_assigned' || status === 'agent_active') {
          setChatStatus('agent')
          if (sessionResponse.session.assignedAgent) {
            setAssignedAgentName(sessionResponse.session.assignedAgent.name || sessionResponse.session.assignedAgent)
          }
        } else if (status === 'waiting_agent') {
          setChatStatus('waiting')
        } else if (status === 'active') {
          // Only change to AI if we're NOT currently in agent/waiting mode
          // This prevents resetting agent status if backend returns 'active' while agent is still connected
          if (chatStatus !== 'agent' && chatStatus !== 'waiting') {
            setChatStatus('ai')
            setAssignedAgentName(null)
          }
          // If we're already in agent/waiting mode, preserve it (don't reset)
        } else if (status === 'ended') {
          // Chat ended - this is already handled above, but just in case
          setChatStatus('ai')
          setAssignedAgentName(null)
        } else {
          // Unknown status - only reset if we're not in agent mode
          if (chatStatus !== 'agent' && chatStatus !== 'waiting') {
            setChatStatus('ai')
            setAssignedAgentName(null)
          }
        }
        // Successfully connected to backend
        setIsOfflineMode(false)
      }
      
      const response = await api.getChatMessages(sessionId) as any
      if (response.success && response.messages) {
        const newMessages = response.messages.map((msg: any) => ({
          id: msg.id || msg._id,
          text: msg.text || msg.message,
          sender: msg.sender === 'agent' ? 'agent' : msg.sender === 'user' ? 'user' : 'assistant',
          timestamp: new Date(msg.timestamp || msg.createdAt)
        }))
        
        // Check if we have new messages - only update if we have more messages or if messages were deleted
        const previousLength = messages.length
        if (newMessages.length > previousLength) {
          // We have new messages, update the list
          setMessages(newMessages)
          
          // Show notification for new agent messages if chat is closed
          if (!isOpen) {
            const newAgentMessages = newMessages.slice(previousLength).filter(m => m.sender === 'agent')
            if (newAgentMessages.length > 0) {
              showNotification(newAgentMessages[0].text, newAgentMessages.length)
            }
          }
        } else if (newMessages.length < previousLength) {
          // Messages were deleted (conversation deleted), update the list
          setMessages(newMessages)
        } else {
          // Count is same - intelligently merge to preserve user messages that were just sent
          // Check if there are new messages from server that we don't have locally
          const localMessageIds = new Set(messages.map(m => m.id))
          const serverMessageIds = new Set(newMessages.map(m => m.id))
          
          // Find messages in server that are not in local (new messages)
          const newServerMessages = newMessages.filter(m => !localMessageIds.has(m.id))
          
          // If we have new messages from server (likely agent messages), merge them
          if (newServerMessages.length > 0) {
            // Merge: keep local messages and add new server messages
            const mergedMessages = [...messages]
            newServerMessages.forEach(newMsg => {
              // Only add if it's not already in the list
              if (!mergedMessages.find(m => m.id === newMsg.id)) {
                mergedMessages.push(newMsg)
              }
            })
            // Sort by timestamp to maintain order
            mergedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
            setMessages(mergedMessages)
          }
          // If no new messages, don't update to preserve user's message that was just sent
        }
        // Successfully fetched messages, ensure not offline
        setIsOfflineMode(false)
      }
    } catch (error: any) {
      console.error('Error checking for new messages:', error)
      
      // Check if session doesn't exist (404)
      const isSessionNotFound = error.message?.includes('404') || 
                               error.message?.includes('Not Found') ||
                               error.message?.includes('Session not found') ||
                               error.message?.includes('status 404')
      
      if (isSessionNotFound) {
        // Session not found - clear it and reset
        console.log('Session not found in checkForNewMessages, clearing invalid session')
        localStorage.removeItem('chat_session_id')
        localStorage.removeItem('chat_last_read_message_id')
        setSessionId(null)
        setShowEmailForm(true)
        setMessages([])
        setChatStatus('ai')
        setAssignedAgentName(null)
        return
      }
      
      // Only set offline mode if it's a genuine network/connection error
      // Don't set offline on temporary errors or auth errors
      const isNetworkError = error.message?.includes('Network') || 
                            error.message?.includes('fetch') || 
                            error.message?.includes('Failed to fetch') ||
                            error.message?.includes('ERR_NETWORK') ||
                            error.message?.includes('ERR_CONNECTION_REFUSED')
      
      // Don't set offline mode on polling errors - might be temporary network issues
      // Only set offline if it's a persistent connection failure and we're not already offline
      if (isNetworkError && !isOfflineMode) {
        // Only set offline after multiple consecutive failures
        // For now, don't auto-set offline on polling errors
      }
    }
  }

  const checkAgentTyping = async () => {
    // This would check if agent is typing (if backend supports it)
    // For now, we'll simulate it based on recent activity
    // In a real implementation, the backend would send typing status
    try {
      const response = await api.getChatSession(sessionId!) as any
      if (response.success && response.session?.agentTyping) {
        setAgentTyping(response.session.agentTyping)
      }
    } catch (error) {
      // Silent fail - not critical
    }
  }

  const showNotification = (message: string, count: number) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = count > 1 
        ? `DML Logistics - ${count} new messages`
        : 'DML Logistics - New message'
      const notification = new Notification(title, {
        body: message.length > 100 ? message.substring(0, 100) + '...' : message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'dml-chat',
        requireInteraction: false
      })

      notification.onclick = () => {
        window.focus()
        setIsOpen(true)
        notification.close()
      }

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userEmail.trim()) {
      toast.error('Please enter your email address')
      return
    }
    if (!userName.trim()) {
      toast.error('Please enter your name')
      return
    }

    try {
      const response = await api.createChatSession(userEmail.trim(), userName.trim() || undefined) as any
      if (response.success && response.session) {
        const newSessionId = response.session.id || response.session._id || response.sessionId
        setSessionId(newSessionId)
        setShowEmailForm(false)
        setIsOfflineMode(false) // Successfully connected
        localStorage.setItem('chat_session_id', newSessionId)
        localStorage.setItem('chat_user_email', userEmail.trim())
        if (userName.trim()) {
          localStorage.setItem('chat_user_name', userName.trim())
        }
        
        // Add welcome message
        const welcomeMessage: Message = {
          id: '1',
          text: `Hello ${userName}! I'm your DML Logistics assistant. How can I help you today? I can assist with tracking packages, shipping information, account questions, and more!`,
          sender: 'assistant',
          timestamp: new Date()
        }
        setMessages([welcomeMessage])
        
        toast.success('Chat session started!')
        setTimeout(() => inputRef.current?.focus(), 100)
      } else {
        throw new Error(response.error || 'Failed to start chat session')
      }
    } catch (error: any) {
      console.error('Error creating chat session:', error)
      // Only set offline mode if it's a network/connection error, not authentication errors
      const isNetworkError = error.message?.includes('Network') || error.message?.includes('fetch') || error.message?.includes('Failed to fetch')
      if (isNetworkError) {
        // Fallback: continue without backend if it fails
        setShowEmailForm(false)
        setIsOfflineMode(true)
        setSessionId('offline-' + Date.now()) // Create offline session ID
        localStorage.setItem('chat_user_email', userEmail.trim())
        if (userName.trim()) {
          localStorage.setItem('chat_user_name', userName.trim())
        }
        
        const welcomeMessage: Message = {
          id: '1',
          text: `Hello ${userName}! I'm your DML Logistics assistant. How can I help you today? I can assist with tracking packages, shipping information, account questions, and more!\n\nNote: You're currently in offline mode. Some features like live agent support are unavailable.`,
          sender: 'assistant',
          timestamp: new Date()
        }
        setMessages([welcomeMessage])
        toast.warning('Starting chat in offline mode. Some features may be limited.')
      } else {
        // Other errors (auth, validation, etc.) - show error but don't go offline
        toast.error(error.message || 'Failed to start chat session. Please try again.')
      }
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isTyping || !sessionId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const messageText = inputValue.trim()
    setInputValue('')
    setIsTyping(true)

    // Check for live agent keywords - auto-trigger
    const lowerInput = messageText.toLowerCase()
    const liveAgentKeywords = ['live agent', 'live support', 'live person', 'human agent', 'speak to someone', 'talk to agent', 'real person', 'customer service', 'support agent']
    if (liveAgentKeywords.some(keyword => lowerInput.includes(keyword)) && chatStatus === 'ai' && !isOfflineMode && !sessionId.startsWith('offline-')) {
      // Auto-trigger live agent request
      setTimeout(() => {
        handleRequestLiveAgent()
      }, 500)
      setIsTyping(false)
      return
    }

    // If offline mode, use local AI immediately (but only if no agent is active)
    if ((isOfflineMode || sessionId.startsWith('offline-')) && chatStatus !== 'agent' && chatStatus !== 'waiting') {
      setTimeout(() => {
        const response = generateResponse(messageText)
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'assistant',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
        setIsTyping(false)
      }, 800)
      return
    }
    // NOTE: When agent is active, we still send the message to backend
    // The backend will save it but won't generate AI response

    try {
      // Send message to backend
      const response = await api.sendChatMessage(sessionId, messageText) as any
      
      if (response.success) {
        // Successfully sent message, ensure not offline
        setIsOfflineMode(false)
        
        // CRITICAL: Preserve agent status unless explicitly changed
        // Only update status if we get a clear status change from backend
        const newStatus = response.session?.status
        
        if (newStatus === 'agent_assigned' || newStatus === 'agent_active') {
          // Agent is active - set to agent mode
          setChatStatus('agent')
          if (response.session.assignedAgent) {
            setAssignedAgentName(response.session.assignedAgent.name || response.session.assignedAgent)
          }
        } else if (newStatus === 'waiting_agent') {
          // Waiting for agent
          setChatStatus('waiting')
        } else if (newStatus === 'ended') {
          // Chat ended, reset to AI mode
          setChatStatus('ai')
          setAssignedAgentName(null)
        } else if (newStatus === 'active') {
          // Status is 'active' - only change to AI if we're NOT currently in agent/waiting mode
          // This prevents resetting agent status if backend returns 'active' while agent is still connected
          if (chatStatus !== 'agent' && chatStatus !== 'waiting') {
            setChatStatus('ai')
            setAssignedAgentName(null)
          }
          // If we're already in agent/waiting mode, preserve it (don't reset)
        }

        // CRITICAL: Only add AI response if NO agent is active
        // The backend already prevents AI responses when agent is active, but we double-check here
        const currentStatus = response.session?.status || chatStatus
        const shouldShowAI = response.response && 
            currentStatus !== 'agent_active' && 
            currentStatus !== 'agent_assigned' && 
            currentStatus !== 'waiting_agent'
        
        // Only show AI response if agent is NOT active
        if (shouldShowAI && chatStatus !== 'agent' && chatStatus !== 'waiting') {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: response.response,
            sender: 'assistant',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, assistantMessage])
        }
        
        // In agent mode, after sending message, refresh from server after delay to ensure user message is preserved
        if (currentStatus === 'agent_active' || currentStatus === 'agent_assigned') {
          setTimeout(async () => {
            try {
              const msgResponse = await api.getChatMessages(sessionId) as any
              if (msgResponse.success && msgResponse.messages) {
                const refreshedMessages = msgResponse.messages.map((msg: any) => ({
                  id: msg.id || msg._id,
                  text: msg.text || msg.message,
                  sender: msg.sender === 'agent' ? 'agent' : msg.sender === 'user' ? 'user' : 'assistant',
                  timestamp: new Date(msg.timestamp || msg.createdAt)
                }))
                // Merge intelligently to preserve user message that was just sent
                const currentMessageIds = new Set(messages.map(m => m.id))
                const refreshedMessageIds = new Set(refreshedMessages.map(m => m.id))
                
                // Find messages that are in refreshed but not in current (new agent messages)
                const newAgentMessages = refreshedMessages.filter(m => !currentMessageIds.has(m.id))
                
                if (newAgentMessages.length > 0) {
                  // Add new agent messages to current messages
                  const mergedMessages = [...messages, ...newAgentMessages]
                  mergedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
                  setMessages(mergedMessages)
                } else {
                  // No new messages, but ensure server messages are synced (in case of deletions)
                  const allServerIds = new Set(refreshedMessages.map(m => m.id))
                  const hasDeletedMessages = messages.some(m => !allServerIds.has(m.id))
                  
                  if (hasDeletedMessages || refreshedMessages.length !== messages.length) {
                    // Messages were deleted or count changed, sync with server
                    setMessages(refreshedMessages)
                  }
                }
              }
            } catch (err) {
              // Silent fail - don't interrupt user experience
            }
          }, 1500)
        }
      } else {
        throw new Error(response.error || 'Failed to send message')
      }
    } catch (error: any) {
      console.error('Error sending message:', error)
      
      // Check if session doesn't exist (404)
      const isSessionNotFound = error.message?.includes('404') || 
                               error.message?.includes('Not Found') ||
                               error.message?.includes('Session not found') ||
                               error.message?.includes('status 404')
      
      if (isSessionNotFound) {
        // Session not found - clear it and reset
        console.log('Session not found when sending message, clearing invalid session')
        localStorage.removeItem('chat_session_id')
        localStorage.removeItem('chat_last_read_message_id')
        setSessionId(null)
        setShowEmailForm(true)
        setMessages([])
        setChatStatus('ai')
        setAssignedAgentName(null)
        toast.info('Chat session expired. Please start a new chat.')
        setIsTyping(false)
        return
      }
      
      // Only fallback to local AI if no agent is active
      if (chatStatus !== 'agent' && chatStatus !== 'waiting') {
        const isNetworkError = error.message?.includes('Network') || 
                              error.message?.includes('fetch') || 
                              error.message?.includes('Failed to fetch') ||
                              error.message?.includes('ERR_NETWORK') ||
                              error.message?.includes('ERR_CONNECTION_REFUSED')
        
        if (isNetworkError) {
          setIsOfflineMode(true)
          const response = generateResponse(messageText)
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: response,
            sender: 'assistant',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, assistantMessage])
          toast.warning('Switched to offline mode. Some features may be limited.')
        } else {
          toast.error('Failed to send message. Please try again.')
        }
      } else {
        // If agent is active, just show error without AI fallback
        toast.error('Failed to send message. Please try again.')
      }
    } finally {
      setIsTyping(false)
    }
  }

  const handleRequestLiveAgent = async () => {
    if (!sessionId || isOfflineMode || sessionId.startsWith('offline-')) {
      toast.error('Live agent is not available in offline mode. Please check your connection and try again.')
      return
    }

    try {
      setIsTyping(true)
      console.log('Requesting live agent for session:', sessionId)
      const response = await api.requestLiveAgent(sessionId) as any
      console.log('Request live agent response:', response)
      
      if (response.success) {
        setChatStatus('waiting')
        // Reload chat history to get the system message from backend
        await loadChatHistory(sessionId)
        toast.success('Live agent requested. You will be connected shortly.')
      } else {
        console.error('Request live agent failed:', response.error)
        throw new Error(response.error || 'Failed to request live agent')
      }
    } catch (error: any) {
      console.error('Error requesting live agent:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        sessionId: sessionId
      })
      
      // Check if session doesn't exist (404)
      const isSessionNotFound = error.message?.includes('404') || 
                               error.message?.includes('Not Found') ||
                               error.message?.includes('Session not found') ||
                               error.message?.includes('status 404')
      
      if (isSessionNotFound) {
        // Session not found - clear it and reset
        console.log('Session not found when requesting live agent, clearing invalid session')
        localStorage.removeItem('chat_session_id')
        localStorage.removeItem('chat_last_read_message_id')
        setSessionId(null)
        setShowEmailForm(true)
        setMessages([])
        setChatStatus('ai')
        setAssignedAgentName(null)
        toast.info('Chat session expired. Please start a new chat to request a live agent.')
        setIsTyping(false)
        return
      }
      
      // Provide more specific error messages
      if (error.message?.includes('Network') || error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        toast.error('Cannot connect to server. Please check your connection and try again.')
      } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        toast.error('Unauthorized. Please refresh the page and try again.')
      } else {
        toast.error(error.message || 'Failed to request live agent. Please try again or contact support via email/phone.')
      }
    } finally {
      setIsTyping(false)
    }
  }

  const generateResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()

    // Check for live agent keywords - auto-trigger
    const liveAgentKeywords = ['live agent', 'live support', 'live person', 'human agent', 'speak to someone', 'talk to agent', 'real person', 'customer service', 'support agent']
    if (liveAgentKeywords.some(keyword => lowerInput.includes(keyword))) {
      // Auto-trigger live agent request
      if (sessionId && !isOfflineMode && !sessionId.startsWith('offline-')) {
        setTimeout(() => {
          handleRequestLiveAgent()
        }, 100)
        return "Connecting you to a customer service representative..."
      } else {
        return "I understand you'd like to speak with a live agent. However, live agent support is currently unavailable in offline mode. Please check your connection and try again, or contact us via email at support@dmllogistics.com"
      }
    }

    // Track package queries
    if (lowerInput.includes('track') || lowerInput.includes('tracking') || lowerInput.includes('package')) {
      return "To track your package, you can:\n\n1. Visit the Track page: https://dmllogistics.com/track\n2. Enter your tracking number (format: DML followed by 8 digits)\n3. View real-time updates on your shipment status\n\nYou can also track packages from your dashboard if you're logged in: https://dmllogistics.com/dashboard/shipment-history\n\nWould you like help with anything else?"
    }

    // Shipping information
    if (lowerInput.includes('shipping') || lowerInput.includes('delivery') || lowerInput.includes('ship')) {
      return "DML Logistics offers various shipping options:\n\nExpress Delivery: 1-2 business days\nStandard Shipping: 3-5 business days\nInternational: 7-14 business days\n\nWe serve 50+ countries worldwide with 99.9% on-time delivery. Learn more about our services: https://dmllogistics.com/services\n\nNeed more specific information?"
    }

    // Account/Login queries
    if (lowerInput.includes('login') || lowerInput.includes('sign in') || lowerInput.includes('account')) {
      return "You can sign in or create an account:\n\n1. Visit the Sign In page: https://dmllogistics.com/auth/signin\n2. Click 'Sign In' in the header\n3. New users can click 'Sign Up' to create an account: https://dmllogistics.com/auth/signup\n\nOnce logged in, you'll have access to your dashboard, shipment history, and more. Need help with registration?"
    }

    // Pricing queries
    if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('rate') || lowerInput.includes('fee')) {
      return "Our pricing is competitive and transparent with no hidden fees. Shipping costs depend on:\n\n• Package weight and dimensions\n• Destination\n• Service type (Express, Standard, etc.)\n• Insurance options\n\nFor a custom quote, please contact our sales team through the Contact page: https://dmllogistics.com/contact or use the Get Quote feature. Would you like to register a package?"
    }

    // Service information
    if (lowerInput.includes('service') || lowerInput.includes('what do you offer') || lowerInput.includes('services')) {
      return "DML Logistics provides comprehensive logistics solutions:\n\nExpress Shipping & Home Delivery\nFreight Services (Air, Sea, Land)\nWarehousing Solutions\nSupply Chain Management\nInternational Shipping\n\nVisit our Services page to learn more: https://dmllogistics.com/services\n\nWhich service interests you most?"
    }

    // Contact/Support queries
    if (lowerInput.includes('contact') || lowerInput.includes('support') || lowerInput.includes('help') || lowerInput.includes('phone')) {
      return "You can reach us through:\n\n1. Contact page: https://dmllogistics.com/contact\n2. Customer Support: Available 24/7\n3. Dashboard Help: If logged in, check 'Help & Support' in your dashboard: https://dmllogistics.com/dashboard\n\nWe're here to help with any questions or concerns. What would you like assistance with?"
    }

    // Location queries
    if (lowerInput.includes('where') || lowerInput.includes('location') || lowerInput.includes('address')) {
      return "DML Logistics operates globally with:\n\nMain Office: 1234 Logistics Boulevard, Suite 500, New York, NY 10001\nService Coverage: 50+ countries worldwide\nDistribution Centers: Multiple locations across major regions\n\nWe have a vast network to serve you efficiently. Visit our contact page for more information: https://dmllogistics.com/contact"
    }

    // Website/URL queries
    if (lowerInput.includes('website') || lowerInput.includes('site') || lowerInput.includes('url') || lowerInput.includes('homepage')) {
      return "Our main website is: https://dmllogistics.com\n\nKey pages:\n• Home: https://dmllogistics.com\n• Services: https://dmllogistics.com/services\n• Track Package: https://dmllogistics.com/track\n• Contact: https://dmllogistics.com/contact\n• Sign In: https://dmllogistics.com/auth/signin\n\nIs there a specific page you're looking for?"
    }

    // Greetings
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return "Hello! Welcome to DML Logistics. I'm here to help you with:\n\n• Package tracking\n• Shipping information\n• Account questions\n• Service inquiries\n• General support\n\nWhat can I assist you with today?"
    }

    // Default response
    return "Thank you for your message! I'm here to help with logistics and shipping questions. You can ask me about:\n\n• Tracking packages - Visit https://dmllogistics.com/track\n• Shipping rates and services - Visit https://dmllogistics.com/services\n• Creating an account - Visit https://dmllogistics.com/auth/signup\n• Delivery times\n• Our services\n\nCould you provide more details about what you need help with?"
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer ${
          isOpen
            ? 'bg-gray-700 hover:bg-gray-800'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
        }`}
        aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
      >
        {isOpen ? (
          <i className="ri-close-line text-white text-2xl"></i>
        ) : (
          <i className="ri-customer-service-2-line text-white text-2xl"></i>
        )}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white flex items-center justify-center px-1.5 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {!isOpen && unreadCount === 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-md h-[600px] max-h-[calc(100vh-7rem)] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 animate-fade-in">
          {/* Header */}
          <div className={`p-4 rounded-t-2xl flex items-center justify-between ${
            chatStatus === 'agent' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
              : chatStatus === 'waiting'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
              : isOfflineMode
              ? 'bg-gradient-to-r from-gray-600 to-gray-700'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600'
          } text-white`}>
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0 ${
                chatStatus === 'agent' 
                  ? 'bg-white/20' 
                  : chatStatus === 'waiting'
                  ? 'bg-white/20 animate-pulse'
                  : isOfflineMode
                  ? 'bg-white/20'
                  : 'bg-white/20'
              }`}>
                {chatStatus === 'agent' ? (
                  <i className="ri-user-heart-line text-xl"></i>
                ) : chatStatus === 'waiting' ? (
                  <i className="ri-time-line text-xl animate-pulse"></i>
                ) : isOfflineMode ? (
                  <i className="ri-wifi-off-line text-xl"></i>
                ) : (
                  <i className="ri-customer-service-2-line text-xl"></i>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold truncate">
                    {chatStatus === 'agent' 
                      ? assignedAgentName ? `Agent ${assignedAgentName}` : 'Live Agent'
                      : chatStatus === 'waiting'
                      ? 'Waiting for Agent'
                      : isOfflineMode
                      ? 'Offline Mode'
                      : 'DML Assistant'}
                  </h3>
                  {chatStatus === 'agent' && (
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-300 rounded-full animate-pulse" title="Agent is online"></span>
                  )}
                  {chatStatus === 'waiting' && (
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-300 rounded-full animate-pulse" title="Waiting for agent"></span>
                  )}
                  {isOfflineMode && (
                    <span className="flex-shrink-0 text-xs bg-white/20 px-2 py-0.5 rounded" title="Offline mode">Offline</span>
                  )}
                </div>
                <p className="text-xs text-white/80 truncate">
                  {chatStatus === 'agent' 
                    ? assignedAgentName ? `Chatting with ${assignedAgentName}` : 'Connected to support team'
                    : chatStatus === 'waiting'
                    ? 'Agent will join soon...'
                    : isOfflineMode
                    ? 'Limited features available'
                    : "We're here to help"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors cursor-pointer flex-shrink-0 ml-2"
              aria-label="Close chat"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>

          {/* Email Form */}
          {showEmailForm && (
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex items-center justify-center">
              <div className="w-full max-w-sm">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-customer-service-2-line text-white text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Start a Conversation</h3>
                    <p className="text-sm text-gray-600">Enter your details to begin chatting</p>
                  </div>
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="chat-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="chat-name"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Your name"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="chat-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="chat-email"
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!userEmail.trim() || !userName.trim()}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <span>Start Chat</span>
                      <i className="ri-arrow-right-line"></i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Messages Container */}
          {!showEmailForm && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => {
              // Check if we need to show a date header
              const showDateHeader = index === 0 || 
                (messages[index - 1] && 
                 new Date(message.timestamp).toDateString() !== 
                 new Date(messages[index - 1].timestamp).toDateString())
              
              const messageDate = new Date(message.timestamp)
              const isToday = messageDate.toDateString() === new Date().toDateString()
              const isYesterday = messageDate.toDateString() === new Date(Date.now() - 86400000).toDateString()
              
              let dateLabel = ''
              if (isToday) {
                dateLabel = 'Today'
              } else if (isYesterday) {
                dateLabel = 'Yesterday'
              } else {
                dateLabel = messageDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
              }

              return (
                <React.Fragment key={message.id}>
                  {showDateHeader && (
                    <div className="flex items-center justify-center my-4">
                      <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {dateLabel}
                      </div>
                    </div>
                  )}
              <div
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2`}
              >
                {/* Avatar for assistant/agent messages */}
                {message.sender !== 'user' && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'agent'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500'
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
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : message.sender === 'agent'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg border-2 border-blue-400/30'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                  }`}
                >
                {message.sender === 'agent' && (
                  <div className="flex items-center space-x-2 mb-2 pb-1 border-b border-blue-300/30">
                    <i className="ri-user-heart-line text-xs"></i>
                    <span className="text-xs font-semibold opacity-95">Live Agent</span>
                    {assignedAgentName && (
                      <span className="text-xs opacity-75">• {assignedAgentName}</span>
                    )}
                  </div>
                )}
                  {message.sender === 'assistant' && isOfflineMode && (
                    <div className="flex items-center space-x-1 mb-1">
                      <i className="ri-wifi-off-line text-xs text-gray-500"></i>
                      <span className="text-xs text-gray-500 italic">Offline Mode</span>
                    </div>
                  )}
                  <p className={`text-sm whitespace-pre-line ${
                    message.sender === 'agent' ? 'text-white' : ''
                  }`}>{message.text}</p>
                  <span
                    className={`text-xs mt-2 block ${
                      message.sender === 'user' 
                        ? 'text-blue-100' 
                        : message.sender === 'agent'
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {/* Avatar for user messages */}
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    <i className="ri-user-line text-white text-sm"></i>
                  </div>
                )}
              </div>
              </React.Fragment>
            )
            })}

            {/* Typing Indicator - Assistant */}
            {isTyping && chatStatus !== 'agent' && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Typing Indicator - Agent */}
            {agentTyping && chatStatus === 'agent' && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg border-2 border-blue-400/30 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-xs font-medium opacity-90">
                      {assignedAgentName || 'Agent'} is typing...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
            </div>
          )}

          {/* Status Banner */}
          {!showEmailForm && chatStatus === 'waiting' && (
            <div className="px-4 pt-2 pb-2 border-t border-gray-200 bg-yellow-50">
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 flex items-center space-x-2">
                <i className="ri-time-line text-yellow-600 text-lg animate-pulse"></i>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-800">Waiting for Agent</p>
                  <p className="text-xs text-yellow-700">An agent will join your conversation shortly...</p>
                </div>
              </div>
            </div>
          )}

          {!showEmailForm && isOfflineMode && (
            <div className="px-4 pt-2 pb-2 border-t border-gray-200 bg-gray-50">
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 flex items-center space-x-2">
                <i className="ri-wifi-off-line text-gray-600 text-lg"></i>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Offline Mode</p>
                  <p className="text-xs text-gray-700">Limited features available. Live agent support is unavailable.</p>
                </div>
              </div>
            </div>
          )}

          {/* Live Agent Request Button - Small */}
          {!showEmailForm && chatStatus === 'ai' && !isOfflineMode && (
            <div className="px-4 pt-2 pb-2 border-t border-gray-200 bg-white">
              <button
                onClick={handleRequestLiveAgent}
                disabled={isTyping}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm hover:shadow-md"
              >
                <i className="ri-user-heart-line text-sm"></i>
                <span>Live Agent</span>
              </button>
            </div>
          )}

          {/* Input Area */}
          {!showEmailForm && (
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={chatStatus === 'agent' ? "Type your message to the agent..." : "Type your message..."}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Send message"
                >
                  <i className="ri-send-plane-fill text-lg"></i>
                </button>
              </div>
              <div className="flex items-center justify-center space-x-2 mt-2">
                {chatStatus === 'agent' && (
                  <div className="flex items-center space-x-1.5 text-xs text-blue-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="font-medium">Agent is online</span>
                  </div>
                )}
                {chatStatus === 'waiting' && (
                  <div className="flex items-center space-x-1.5 text-xs text-yellow-600">
                    <i className="ri-time-line animate-pulse"></i>
                    <span>Waiting for agent to join...</span>
                  </div>
                )}
                {isOfflineMode && chatStatus === 'ai' && (
                  <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                    <i className="ri-wifi-off-line"></i>
                    <span>Offline mode - Limited features</span>
                  </div>
                )}
                {!isOfflineMode && chatStatus === 'ai' && (
                  <p className="text-xs text-gray-500">
                    Ask about tracking, shipping, or account questions
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      )}
    </>
  )
}

export default AIAssistant


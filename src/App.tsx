import { BrowserRouter, useLocation } from 'react-router-dom'
import { AppRoutes } from './router'
import AIAssistant from './components/AIAssistant'
import { ToastContainer } from './components/Toast'

function ChatboxWrapper() {
  const location = useLocation()
  const pathname = location.pathname
  
  // Hide chatbox on admin and user dashboard pages
  const hideChatbox = pathname.startsWith('/admin') || pathname.startsWith('/dashboard')
  
  if (hideChatbox) {
    return null
  }
  
  return <AIAssistant />
}

function App() {
  return (
    <BrowserRouter basename={__BASE_PATH__}>
      <AppRoutes />
      <ChatboxWrapper />
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';

const TestConnectionPage = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    setApiBaseUrl(apiUrl);
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    setBackendStatus('checking');
    
    try {
      // Test 1: Ping endpoint
      const apiUrl = apiBaseUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const pingResult = await fetch(`${apiUrl}/ping`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const pingText = await pingResult.text();
      
      setTestResults(prev => ({
        ...prev,
        ping: {
          status: pingResult.status,
          ok: pingResult.ok,
          text: pingText
        }
      }));

      if (pingResult.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('disconnected');
      }

      // Test 2: Profile endpoint (without auth)
      try {
        const profileResult = await fetch(`${apiUrl}/user/profile`, {
          method: 'GET',
          credentials: 'include'
        });
        setTestResults(prev => ({
          ...prev,
          profile: {
            status: profileResult.status,
            ok: profileResult.ok,
            message: profileResult.status === 401 ? 'Unauthorized (expected if not logged in)' : 'Unexpected response'
          }
        }));
      } catch (err: any) {
        setTestResults(prev => ({
          ...prev,
          profile: {
            error: err.message
          }
        }));
      }

      // Test 3: Login endpoint structure
      try {
        const loginTest = await fetch(`${apiUrl}/user/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: 'test@test.com', password: 'test' })
        });
        setTestResults(prev => ({
          ...prev,
          login: {
            status: loginTest.status,
            ok: loginTest.ok,
            message: loginTest.status === 401 ? 'Endpoint exists (returns 401 for invalid credentials)' : 'Unexpected response'
          }
        }));
      } catch (err: any) {
        setTestResults(prev => ({
          ...prev,
          login: {
            error: err.message
          }
        }));
      }

    } catch (error: any) {
      console.error('Backend connection test failed:', error);
      setBackendStatus('disconnected');
      setTestResults(prev => ({
        ...prev,
        error: error.message || 'Failed to connect to backend'
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" style={{ backgroundColor: '#f9fafb', color: '#111827' }}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
          <h1 className="text-2xl font-bold text-gray-900 mb-6" style={{ color: '#111827' }}>Backend Connection Diagnostic</h1>
          
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-4 h-4 rounded-full ${
                backendStatus === 'connected' ? 'bg-green-500' : 
                backendStatus === 'disconnected' ? 'bg-red-500' : 
                'bg-yellow-500 animate-pulse'
              }`}></div>
              <span className="font-semibold" style={{ color: '#111827' }}>
                Backend Status: {backendStatus === 'connected' ? 'Connected' : 
                                backendStatus === 'disconnected' ? 'Disconnected' : 
                                'Checking...'}
              </span>
            </div>
            <p className="text-sm text-gray-600" style={{ color: '#4b5563' }}>
              API Base URL: <code className="bg-gray-100 px-2 py-1 rounded" style={{ backgroundColor: '#f3f4f6', color: '#111827' }}>{apiBaseUrl}</code>
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>Test Results:</h2>
            
            {testResults.ping && (
              <div className="border border-gray-200 rounded p-4" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
                <h3 className="font-medium mb-2" style={{ color: '#111827' }}>Ping Endpoint (/api/ping)</h3>
                <pre className="bg-gray-50 p-2 rounded text-sm overflow-auto" style={{ backgroundColor: '#f9fafb', color: '#111827' }}>
                  {JSON.stringify(testResults.ping, null, 2)}
                </pre>
              </div>
            )}

            {testResults.profile && (
              <div className="border border-gray-200 rounded p-4" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
                <h3 className="font-medium mb-2" style={{ color: '#111827' }}>Profile Endpoint (/api/user/profile)</h3>
                <pre className="bg-gray-50 p-2 rounded text-sm overflow-auto" style={{ backgroundColor: '#f9fafb', color: '#111827' }}>
                  {JSON.stringify(testResults.profile, null, 2)}
                </pre>
              </div>
            )}

            {testResults.login && (
              <div className="border border-gray-200 rounded p-4" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
                <h3 className="font-medium mb-2" style={{ color: '#111827' }}>Login Endpoint (/api/user/login)</h3>
                <pre className="bg-gray-50 p-2 rounded text-sm overflow-auto" style={{ backgroundColor: '#f9fafb', color: '#111827' }}>
                  {JSON.stringify(testResults.login, null, 2)}
                </pre>
              </div>
            )}

            {testResults.error && (
              <div className="border border-red-200 bg-red-50 rounded p-4">
                <h3 className="font-medium text-red-800 mb-2">Error</h3>
                <p className="text-red-600">{testResults.error}</p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Troubleshooting Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Ensure your Flask backend is running on <code className="bg-blue-100 px-1 rounded">http://localhost:5000</code></li>
              <li>Check that CORS is enabled on your backend for <code className="bg-blue-100 px-1 rounded">http://localhost:3000</code></li>
              <li>Verify that the backend has the required endpoints: <code className="bg-blue-100 px-1 rounded">/api/ping</code>, <code className="bg-blue-100 px-1 rounded">/api/user/login</code>, <code className="bg-blue-100 px-1 rounded">/api/user/profile</code></li>
              <li>Check browser console (F12) for any CORS or network errors</li>
              <li>If using a different backend URL, set <code className="bg-blue-100 px-1 rounded">VITE_API_BASE_URL</code> in your <code className="bg-blue-100 px-1 rounded">.env</code> file</li>
            </ol>
          </div>

          <button
            onClick={testBackendConnection}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retest Connection
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestConnectionPage;


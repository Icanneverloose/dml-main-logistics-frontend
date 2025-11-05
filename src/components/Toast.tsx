import React, { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

export const toast = {
  success: (message: string) => addToast(message, 'success'),
  error: (message: string) => addToast(message, 'error'),
  info: (message: string) => addToast(message, 'info'),
  warning: (message: string) => addToast(message, 'warning'),
};

const addToast = (message: string, type: ToastType) => {
  const id = Date.now().toString();
  toasts = [...toasts, { id, message, type }];
  notifyListeners();
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(id);
  }, 5000);
};

const removeToast = (id: string) => {
  toasts = toasts.filter(t => t.id !== id);
  notifyListeners();
};

const notifyListeners = () => {
  toastListeners.forEach(listener => listener([...toasts]));
};

export const ToastContainer: React.FC = () => {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setCurrentToasts(newToasts);
    };
    toastListeners.push(listener);
    setCurrentToasts(toasts);
    
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'ri-checkbox-circle-line';
      case 'error':
        return 'ri-error-warning-line';
      case 'warning':
        return 'ri-alert-line';
      case 'info':
        return 'ri-information-line';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {currentToasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-[500px] flex items-start gap-3 animate-fade-in`}
        >
          <i className={`${getIcon(toast.type)} text-xl flex-shrink-0 mt-0.5`}></i>
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => {
              toasts = toasts.filter(t => t.id !== toast.id);
              notifyListeners();
            }}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
      ))}
    </div>
  );
};


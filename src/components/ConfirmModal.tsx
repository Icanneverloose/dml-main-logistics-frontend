import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'info'
}) => {
  if (!isOpen) return null;

  const getButtonStyles = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'info':
      default:
        return 'bg-[#009FE3] hover:bg-[#007bb3] text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return 'ri-error-warning-line text-red-600';
      case 'warning':
        return 'ri-alert-line text-yellow-600';
      case 'success':
        return 'ri-checkbox-circle-line text-green-600';
      case 'info':
      default:
        return 'ri-information-line text-[#009FE3]';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full p-6 ${
        type === 'success' ? 'max-w-lg' : 'max-w-md'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            type === 'danger' ? 'bg-red-100' : 
            type === 'warning' ? 'bg-yellow-100' : 
            type === 'success' ? 'bg-green-100' :
            'bg-blue-100'
          }`}>
            <i className={`${getIcon()} text-2xl`}></i>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <div className="text-gray-600 mb-6">
              {typeof message === 'string' ? <p>{message}</p> : message}
            </div>
            <div className="flex justify-end gap-3">
              {cancelText && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {cancelText}
                </button>
              )}
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-lg transition-colors ${getButtonStyles()}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


import React, { useEffect } from 'react';

export default function QuizToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;

    // Automatically dismiss the toast after 3.5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`quiz-toast toast-${toast.type || 'info'}`} role="status">
      <div className="toast-content">
        <span className="toast-icon">
          {toast.type === 'success' && '✅'}
          {toast.type === 'warning' && '⚠️'}
          {toast.type === 'error' && '❌'}
          {(!toast.type || toast.type === 'info') && 'ℹ️'}
        </span>
        <span className="toast-message">{toast.message}</span>
      </div>
      <button 
        type="button" 
        className="toast-close-btn" 
        onClick={onClose} 
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

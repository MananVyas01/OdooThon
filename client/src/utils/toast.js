import toast from 'react-hot-toast';

// Enhanced toast utility with different types and options
export const showToast = {
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: 'white',
        secondary: '#10b981',
      },
      ...options
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: 'white',
        secondary: '#ef4444',
      },
      ...options
    });
  },

  info: (message, options = {}) => {
    return toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
        fontWeight: '500',
      },
      ...options
    });
  },

  warning: (message, options = {}) => {
    return toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
        fontWeight: '500',
      },
      ...options
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6b7280',
        color: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
        fontWeight: '500',
      },
      ...options
    });
  },

  // Special toast for swap completion
  swapCompleted: (message = 'Swap completed successfully!') => {
    return toast.success(message, {
      duration: 6000,
      position: 'top-right',
      icon: '🔄',
      style: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        borderRadius: '12px',
        padding: '16px 20px',
        fontWeight: '600',
        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
      },
    });
  },

  // Special toast for item approval
  itemApproved: (message = 'Item approved and published!') => {
    return toast.success(message, {
      duration: 5000,
      position: 'top-right',
      icon: '✅',
      style: {
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        color: 'white',
        borderRadius: '12px',
        padding: '16px 20px',
        fontWeight: '600',
        boxShadow: '0 10px 25px rgba(34, 197, 94, 0.3)',
      },
    });
  },

  // Special toast for insufficient points
  insufficientPoints: (message = 'Insufficient points for this swap!') => {
    return toast.error(message, {
      duration: 5000,
      position: 'top-right',
      icon: '💎',
      style: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        borderRadius: '12px',
        padding: '16px 20px',
        fontWeight: '600',
        boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
      },
    });
  },

  // Special toast for eco impact
  ecoImpact: (message, co2Saved, waterSaved) => {
    return toast.success(`${message} 🌱 ${co2Saved}kg CO₂ saved, ${waterSaved}L water conserved!`, {
      duration: 8000,
      position: 'top-right',
      icon: '🌍',
      style: {
        background: 'linear-gradient(135deg, #22c55e 0%, #059669 100%)',
        color: 'white',
        borderRadius: '12px',
        padding: '16px 20px',
        fontWeight: '600',
        boxShadow: '0 10px 25px rgba(34, 197, 94, 0.3)',
        maxWidth: '400px',
      },
    });
  },

  // Promise-based toast for async operations
  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Error occurred',
    }, {
      position: 'top-right',
      style: {
        borderRadius: '8px',
        padding: '12px 16px',
        fontWeight: '500',
      },
    });
  },

  // Dismiss specific toast
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  }
};

export default showToast;

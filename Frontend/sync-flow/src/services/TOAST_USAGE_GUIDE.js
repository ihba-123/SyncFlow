// Toast Usage Guide - Implementation Examples

/**
 * METHOD 1: Using the custom hook (RECOMMENDED)
 * Best for React components - automatically manages theme
 */

// In your component:
import useToast from '@/hooks/useToast';

export const MyComponent = () => {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Operation successful!');
  };

  const handleError = () => {
    toast.error('Something went wrong!');
  };

  const handleInfo = () => {
    toast.info('Here is some information');
  };

  const handleWarning = () => {
    toast.warning('Be careful!');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleInfo}>Show Info</button>
      <button onClick={handleWarning}>Show Warning</button>
    </div>
  );
};

/**
 * METHOD 2: Using the service directly
 * For use outside of React components or utility functions
 */

import { showSuccess, showError, showInfo, showWarning, showLoading, updateToast } from '@/services/toastService';

// Success notification
showSuccess('Operation completed successfully!');

// Error notification
showError('An error occurred. Please try again.');

// Info notification
showInfo('Here is some important information.');

// Warning notification
showWarning('This action cannot be undone.');

// Loading notification
const toastId = showLoading('Processing your request...');

// Update loading toast after operation completes
// Option 1: Success
updateToast(toastId, {
  render: 'Operation completed!',
  type: 'success',
  isLoading: false,
  autoClose: 3000,
  className: 'toast-success',
  progressClassName: 'toast-progress-success',
});

// Option 2: Error
updateToast(toastId, {
  render: 'Operation failed!',
  type: 'error',
  isLoading: false,
  autoClose: 3000,
  className: 'toast-error',
  progressClassName: 'toast-progress-error',
});

/**
 * USAGE IN DIFFERENT SCENARIOS
 */

// 1. Form Submission
const handleSubmit = async (formData) => {
  try {
    const response = await api.post('/submit', formData);
    toast.success('Form submitted successfully!');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to submit form');
  }
};

// 2. API Call with Loading
const fetchData = async () => {
  const loadingId = toast.loading('Loading data...');
  try {
    const response = await api.get('/data');
    toast.update(loadingId, {
      render: 'Data loaded successfully!',
      type: 'success',
      isLoading: false,
      autoClose: 3000,
    });
  } catch (error) {
    toast.update(loadingId, {
      render: 'Failed to load data',
      type: 'error',
      isLoading: false,
      autoClose: 3000,
    });
  }
};

// 3. Async Operations
const deleteItem = async (id) => {
  try {
    await api.delete(`/items/${id}`);
    toast.success('Item deleted successfully!');
  } catch (error) {
    toast.error('Failed to delete item. Try again.');
  }
};

// 4. Validation Messages
const handleFormValidation = (errors) => {
  if (errors.length > 0) {
    const firstError = errors[0];
    toast.warning(firstError);
  }
};

/**
 * FEATURES
 */

// Auto-close after 3.5 seconds
toast.success('This will auto-close');

// Custom options
toast.success('Custom toast', {
  autoClose: 5000,      // Override auto-close duration
  position: 'bottom-center',  // Change position
  hideProgressBar: true,      // Hide progress bar
});

// Limit concurrent toasts to prevent clutter
// (Already configured in App.jsx with limit={3})

/**
 * STYLING
 */

// The following CSS classes are available:
// - .toast-success    - Green toast
// - .toast-error      - Red toast
// - .toast-info       - Blue toast
// - .toast-warning    - Yellow/Orange toast
// - .toast-loading    - Default style with spinner

// Dark/Light mode is automatically applied based on:
// 1. data-theme attribute on HTML element
// 2. System preference (prefers-color-scheme)

/**
 * BEST PRACTICES
 */

// ✓ DO:
// - Use the custom hook useToast() in components
// - Keep messages concise and clear
// - Use appropriate toast type (success, error, info, warning)
// - Handle errors gracefully with meaningful messages

// ✗ DON'T:
// - Spam multiple toasts - limit to 3 max
// - Use toast for critical errors - use error boundaries
// - Make messages too long
// - Use success for every action - reserve for important ones

export default {
  useToast,
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showLoading,
  updateToast,
};

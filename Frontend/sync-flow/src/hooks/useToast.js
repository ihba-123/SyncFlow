// Custom hook for toast notifications
import { useCallback } from 'react';
import { showSuccess, showError, showInfo, showWarning, showLoading, updateToast } from '@/services/toastService';

export const useToast = () => {
  const success = useCallback((message, options) => {
    showSuccess(message, options);
  }, []);

  const error = useCallback((message, options) => {
    showError(message, options);
  }, []);

  const info = useCallback((message, options) => {
    showInfo(message, options);
  }, []);

  const warning = useCallback((message, options) => {
    showWarning(message, options);
  }, []);

  const loading = useCallback((message) => {
    return showLoading(message);
  }, []);

  const update = useCallback((id, options) => {
    updateToast(id, options);
  }, []);

  return {
    success,
    error,
    info,
    warning,
    loading,
    update,
  };
};

export default useToast;

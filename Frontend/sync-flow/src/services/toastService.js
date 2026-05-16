// Toast notification service with dark/light mode support
import { toast } from 'react-toastify';

const baseToastConfig = {
  position: 'top-right',
  autoClose: 2200,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  closeButton: false,
  newestOnTop: true,
  progress: undefined,
};

const buildToastOptions = (type, message, options = {}) => ({
  ...baseToastConfig,
  ...options,
  toastId: options.toastId || `${type}:${message}`,
  className: `sf-toast sf-toast--${type}`,
  bodyClassName: 'sf-toast__body',
  progressClassName: `sf-toast__progress sf-toast__progress--${type}`,
});

export const showSuccess = (message, options = {}) =>
  toast.success(message, buildToastOptions('success', message, options));

export const showError = (message, options = {}) =>
  toast.error(message, buildToastOptions('error', message, options));

export const showInfo = (message, options = {}) =>
  toast.info(message, buildToastOptions('info', message, options));

export const showWarning = (message, options = {}) =>
  toast.warning(message, buildToastOptions('warning', message, options));

export const showLoading = (message, options = {}) =>
  toast.loading(message, {
    ...baseToastConfig,
    ...options,
    autoClose: false,
    closeButton: false,
    draggable: false,
    toastId: options.toastId || `loading:${message}`,
    className: 'sf-toast sf-toast--loading',
    bodyClassName: 'sf-toast__body',
    progressClassName: 'sf-toast__progress sf-toast__progress--loading',
  });

export const updateToast = (id, options) => {
  toast.update(id, {
    ...options,
    className: options?.className || 'sf-toast sf-toast--info',
    bodyClassName: options?.bodyClassName || 'sf-toast__body',
  });
};

export const dismissToast = (id) => {
  if (id) {
    toast.dismiss(id);
    return;
  }
  toast.dismiss();
};

export default {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showLoading,
  updateToast,
  dismissToast,
};

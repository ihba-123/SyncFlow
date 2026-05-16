export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (Array.isArray(data?.non_field_errors) && data.non_field_errors.length > 0) {
    return data.non_field_errors[0];
  }

  if (typeof data?.detail === "string" && data.detail.trim()) {
    return data.detail;
  }

  if (typeof data?.error === "string" && data.error.trim()) {
    return data.error;
  }

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof error?.message === "string" && error.message.trim() && error.message !== "Network Error") {
    return error.message;
  }

  return fallback;
};
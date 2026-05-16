import { useEffect } from "react";

const noop = () => {};

const useSuppressConsoleErrors = () => {
  useEffect(() => {
    const shouldSuppress = import.meta.env.VITE_SUPPRESS_CONSOLE_ERRORS !== "false";

    if (!shouldSuppress) {
      return undefined;
    }

    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = noop;
    console.warn = noop;

    const handleError = (event) => {
      event.preventDefault();
      return true;
    };

    const handleRejection = (event) => {
      event.preventDefault();
      return true;
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);
};

export default useSuppressConsoleErrors;

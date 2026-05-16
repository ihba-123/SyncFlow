import { toast } from "react-toastify";

export const showAutoToast = (message, type = "info", options = {}) => {
  const config = {
    position: "top-right",
    autoClose: options.autoClose ?? 2200,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    closeButton: false,
    newestOnTop: true,
    transition: options.transition,
    ...options,
  };

  const content = typeof message === "string" ? message : String(message ?? "");

  if (type === "success") return toast.success(content, config);
  if (type === "error") return toast.error(content, config);
  if (type === "warning") return toast.warning(content, config);
  return toast.info(content, config);
};

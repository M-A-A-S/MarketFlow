let triggerToast = null;

const showToast = (message, type = "default") => {
  triggerToast && triggerToast(message, type);
};

export const toast = {
  success: (msg) => showToast(msg, "success"),
  error: (msg) => showToast(msg, "error"),
  warning: (msg) => showToast(msg, "warning"),
  default: (msg) => showToast(msg, "default"),
};

// Set the internal trigger from ToastContainer
export const setToastTrigger = (triggerFn) => {
  triggerToast = triggerFn;
};

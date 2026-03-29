import React, { useEffect, useState } from "react";
import Toast from "./Toast";
import { setToastTrigger } from "../../utils/toastHelper";

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  function geneateToastId() {
    return Date.now() + Math.random();
  }

  const createToast = (message, type) => {
    const id = geneateToastId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    setToastTrigger(createToast);
  }, []);

  return (
    <div className="fixed top-5 right-5 flex flex-col gap-3 z-[9999]">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;

import Modal from "./Modal";
import Button from "./Button";
import { safeCall } from "../../utils/utils";
import { Loader2 } from "lucide-react";

const ConfirmModal = ({
  show,
  onClose,
  onConfirm,
  message,
  title = "Are you sure you want to do this action?",
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  loading = false,
}) => {
  const handleClose = safeCall(onClose);
  const handleConfirm = safeCall(onConfirm);

  return (
    <Modal
      show={show}
      onClose={handleClose}
      title={title}
      className="confirm-modal"
    >
      {/* Confirmation message */}
      <p className="text-sm">{message}</p>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        {/* <Button
          onClick={handleClose}
          className="bg-transparent text-black dark:text-white shadow-none
           hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {cancelLabel}
        </Button> */}
        <Button disabled={loading} onClick={handleClose} isCancelBtn={true}>
          {cancelLabel}
        </Button>

        <Button disabled={loading} onClick={handleConfirm}>
          {loading ? <Loader2 className="animate-spin" /> : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

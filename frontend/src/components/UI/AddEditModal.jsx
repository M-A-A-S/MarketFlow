import Button from "./Button";
import { useLanguage } from "../../hooks/useLanguage";
import { safeCall } from "../../utils/utils";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";

const AddEditModal = ({ show, onClose, onSave, title, loading, children }) => {
  const { translations } = useLanguage();
  const { cancel, save } = translations.common;

  const handleClose = safeCall(onClose);
  const handleSubmit = safeCall(onSave);

  return (
    <>
      <Modal
        show={show}
        onClose={handleClose}
        title={title}
        footer={
          <>
            <Button disabled={loading} isCancelBtn={true} onClick={onClose}>
              {cancel}
            </Button>
            <Button disabled={loading} onClick={handleSubmit}>
              {loading ? <Loader2 className="animate-spin" /> : save}
            </Button>
          </>
        }
      >
        {children}
      </Modal>
    </>
  );
};

export default AddEditModal;

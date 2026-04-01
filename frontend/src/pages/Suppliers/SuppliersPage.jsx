import { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/UI/Button";
import SpinnerLoader from "../../components/UI/SpinnerLoader";
import ConfirmModal from "../../components/UI/ConfirmModal";
import { Plus } from "lucide-react";
import { read, remove } from "../../api/apiWrapper";
import { showFail, showSuccess } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import ViewSwitcher from "../../components/UI/ViewSwitcher";
import CardView from "./components/CardView";
import TableView from "./components/TableView";

const SuppliersPage = () => {
  const [view, setView] = useState("card");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorCode, setErrorCode] = useState("");

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();
  const { translations } = useLanguage();

  const {
    title,
    description,
    add_new_supplier,
    empty_state,
    delete_success,
    delete_fail,
    delete_supplier_title,
    delete_supplier_message,
  } = translations.pages.suppliers_page;

  const { cancel, delete_label, loading_error } = translations.common;

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setErrorCode("");

      const result = await read("suppliers");

      setSuppliers(result?.data);
    } catch (err) {
      setErrorCode(err?.code);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  function handleDeleteSupplier(supplier) {
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  }
  function handleEditSupplier(supplier) {
    navigate(`/edit-supplier/${supplier?.id}`);
  }

  function handleAddSupplier() {
    navigate("/add-supplier");
  }

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSupplier(null);
  };

  const deleteSupplier = async () => {
    try {
      setActionLoading(true);

      const result = await remove(`suppliers/${selectedSupplier.id}`);

      setSuppliers((prev) => prev.filter((s) => s.id !== selectedSupplier.id));

      showSuccess(result?.code, delete_success);
      closeModal();
    } catch (err) {
      showFail(err?.code, delete_fail);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        leftSection={
          <Button onClick={handleAddSupplier}>
            <Plus /> {add_new_supplier}
          </Button>
        }
      />

      {loading ? (
        <div className="grid place-items-center h-[60vh]">
          <SpinnerLoader />
        </div>
      ) : errorCode ? (
        <div className="grid place-items-center h-[60vh] text-red-500">
          {translations.server_codes[errorCode] || loading_error}
        </div>
      ) : suppliers?.length === 0 ? (
        <div className="grid place-items-center h-[60vh] text-gray-500">
          {empty_state}
        </div>
      ) : (
        <>
          <div className="my-5">
            <ViewSwitcher view={view} setView={setView} />
          </div>

          {view == "card" && (
            <CardView
              suppliers={suppliers}
              handleEditSupplier={handleEditSupplier}
              handleDeleteSupplier={handleDeleteSupplier}
            />
          )}
          {view == "table" && (
            <TableView
              suppliers={suppliers}
              handleEditSupplier={handleEditSupplier}
              handleDeleteSupplier={handleDeleteSupplier}
            />
          )}
        </>
      )}

      <ConfirmModal
        show={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={deleteSupplier}
        title={delete_supplier_title}
        message={delete_supplier_message}
        cancelLabel={cancel}
        confirmLabel={delete_label}
        loading={actionLoading}
      />
    </div>
  );
};

export default SuppliersPage;

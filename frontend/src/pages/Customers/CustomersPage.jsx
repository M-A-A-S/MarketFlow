import PageHeader from "../../components/PageHeader";
import Button from "../../components/UI/Button";
import SpinnerLoader from "../../components/UI/SpinnerLoader";
import ConfirmModal from "../../components/UI/ConfirmModal";
import ViewSwitcher from "../../components/UI/ViewSwitcher";
import CardView from "./components/CardView";
import TableView from "./components/TableView";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { read, remove } from "../../api/apiWrapper";
import { useLanguage } from "../../hooks/useLanguage";
import { Plus } from "lucide-react";

const CustomersPage = () => {
  const [view, setView] = useState("card");
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorCode, setErrorCode] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  const { translations } = useLanguage();

  const {
    title,
    description,
    add_new_customer,
    empty_state,
    delete_success,
    delete_fail,
    delete_customer_title,
    delete_customer_message,
  } = translations.pages.customers_page;

  const { cancel, delete_label, loading_error } = translations.common;

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setErrorCode("");

      const result = await read("customers");

      // setCustomers(result?.data);
      setCustomers(result?.data?.items);
    } catch (err) {
      setErrorCode(err?.code);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  function handleAddCustomer() {
    navigate("/add-customer");
  }

  function handleEditCustomer(customer) {
    navigate(`/edit-customer/${customer?.id}`);
  }

  function handleDeleteCustomer(customer) {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  }

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCustomer(null);
  };

  const deleteCustomer = async () => {
    try {
      setActionLoading(true);
      const result = await remove(`customers/${selectedCustomer.id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
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
          <Button onClick={handleAddCustomer}>
            <Plus /> {add_new_customer}
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
      ) : customers?.length === 0 ? (
        <div className="grid place-items-center h-[60vh] text-gray-500">
          {empty_state}
        </div>
      ) : (
        <>
          <div className="my-5">
            <ViewSwitcher view={view} setView={setView} />
          </div>

          {view === "card" && (
            <CardView
              customers={customers}
              handleEditCustomer={handleEditCustomer}
              handleDeleteCustomer={handleDeleteCustomer}
            />
          )}

          {view === "table" && (
            <TableView
              customers={customers}
              handleEditCustomer={handleEditCustomer}
              handleDeleteCustomer={handleDeleteCustomer}
            />
          )}
        </>
      )}

      <ConfirmModal
        show={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={deleteCustomer}
        title={delete_customer_title}
        message={delete_customer_message}
        cancelLabel={cancel}
        confirmLabel={delete_label}
        loading={actionLoading}
      />
    </div>
  );
};
export default CustomersPage;

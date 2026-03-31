import { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/UI/Button";
import SpinnerLoader from "../../components/UI/SpinnerLoader";
import ViewSwitcher from "../../components/UI/ViewSwitcher";
import ConfirmModal from "../../components/UI/ConfirmModal";
import { Plus } from "lucide-react";
import { read, update, create, remove } from "../../api/apiWrapper";
import AddEditBrandModal from "./components/AddEditBrandModal";
import CardView from "./components/CardView";
import TableView from "./components/TableView";
import { showFail, showSuccess } from "../../utils/utils";

const BrandsPage = () => {
  const [view, setView] = useState("card");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorCode, setErrorCode] = useState("");

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState(null);

  const { translations } = useLanguage();

  const {
    title,
    description,
    add_new_brand,
    empty_state,
    delete_success,
    delete_fail,
    delete_brand_title,
    delete_brand_message,
    add_success,
    add_fail,
    update_success,
    update_fail,
  } = translations.pages.brands_page;

  const { cancel, delete_label, loading_error } = translations.common;

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setErrorCode("");
      const result = await read("brands");
      setBrands(result.data);
    } catch (error) {
      setErrorCode(error?.code);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  function handleAdd() {
    setSelectedBrand(null);
    setIsAddEditModalOpen(true);
  }

  function handleEdit(brand) {
    setSelectedBrand(brand);
    setIsAddEditModalOpen(true);
  }

  function handleDelete(brand) {
    setSelectedBrand(brand);
    setIsDeleteModalOpen(true);
  }

  const closeModal = () => {
    setIsAddEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedBrand(null);
  };

  function submitForm(payload) {
    selectedBrand ? updateBrand(payload) : addBrand(payload);
  }

  async function addBrand(payload) {
    try {
      setActionLoading(true);
      const result = await create("brands", payload);
      setBrands((prev) => [...prev, result.data]);
      showSuccess(result?.code, add_success);
    } catch (err) {
      showFail(err?.code, add_fail);
    } finally {
      setActionLoading(false);
      closeModal();
    }
  }

  async function updateBrand(payload) {
    try {
      setActionLoading(true);
      const result = await update(`brands/${selectedBrand.id}`, payload);
      setBrands((prev) =>
        prev.map((b) => (b.id === result.data.id ? result.data : b)),
      );
      showSuccess(result?.code, update_success);
    } catch (err) {
      showFail(err?.code, update_fail);
    } finally {
      setActionLoading(false);
      closeModal();
    }
  }

  async function deleteBrand() {
    try {
      setActionLoading(true);
      const result = await remove(`brands/${selectedBrand.id}`);
      setBrands((prev) => prev.filter((b) => b.id !== selectedBrand.id));
      showSuccess(result?.code, delete_success);
    } catch (err) {
      showFail(err?.code, delete_fail);
    } finally {
      setActionLoading(false);
      closeModal();
    }
  }

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        leftSection={
          <Button onClick={handleAdd}>
            <Plus /> {add_new_brand}
          </Button>
        }
      />

      {loading ? (
        <SpinnerLoader />
      ) : errorCode ? (
        <div>{translations.server_codes[errorCode] || loading_error}</div>
      ) : brands.length === 0 ? (
        <div>{empty_state}</div>
      ) : (
        <>
          <ViewSwitcher view={view} setView={setView} />

          {view === "card" && (
            <CardView
              brands={brands}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}

          {view === "table" && (
            <TableView
              brands={brands}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
        </>
      )}

      <AddEditBrandModal
        show={isAddEditModalOpen}
        onClose={closeModal}
        onConfirm={submitForm}
        brand={selectedBrand}
        loading={actionLoading}
      />

      <ConfirmModal
        show={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={deleteBrand}
        title={delete_brand_title}
        message={delete_brand_message}
        cancelLabel={cancel}
        confirmLabel={delete_label}
        loading={actionLoading}
      />
    </div>
  );
};

export default BrandsPage;

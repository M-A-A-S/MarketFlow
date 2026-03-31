import { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/UI/Button";
import SpinnerLoader from "../../components/UI/SpinnerLoader";
import ViewSwitcher from "../../components/UI/ViewSwitcher";
import ConfirmModal from "../../components/UI/ConfirmModal";
import { Plus } from "lucide-react";
import { read, update, create, remove } from "../../api/apiWrapper";
// import AddEditProductModal from "./components/AddEditProductModal";
import CardView from "./components/CardView";
import TableView from "./components/TableView";
import { showFail, showSuccess } from "../../utils/utils";

const ProductsPage = () => {
  const [view, setView] = useState("card");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorCode, setErrorCode] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const { translations } = useLanguage();

  const {
    title,
    description,
    add_new_product,
    empty_state,
    delete_success,
    delete_fail,
    delete_product_title,
    delete_product_message,
    add_success,
    add_fail,
    update_success,
    update_fail,
  } = translations.pages.products_page;

  const { cancel, delete_label, loading_error } = translations.common;

  // 🔥 Fetch all needed data
  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorCode("");

      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        read("products"),
        read("categories"),
        read("brands"),
      ]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setBrands(brandsRes.data);
    } catch (error) {
      setErrorCode(error?.code);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function handleAdd() {
    setSelectedProduct(null);
    setIsModalOpen(true);
  }

  function handleEdit(product) {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  function handleDelete(product) {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  function submitForm(payload) {
    selectedProduct ? updateProduct(payload) : addProduct(payload);
  }

  async function addProduct(payload) {
    try {
      setActionLoading(true);
      const result = await create("products", payload);
      setProducts((prev) => [...prev, result.data]);
      showSuccess(result?.code, add_success);
    } catch (err) {
      showFail(err?.code, add_fail);
    } finally {
      setActionLoading(false);
      closeModal();
    }
  }

  async function updateProduct(payload) {
    try {
      setActionLoading(true);
      const result = await update(`products/${selectedProduct.id}`, payload);

      setProducts((prev) =>
        prev.map((p) => (p.id === result.data.id ? result.data : p)),
      );

      showSuccess(result?.code, update_success);
    } catch (err) {
      showFail(err?.code, update_fail);
    } finally {
      setActionLoading(false);
      closeModal();
    }
  }

  async function deleteProduct() {
    try {
      setActionLoading(true);
      const result = await remove(`products/${selectedProduct.id}`);

      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));

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
            <Plus /> {add_new_product}
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
      ) : products.length === 0 ? (
        <div className="grid place-items-center h-[60vh] text-gray-500">
          {empty_state}
        </div>
      ) : (
        <>
          <ViewSwitcher view={view} setView={setView} />

          {view === "card" && (
            <CardView
              products={products}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}

          {view === "table" && (
            <TableView
              products={products}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
        </>
      )}

      {/* <AddEditProductModal
        show={isModalOpen}
        onClose={closeModal}
        onConfirm={submitForm}
        product={selectedProduct}
        categories={categories}
        brands={brands}
        loading={actionLoading}
      /> */}

      <ConfirmModal
        show={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={deleteProduct}
        title={delete_product_title}
        message={delete_product_message}
        cancelLabel={cancel}
        confirmLabel={delete_label}
        loading={actionLoading}
      />
    </div>
  );
};

export default ProductsPage;

import { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/UI/Button";
import SpinnerLoader from "../../components/UI/SpinnerLoader";
import ViewSwitcher from "../../components/UI/ViewSwitcher";
import ConfirmModal from "../../components/UI/ConfirmModal";
import { Plus } from "lucide-react";
import { read, update, create, remove } from "../../api/apiWrapper";
import AddEditCategoryModal from "./components/AddEditCategoryModal";
import CardView from "./components/CardView";
import TableView from "./components/TableView";
import { showFail, showSuccess } from "../../utils/utils";

const CategoiesPage = () => {
  const [view, setView] = useState("card"); // 'table' or 'card'
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const [isAddEditCategoryModalOpen, setIsAddEditCategoryModalOpen] =
    useState(false);
  const [
    isDeleteCategoryConfirmModalOpen,
    setIsDeleteCategoryConfirmModalOpen,
  ] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { translations } = useLanguage();

  const {
    title,
    description,
    add_new_category,
    empty_state,
    delete_success,
    delete_fail,
    delete_category_title,
    delete_category_message,
    add_success,
    add_fail,
    update_success,
    update_fail,
  } = translations.pages.categories_page;

  const { cancel, delete_label, loading_error } = translations.common;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setErrorCode("");
      const result = await read("categories");
      console.log("result", result);
      setCategories(result.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setErrorCode(error?.code);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  function handleDeleteCategory(category) {
    setSelectedCategory(category);
    setIsDeleteCategoryConfirmModalOpen(true);
    console.log("category -> ", category);
  }
  function handleEditCategory(category) {
    setSelectedCategory(category);
    setIsAddEditCategoryModalOpen(true);
    console.log("category -> ", category);
  }

  function handleAddCategory() {
    setSelectedCategory(null);
    setIsAddEditCategoryModalOpen(true);
  }

  const closeModal = () => {
    setIsAddEditCategoryModalOpen(false);
    setIsDeleteCategoryConfirmModalOpen(false);
    setSelectedCategory(null);
  };

  function addEditCategory(payload) {
    if (selectedCategory) {
      updateCategory(payload);
    } else {
      addCategory(payload);
    }
  }

  async function addCategory(payload) {
    try {
      setActionLoading(true);
      const result = await create(`categories`, payload);
      setCategories((prev) => [...prev, result.data]);
      showSuccess(result?.code, add_success);
    } catch (error) {
      console.log("error -> ", error);
      showFail(error?.code, add_fail);
    } finally {
      setActionLoading(false);
      closeModal();
    }
  }

  async function updateCategory(payload) {
    try {
      setActionLoading(true);
      const result = await update(
        `categories/${selectedCategory?.id}`,
        payload,
      );
      setCategories((prev) =>
        prev.map((cat) => (cat.id === result?.data?.id ? result.data : cat)),
      );
      showSuccess(result?.code, update_success);
    } catch (error) {
      console.log("error -> ", error);
      showFail(error?.code, update_fail);
    } finally {
      setActionLoading(false);
      closeModal();
    }
  }

  async function deleteCategory() {
    try {
      setActionLoading(true);
      const result = await remove(`categories/${selectedCategory.id}`);

      setCategories((prev) =>
        prev.filter((cat) => cat.id != selectedCategory.id),
      );

      showSuccess(result?.code, delete_success);
    } catch (error) {
      console.log("error -> ", error);
      showFail(error?.code, delete_fail);
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
          <Button onClick={handleAddCategory}>
            <Plus /> {add_new_category}
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
      ) : categories?.length === 0 ? (
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
              categories={categories}
              handleEditCategory={handleEditCategory}
              handleDeleteCategory={handleDeleteCategory}
            />
          )}
          {view == "table" && (
            <TableView
              categories={categories}
              handleEditCategory={handleEditCategory}
              handleDeleteCategory={handleDeleteCategory}
            />
          )}
        </>
      )}

      <AddEditCategoryModal
        show={isAddEditCategoryModalOpen}
        onClose={closeModal}
        onConfirm={addEditCategory}
        category={selectedCategory}
        loading={actionLoading}
      />
      <ConfirmModal
        show={isDeleteCategoryConfirmModalOpen}
        onClose={closeModal}
        onConfirm={deleteCategory}
        title={delete_category_title}
        message={delete_category_message}
        cancelLabel={cancel}
        confirmLabel={delete_label}
        loading={actionLoading}
      />
    </div>
  );
};
export default CategoiesPage;

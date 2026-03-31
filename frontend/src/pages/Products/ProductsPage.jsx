import { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/UI/Button";
import SpinnerLoader from "../../components/UI/SpinnerLoader";
import ViewSwitcher from "../../components/UI/ViewSwitcher";
import Pagination from "../../components/UI/Pagination";
import ConfirmModal from "../../components/UI/ConfirmModal";
import { Plus } from "lucide-react";
import { read, update, create, remove } from "../../api/apiWrapper";
import CardView from "./components/CardView";
import TableView from "./components/TableView";
import { showFail, showSuccess } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { PPRDUCT_SORT_BY } from "../../utils/constants";
import ProductFiltersContainer from "./components/ProductFiltersContainer/ProductFiltersContainer";

const ProductsPage = () => {
  const [view, setView] = useState("card");
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  // Filters
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isActive, setIsActive] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const debouncedSearch = useDebounce(searchText, 500);

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

  const geterateFetchProdcutsUrl = () => {
    const queryParams = new URLSearchParams();

    queryParams.append("pageNumber", currentPage);
    queryParams.append("pageSize", pageSize);

    if (debouncedSearch?.trim() !== "") {
      queryParams.append("search", debouncedSearch.trim());
    }

    queryParams.append("sortBy", sortBy || PPRDUCT_SORT_BY.NEWEST);

    if (categoryId !== "") {
      queryParams.append("categoryId", parseInt(categoryId));
    }

    if (brandId !== "") {
      queryParams.append("brandId", parseInt(brandId));
    }

    if (minPrice !== "") {
      queryParams.append("minPrice", parseFloat(minPrice));
    }

    if (maxPrice !== "") {
      queryParams.append("maxPrice", parseFloat(maxPrice));
    }

    if (brandId !== "") {
      queryParams.append("brandId", parseInt(brandId));
    }

    if (isActive !== "") {
      queryParams.append("isActive", isActive === "true");
    }

    return `products?${queryParams.toString()}`;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setErrorCode("");

      const url = geterateFetchProdcutsUrl();
      const result = await read(url);

      setProducts(result?.data?.items);
      setTotalProducts(result?.data?.total);

      console.log("data", data);
      console.log("total", data?.total);
    } catch (error) {
      setErrorCode(error?.code);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    currentPage,
    pageSize,
    sortBy,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    isActive,
    debouncedSearch,
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchInputChange = (e) => {
    console.log("search -> ", e.target.value);
    setSearchText(e.target.value);
    setSortBy(PPRDUCT_SORT_BY.NEWEST);
    setCurrentPage(1);
  };

  const handleSortByChange = (e) => {
    console.log("Sorting Term -> ", e.target.value);
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    console.log("min price -> ", e.target.value);
    setCurrentPage(1);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    console.log("max price -> ", e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
    console.log("category id -> ", e.target.value);
    setCurrentPage(1);
  };

  const handleBrandChange = (e) => {
    setBrandId(e.target.value);
    console.log("brand id -> ", e.target.value);
    setCurrentPage(1);
  };

  const handleIsActiveChange = (e) => {
    setIsActive(e.target.value);
    console.log("is active -> ", e.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSortBy("");
    setCategoryId("");
    setBrandId("");
    setMinPrice("");
    setMaxPrice("");
    setIsActive("");
    setCurrentPage(1);
  };

  function handleAdd() {
    navigate("/add-edit-product");
  }

  function handleEdit(product) {
    navigate(`/add-edit-product/${product?.id}`);
  }

  function handleDelete(product) {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  }

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

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

      <ProductFiltersContainer
        searchText={searchText}
        handleSearchInputChange={handleSearchInputChange}
        sortBy={sortBy}
        handleSortByChange={handleSortByChange}
        minPrice={minPrice}
        handleMinPriceChange={handleMinPriceChange}
        maxPrice={maxPrice}
        handleMaxPriceChange={handleMaxPriceChange}
        categoryId={categoryId}
        handleCategoryChange={handleCategoryChange}
        brandId={brandId}
        handleBrandChange={handleBrandChange}
        isActive={isActive}
        handleIsActiveChange={handleIsActiveChange}
        handleClearFilters={handleClearFilters}
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

          <Pagination
            currentPage={currentPage}
            totalItems={totalProducts}
            onPageChange={handlePageChange}
            pageSize={pageSize}
          />

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

          <Pagination
            currentPage={currentPage}
            totalItems={totalProducts}
            onPageChange={handlePageChange}
            pageSize={pageSize}
          />
        </>
      )}

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

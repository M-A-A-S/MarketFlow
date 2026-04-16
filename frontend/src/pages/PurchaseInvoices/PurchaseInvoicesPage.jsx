import CardView from "./components/CardView";
import TableView from "./components/TableView";
import PurchaseInvoiceFiltersContainer from "./components/PurchaseInvoiceFiltersContainer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { read, remove } from "../../api/apiWrapper";
import PageHeader from "../../components/PageHeader";
import { useLanguage } from "../../hooks/useLanguage";
import Button from "../../components/UI/Button";
import { Plus } from "lucide-react";
import SpinnerLoader from "../../components/UI/SpinnerLoader";
import ViewSwitcher from "../../components/UI/ViewSwitcher";
import Pagination from "../../components/UI/Pagination";
import ConfirmModal from "../../components/UI/ConfirmModal";
import { PURCHASE_INVOICE_STATUSES } from "../../utils/constants";

const PurchaseInvoicesPage = () => {
  const [view, setView] = useState("card");
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const [selectedPurchaseInvoice, setSelectedPurchaseInvoice] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  // Filters
  const [search, setSearch] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [status, setStatus] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const debouncedSearch = useDebounce(search, 500);

  const { translations } = useLanguage();

  const {
    title,
    description,
    empty_state,
    add_new,
    delete_success,
    delete_fail,
    delete_title,
    delete_message,
  } = translations.pages.purchase_invoice_page;

  const { delete_label, cancel } = translations.common;

  const generateFetchPurchaseInvoicesUrl = () => {
    const params = new URLSearchParams();

    params.append("pageNumber", currentPage);
    params.append("pageSize", pageSize);

    if (debouncedSearch) {
      params.append("search", debouncedSearch);
    }
    if (supplierId) {
      params.append("supplierId", supplierId);
    }
    if (status) {
      params.append("status", status);
    }
    if (minTotal) {
      params.append("minTotal", minTotal);
    }
    if (maxTotal) {
      params.append("maxTotal", maxTotal);
    }

    params.append("sortBy", sortBy || "Newest");

    return `purchase-invoices?${params.toString()}`;
  };

  const fetchPurchaseInvoices = async () => {
    try {
      setLoading(true);
      setErrorCode("");

      const url = generateFetchPurchaseInvoicesUrl();
      const result = await read(url);

      setPurchaseInvoices(result?.data?.items);
      setto(result?.data?.total);

      console.log("data", data);
      console.log("total", data?.total);
    } catch (error) {
      setErrorCode(error?.code);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseInvoices();
  }, [
    currentPage,
    pageSize,
    status,
    minTotal,
    maxTotal,
    sortBy,
    supplierId,
    debouncedSearch,
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchInputChange = (e) => {
    console.log("search -> ", e.target.value);
    setSearch(e.target.value);
    setSortBy(PPRDUCT_SORT_BY.NEWEST);
    setCurrentPage(1);
  };

  const handleSortByChange = (e) => {
    console.log("Sorting Term -> ", e.target.value);
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleMinTotalChange = (e) => {
    setMinTotal(e.target.value);
    console.log("min Total -> ", e.target.value);
    setCurrentPage(1);
  };

  const handleMaxTotalChange = (e) => {
    setMaxTotal(e.target.value);
    console.log("max Total -> ", e.target.value);
    setCurrentPage(1);
  };

  const handleSupplierIdChange = (e) => {
    setSupplierId(e.target.value);
    console.log("supplier id -> ", e.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSortBy("");
    setSupplierId("");
    setMaxTotal("");
    setMinTotal("");
    setCurrentPage(1);
  };

  function handleAdd() {
    navigate("/add-purchase-invoice");
  }

  function handleEdit(product) {
    navigate(`/edit-purchase-invoice/${product?.id}`);
  }

  function handleDelete(product) {
    setSelectedPurchaseInvoice(product);
    setIsDeleteModalOpen(true);
  }

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPurchaseInvoice(null);
  };

  async function deletePurchaseInvoice() {
    try {
      setActionLoading(true);
      const result = await remove(`purchase-invoices/${selectedProduct.id}`);

      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));

      showSuccess(result?.code, delete_success);
    } catch (err) {
      showFail(err?.code, delete_fail);
    } finally {
      setActionLoading(false);
      closeModal();
    }
  }

  const getFullName = (person) => {
    if (!person) {
      return "-";
    }

    return `${person.firstName} ${person.lastName}`;
  };

  const getStatusName = (value) => {
    const status = PURCHASE_INVOICE_STATUSES.find(
      (invoice) => invoice.value == value,
    );
    return translations.purchase_invoice_status?.[status?.key] ?? "-";
  };

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        leftSection={
          <Button onClick={handleAdd}>
            <Plus /> {add_new}
          </Button>
        }
      />

      <PurchaseInvoiceFiltersContainer
        search={search}
        handleSearchInputChange={handleSearchInputChange}
        sortBy={sortBy}
        handleSortByChange={handleSortByChange}
        minTotal={minTotal}
        handleMinTotalChange={handleMinTotalChange}
        maxTotal={maxTotal}
        handleMaxTotalChange={handleMaxTotalChange}
        supplierId={supplierId}
        handleSupplierIdChange={handleSupplierIdChange}
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
      ) : purchaseInvoices.length === 0 ? (
        <div className="grid place-items-center h-[60vh] text-gray-500">
          {empty_state}
        </div>
      ) : (
        <>
          <div className="my-2">
            <ViewSwitcher view={view} setView={setView} />
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            pageSize={pageSize}
          />

          {view === "card" && (
            <CardView
              purchaseInvoices={purchaseInvoices}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              getFullName={getFullName}
              getStatusName={getStatusName}
            />
          )}

          {view === "table" && (
            <TableView
              purchaseInvoices={purchaseInvoices}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}

          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            pageSize={pageSize}
          />
        </>
      )}

      <ConfirmModal
        show={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={deletePurchaseInvoice}
        title={delete_title}
        message={delete_message}
        cancelLabel={cancel}
        confirmLabel={delete_label}
        loading={actionLoading}
      />
    </div>
  );
};
export default PurchaseInvoicesPage;

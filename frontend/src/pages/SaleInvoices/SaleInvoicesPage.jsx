import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { useLanguage } from "../../hooks/useLanguage";
import { read } from "../../api/apiWrapper";
import { showFail, showSuccess } from "../../utils/utils";
import {
  SALE_INVOICE_SORT_BY,
  SALE_INVOICE_STATUSES,
} from "../../utils/constants";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/UI/Button";
import { Plus } from "lucide-react";
import SaleInvoiceFiltersContainer from "./components/SaleInvoiceFiltersContainer";
import CardView from "./components/CardView";
import TableView from "./components/TableView";
import ViewSwitcher from "../../components/UI/ViewSwitcher";
import SpinnerLoader from "../../components/UI/SpinnerLoader";
import Pagination from "../../components/UI/Pagination";
import ConfirmModal from "../../components/UI/ConfirmModal";

const SaleInvoicesPage = () => {
  const [view, setView] = useState("card");
  const [saleInvoices, setSaleInvoices] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorCode, setErrorCode] = useState("");

  const [selectedSaleInvoice, setSelectedSaleInvoice] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  // Filters
  const [search, setSearch] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [status, setStatus] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

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
  } = translations.pages.sale_invoice_page;

  const { delete_label, cancel } = translations.common;

  const generateFetchUrl = () => {
    const params = new URLSearchParams();

    params.append("pageNumber", currentPage);
    params.append("pageSize", pageSize);

    if (debouncedSearch) {
      params.append("search", debouncedSearch);
    }
    if (customerId) {
      params.append("customerId", customerId);
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

    params.append("sortBy", sortBy);

    return `sale-invoices?${params.toString()}`;
  };

  const fetchSaleInvoices = async () => {
    try {
      setLoading(true);
      setErrorCode("");

      const url = generateFetchUrl();
      const result = await read(url);

      setSaleInvoices(result?.data?.items || []);
      setTotalItems(result?.data?.total || 0);
    } catch (error) {
      setErrorCode(error?.code);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaleInvoices();
  }, [
    currentPage,
    pageSize,
    status,
    minTotal,
    maxTotal,
    sortBy,
    customerId,
    debouncedSearch,
  ]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleClearFilters = () => {
    setSearch("");
    setSortBy(SALE_INVOICE_SORT_BY.NEWEST);
    setCustomerId("");
    setMaxTotal("");
    setMinTotal("");
    setStatus("");
    setCurrentPage(1);
  };

  const handleAdd = () => navigate("/point-of-sale");
  const handleEdit = (item) => navigate(`/edit-sale-invoice/${item?.id}`);

  const handleDelete = (item) => {
    setSelectedSaleInvoice(item);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSaleInvoice(null);
  };

  const deleteSaleInvoice = async () => {
    try {
      setActionLoading(true);

      await remove(`sale-invoices/${selectedSaleInvoice.id}`);

      setSaleInvoices((prev) =>
        prev.filter((x) => x.id !== selectedSaleInvoice.id),
      );
      showSuccess(result?.code, delete_success);
      closeModal();
    } catch (err) {
      showFail(err?.code, delete_fail);
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusName = (value) => {
    const statusObj = SALE_INVOICE_STATUSES.find((x) => x.value == value);
    return translations.sale_invoice_status?.[statusObj?.key] ?? "-";
  };

  const getFullName = (person) => {
    if (!person) {
      return "-";
    }

    return `${person.firstName} ${person.lastName}`;
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

      <SaleInvoiceFiltersContainer
        search={search}
        setSearch={setSearch}
        customerId={customerId}
        setCustomerId={setCustomerId}
        status={status}
        setStatus={setStatus}
        minTotal={minTotal}
        setMinTotal={setMinTotal}
        maxTotal={maxTotal}
        setMaxTotal={setMaxTotal}
        sortBy={sortBy}
        setSortBy={setSortBy}
        handleClearFilters={handleClearFilters}
      />

      {loading ? (
        <div className="grid place-items-center h-[60vh]">
          <SpinnerLoader />
        </div>
      ) : errorCode ? (
        <div className="grid place-items-center h-[60vh] text-red-500">
          {translations.server_codes[errorCode]}
        </div>
      ) : saleInvoices.length === 0 ? (
        <div className="grid place-items-center h-[60vh] text-gray-500">
          {empty_state}
        </div>
      ) : (
        <>
          <ViewSwitcher view={view} setView={setView} />

          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />

          {view === "card" ? (
            <CardView
              saleInvoices={saleInvoices}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              getStatusName={getStatusName}
              getFullName={getFullName}
            />
          ) : (
            <TableView
              saleInvoices={saleInvoices}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              getStatusName={getStatusName}
              getFullName={getFullName}
            />
          )}

          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <ConfirmModal
        show={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={deleteSaleInvoice}
        title={delete_title}
        message={delete_message}
        cancelLabel={cancel}
        confirmLabel={delete_label}
        loading={actionLoading}
      />
    </div>
  );
};
export default SaleInvoicesPage;

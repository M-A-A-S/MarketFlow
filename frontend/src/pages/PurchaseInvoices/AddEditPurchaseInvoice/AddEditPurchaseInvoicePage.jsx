import React, { useState, useMemo, useEffect, useRef } from "react";
import PageHeader from "../../../components/PageHeader";
import { useLanguage } from "../../../hooks/useLanguage";
import { useDebounce } from "../../../hooks/useDebounce";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/UI/Button";
import SearchableSelect from "../../../components/UI/SearchableSelect";
import InvoiceInfo from "./InvoiceInfo";
import { create, read, update } from "../../../api/apiWrapper";
import PurchaseInvoiceItemsTable from "./ItemsTable";
import PaymentsSection from "./PaymentsSection/PaymentsSection";
import InvoiceHeader from "./InvoiceHeader";
import ProductSearch from "./ProductSearch";
import ItemsTable from "./ItemsTable";
import SummaryCard from "./SummaryCard/SummaryCard";
import { showFail, showSuccess } from "../../../utils/utils";
import { toast } from "../../../utils/toastHelper";
import { PURCHASE_INVOICE_STATUS } from "../../../utils/constants";
import { printPurchaseInvoice } from "../../../utils/printPurchaseInvoice";

const purchasePaymentData = {
  paymentMethod: "",
  amount: "",
  // paymentDate: "",
  paymentDate: new Date().toISOString(),
  transactionReference: "",
  notes: "",
};

const purchaseInvoiceItemData = {
  productId: "",
  quantity: "",
  unitPrice: "",
  total: "",
};

const purchaseInvoiceData = {
  // invoiceDate: "",
  // invoiceDate: new Date().toISOString(),
  invoiceDate: new Date().toISOString().slice(0, 16),
  status: PURCHASE_INVOICE_STATUS.DRAFT,
  invoiceNumber: "",
  supplierId: "",
  totalBeforeDiscount: "",
  discount: "",
  tax: "",
  netTotal: "",

  items: [],
  payments: [],
};

export default function AddEditPurchaseInvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(purchaseInvoiceData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [isModeUpdate, setIsModeUpdate] = useState(false);

  useEffect(() => {
    if (id) {
      setIsModeUpdate(true);
      fetchPurchaseInvoice(id);
    } else {
      setIsModeUpdate(false);
      setFormData(purchaseInvoiceData);
    }
  }, [id]);

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);

  const [items, setItems] = useState([]);
  const [payments, setPayments] = useState([]);

  // Search state

  const { translations, language } = useLanguage();

  const {
    supplier_error,
    product_required,
    add_success,
    add_fail,
    update_success,
    update_fail,
    fetch_fail,
    validation_fail,
  } = translations.pages.purchase_invoice_page;

  function calculateSubTotal() {
    return items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0,
    );
  }

  function calculateNetTotal() {
    return calculateSubTotal() - discountAmount + taxAmount;
  }

  function calculatePaidAmount() {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  }

  function calculateRemainingAmount() {
    return calculateNetTotal() - calculatePaidAmount();
  }

  const validateFormData = () => {
    let newErrors = {};

    if (!formData.supplierId) {
      newErrors.supplierId = supplier_error;
    }

    if (!items.length) {
      newErrors.amount = product_required;
    }

    if (!payments.length) {
      // newErrors.amount = "apayment Method is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePayload = () => {
    const payload = formData;

    payload.discount = discountAmount;
    payload.tax = taxAmount;
    payload.totalBeforeDiscount = calculateSubTotal();
    payload.netTotal = calculateNetTotal();

    payload.items = items.map((item) => ({
      productId: item?.product?.id,
      quantity: item.quantity,
    }));

    payload.payments = payments.map((payment) => ({
      // paymentMethod: payment.paymentMethod,
      paymentMethod: parseInt(payment.paymentMethod),
      amount: payment.amount,
      transactionReference: payment.transactionReference,
      notes: payment.notes,
    }));

    return payload;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!validateFormData()) {
      toast.error(validation_fail);
      return;
    }

    const payload = generatePayload();

    if (isModeUpdate) {
      updatePurchaseInvoice(payload);
    } else {
      addPurchaseInvoice(payload);
    }
  };

  function updateClientDataFromBackend(purchaseInvoice) {
    setFormData({
      invoiceDate:
        purchaseInvoice.purchaseInvoice ||
        new Date().toISOString().slice(0, 16),
      status: purchaseInvoice.status || "",
      invoiceNumber: purchaseInvoice.invoiceNumber || "",
      supplierId: purchaseInvoice.supplierId || "",
      totalBeforeDiscount: purchaseInvoice.totalBeforeDiscount || "",
      discount: purchaseInvoice.discount || "",
      tax: purchaseInvoice.tax || "",
      netTotal: purchaseInvoice.netTotal || "",
    });

    setDiscountAmount(purchaseInvoice.discount);
    setTaxAmount(purchaseInvoice.tax);

    setItems(purchaseInvoice.items);
    setPayments(purchaseInvoice.payments);
  }

  async function fetchPurchaseInvoice(id) {
    try {
      setLoading(true);
      const result = await read(`purchase-invoices/${id}`);
      console.log("result -> ", result);
      const purchaseInvoice = result.data;
      updateClientDataFromBackend(purchaseInvoice);
    } catch (error) {
      console.error("Fetch product error: ", error);
      showFail(error?.code, fetch_fail);
    } finally {
      setLoading(false);
    }
  }

  async function addPurchaseInvoice(payload) {
    try {
      setActionLoading(true);
      const result = await create("purchase-invoices", payload);
      showSuccess(result?.code, add_success);
      printPurchaseInvoice(result?.data, language);
      navigate("/purchase-invoices");

      console.log("data -> ", result.data);
    } catch (err) {
      showFail(err?.code, add_fail);
    } finally {
      setActionLoading(false);
    }
  }

  async function updatePurchaseInvoice(payload) {
    try {
      setActionLoading(true);
      const result = await update(`purchase-invoices/${id}`, payload);
      showSuccess(result?.code, update_success);
      // printPurchaseInvoice(result?.data, language);
      navigate("/purchase-invoices");
    } catch (err) {
      showFail(err?.code, update_fail);
    } finally {
      setActionLoading(false);
    }
  }

  function isInvoiceEditable(status, paidAmount = 0) {
    // return (
    //   status === PURCHASE_INVOICE_STATUS.DRAFT ||
    //   status === PURCHASE_INVOICE_STATUS.PENDING
    // );

    const lockedStatuses = [
      PURCHASE_INVOICE_STATUS.APPROVED,
      PURCHASE_INVOICE_STATUS.CANCELLED,
    ];

    // always locked if final status
    if (lockedStatuses.includes(status)) {
      return false;
    }

    // if invoice has ANY payment → lock editing
    // if (paidAmount > 0) {
    //   return false;
    // }
    if (paidAmount > 0 && isModeUpdate) {
      return false;
    }

    return true;
  }

  function canUpdateInvoice(status, isModeUpdate = false, paidAmount = 0) {
    // return isModeUpdate && isInvoiceEditable(status, paidAmount);
    return isInvoiceEditable(status, paidAmount);
  }

  function canEditPayments(status) {
    return (
      status === PURCHASE_INVOICE_STATUS.DRAFT ||
      status === PURCHASE_INVOICE_STATUS.PENDING
    );
  }

  return (
    <div>
      {/* Header */}
      <InvoiceHeader
        isModeUpdate={isModeUpdate}
        onSubmit={handleSubmit}
        loading={actionLoading}
        isEditable={canUpdateInvoice(
          formData.status,
          isModeUpdate,
          calculatePaidAmount(),
        )}
      />

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Invoice Details & Items */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <InvoiceInfo
            formData={formData}
            errors={errors}
            updateField={updateField}
            isModeUpdate={isModeUpdate}
            isEditable={canUpdateInvoice(
              formData.status,
              isModeUpdate,
              calculatePaidAmount(),
            )}
          />

          <ProductSearch
            setItems={setItems}
            isEditable={canUpdateInvoice(
              formData.status,
              isModeUpdate,
              calculatePaidAmount(),
            )}
          />

          <ItemsTable
            items={items}
            setItems={setItems}
            isEditable={canUpdateInvoice(
              formData.status,
              isModeUpdate,
              calculatePaidAmount(),
            )}
          />

          <PaymentsSection
            calculateRemainingAmount={calculateRemainingAmount}
            calculateNetTotal={calculateNetTotal}
            payments={payments}
            setPayments={setPayments}
            isModeUpdate={isModeUpdate}
            canEditPayments={canEditPayments(formData.status)}
          />
        </div>
        {/* Right Column: Summary & Totals */}
        <div className="space-y-6">
          <SummaryCard
            discountAmount={discountAmount}
            setDiscountAmount={setDiscountAmount}
            taxAmount={taxAmount}
            setTaxAmount={setTaxAmount}
            calculateSubTotal={calculateSubTotal}
            calculateNetTotal={calculateNetTotal}
            calculatePaidAmount={calculatePaidAmount}
            calculateRemainingAmount={calculateRemainingAmount}
            onSubmit={handleSubmit}
            loading={actionLoading}
            isEditable={canUpdateInvoice(
              formData.status,
              isModeUpdate,
              calculatePaidAmount(),
            )}
          />
        </div>
      </div>
    </div>
  );
}

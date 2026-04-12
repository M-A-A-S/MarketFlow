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
      paymentMethod: payment.paymentMethod,
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

  async function fetchPurchaseInvoice(id) {
    try {
      setLoading(true);
      const result = await read(`purchase-invoices/${id}`);
      console.log("result -> ", result);

      const product = result.data;

      setFormData({
        nameEn: product.nameEn || "",
        nameAr: product.nameAr || "",
        descriptionEn: product.descriptionEn || "",
        descriptionAr: product.descriptionAr || "",
        price: product.price !== null ? product.price : "",
        barcode: product.barcode || "",
        stockQuantity:
          product.stockQuantity !== null ? product.stockQuantity : "",
        categoryId: product.categoryId || "",
        brandId: product.brandId || "",
        isActive: product.isActive ?? true,
        imageUrl: product.imageUrl || "",
        imageFile: null,
        deleteImage: false,
      });
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
      navigate("/purchase-invoices");
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
      navigate("/purchase-invoices");
    } catch (err) {
      showFail(err?.code, update_fail);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <InvoiceHeader isModeUpdate={isModeUpdate} onSubmit={handleSubmit} />

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Invoice Details & Items */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <InvoiceInfo
            formData={formData}
            errors={errors}
            updateField={updateField}
            isModeUpdate={isModeUpdate}
          />

          <ProductSearch setItems={setItems} />

          <ItemsTable items={items} setItems={setItems} />

          <PaymentsSection
            calculateRemainingAmount={calculateRemainingAmount}
            calculateNetTotal={calculateNetTotal}
            payments={payments}
            setPayments={setPayments}
            isModeUpdate={isModeUpdate}
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
          />
        </div>
      </div>
    </div>
  );
}

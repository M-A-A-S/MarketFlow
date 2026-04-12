import React, { useState, useMemo, useEffect, useRef } from "react";
import PageHeader from "../../../components/PageHeader";
import { useLanguage } from "../../../hooks/useLanguage";
import { useDebounce } from "../../../hooks/useDebounce";
import { useParams } from "react-router-dom";
import Button from "../../../components/UI/Button";
import SearchableSelect from "../../../components/UI/SearchableSelect";
import InvoiceInfo from "./InvoiceInfo";
import { read } from "../../../api/apiWrapper";
import PurchaseInvoiceItemsTable from "./ItemsTable";
import PaymentsSection from "./PaymentsSection";
import InvoiceHeader from "./InvoiceHeader";
import ProductSearch from "./ProductSearch";
import ItemsTable from "./ItemsTable";
import SummaryCard from "./SummaryCard/SummaryCard";

const purchasePaymentData = {
  paymentMethod: "",
  amount: "",
  paymentDate: "",
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
  invoiceDate: "",
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

  const [formData, setFormData] = useState(purchaseInvoiceData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [isModeUpdate, setIsModeUpdate] = useState(false);

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // State matching entities
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [invoiceNumber, setInvoiceNumber] = useState(
    `PO-${Date.now().toString().slice(-8)}`,
  );
  const [supplierId, setSupplierId] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);

  const [items, setItems] = useState([]);
  const [payments, setPayments] = useState([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  const [products, setProducts] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { translations, language } = useLanguage();

  const {} = translations.pages.purchase_invoice_page;

  // Calculations
  // const subtotal = useMemo(
  //   () => items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0),
  //   [items],
  // );
  // const taxableAmount = subtotal - discountAmount;
  // const taxAmount = taxableAmount * (taxPercent / 100);
  // const netTotal = taxableAmount + taxAmount;
  // const netTotal = subtotal - discountAmount + taxAmount;
  // const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  // const remainingAmount = netTotal - paidAmount;

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
      newErrors.supplierId = "apayment Method is required";
    }

    if (!items.length) {
      newErrors.amount = "apayment Method is required";
    }

    if (!payments.length) {
      newErrors.amount = "apayment Method is required";
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

    return payload;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!validateFormData()) {
      return;
    }

    const payload = generatePayload();
  };

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
          />
        </div>
      </div>
    </div>
  );
}

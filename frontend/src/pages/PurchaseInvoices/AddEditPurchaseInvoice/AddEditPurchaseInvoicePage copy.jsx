import React, { useState, useMemo, useEffect, useRef } from "react";

// Mock Data
const MOCK_PRODUCTS = [
  { id: 1, name: "Organic Apple 1kg", sku: "APP-001", purchasePrice: 2.5 },
  { id: 2, name: "Fresh Milk 1L", sku: "MLK-100", purchasePrice: 1.2 },
  { id: 3, name: "Whole Wheat Bread", sku: "BRD-050", purchasePrice: 1.8 },
  { id: 4, name: "Eggs (12 Pack)", sku: "EGG-012", purchasePrice: 3.5 },
  { id: 5, name: "Orange Juice 1L", sku: "OJ-100", purchasePrice: 2.9 },
  { id: 6, name: "Cheddar Cheese Block", sku: "CHS-200", purchasePrice: 4.75 },
];

const MOCK_SUPPLIERS = [
  { id: 101, name: "Fresh Farms Co." },
  { id: 102, name: "Global Distributors Inc." },
  { id: 103, name: "Local Groceries Supply" },
];

const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Store Credit",
];

// Icons
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);
const AlertIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-orange-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

export default function AddEditPurchaseInvoicePage() {
  // State matching entities
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [invoiceNumber, setInvoiceNumber] = useState(
    `PO-${Date.now().toString().slice(-8)}`,
  );
  const [supplierId, setSupplierId] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);

  const [items, setItems] = useState([]);
  const [payments, setPayments] = useState([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search input
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0) {
      const filtered = MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(val.toLowerCase()) ||
          p.sku.toLowerCase().includes(val.toLowerCase()),
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  // Add item to cart
  const addItemToInvoice = (product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.productId === product.id);
      if (exists) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          quantity: 1,
          unitPrice: product.purchasePrice,
        },
      ];
    });
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  // Update item
  const updateItem = (index, field, value) => {
    const numVal = parseFloat(value) || 0;
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        return { ...item, [field]: numVal };
      }),
    );
  };

  // Remove item
  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Add payment
  const [newPayment, setNewPayment] = useState({
    method: PAYMENT_METHODS[0],
    amount: "",
    reference: "",
    notes: "",
  });
  const addPayment = () => {
    const amt = parseFloat(newPayment.amount);
    if (!amt || amt <= 0) return;
    setPayments((prev) => [
      ...prev,
      {
        id: Date.now(),
        paymentMethod: newPayment.method,
        amount: amt,
        paymentDate: new Date().toISOString(),
        transactionReference: newPayment.reference,
        notes: newPayment.notes,
      },
    ]);
    setNewPayment({
      method: PAYMENT_METHODS[0],
      amount: "",
      reference: "",
      notes: "",
    });
  };

  // Remove payment
  const removePayment = (id) =>
    setPayments((prev) => prev.filter((p) => p.id !== id));

  // Calculations
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0),
    [items],
  );
  const discountAmount = subtotal * (discountPercent / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (taxPercent / 100);
  const netTotal = taxableAmount + taxAmount;
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = netTotal - paidAmount;

  // Submit handler
  const handleSubmit = () => {
    const payload = {
      invoiceDate,
      invoiceNumber,
      supplierId,
      totalBeforeDiscount: subtotal,
      discount: discountPercent,
      tax: taxPercent,
      netTotal,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      payments: payments.map((p) => ({
        paymentMethod: p.paymentMethod,
        amount: p.amount,
        transactionReference: p.transactionReference,
        notes: p.notes,
      })),
    };
    console.log("Submitting Purchase Invoice:", payload);
    alert("Purchase Invoice Created Successfully! Check console for payload.");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Create Purchase Invoice
            </h1>
            <p className="text-sm text-gray-500">
              Add products, configure pricing, and record supplier payments
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm flex items-center gap-2 transition"
            >
              <CheckIcon /> Save Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Invoice Details & Items */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">
              Invoice Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Supplier
                </label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                >
                  <option value="">Select Supplier</option>
                  {MOCK_SUPPLIERS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Add Products
            </label>
            <div className="relative" ref={searchRef}>
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() =>
                  searchResults.length > 0 && setIsSearchFocused(true)
                }
                placeholder="Search by product name or SKU..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-lg"
              />
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute z-20 w-full mt-2 bg-white border rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => addItemToInvoice(p)}
                      className="px-4 py-3 hover:bg-indigo-50 cursor-pointer flex justify-between items-center border-b last:border-0 transition"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-indigo-600">
                          ${p.purchasePrice.toFixed(2)}
                        </span>
                        <p className="text-xs text-green-600">In Stock</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {items.length === 0 ? (
              <div className="p-10 text-center text-gray-400 border-2 border-dashed m-4 rounded-lg">
                No items added yet. Search for products above to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">
                        Product
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Total
                      </th>
                      <th className="px-4 py-3 text-center font-semibold w-16">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-500">{item.sku}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(idx, "quantity", e.target.value)
                            }
                            className="w-20 text-center border rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 outline-none"
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(idx, "unitPrice", e.target.value)
                            }
                            className="w-24 text-right border rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 outline-none"
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => removeItem(idx)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                          >
                            <TrashIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Record Payments
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 mb-4 bg-gray-50 p-4 rounded-lg">
              <select
                value={newPayment.method}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, method: e.target.value })
                }
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={newPayment.amount}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, amount: e.target.value })
                }
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="text"
                placeholder="Ref / Check #"
                value={newPayment.reference}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, reference: e.target.value })
                }
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="text"
                placeholder="Notes"
                value={newPayment.notes}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, notes: e.target.value })
                }
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                onClick={addPayment}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium transition flex items-center justify-center gap-1"
              >
                <PlusIcon /> Add
              </button>
            </div>

            {payments.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {p.paymentMethod}{" "}
                        <span className="text-gray-500 font-normal">
                          • ${p.amount.toFixed(2)}
                        </span>
                      </p>
                      {p.transactionReference && (
                        <p className="text-xs text-gray-500">
                          Ref: {p.transactionReference}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removePayment(p.id)}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded transition"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Summary & Totals */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Pricing Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Discount (%)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) =>
                      setDiscountPercent(parseFloat(e.target.value) || 0)
                    }
                    className="w-16 text-right border rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                  <span className="text-gray-500">%</span>
                </div>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                  <span>Discount Amount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tax (%)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxPercent}
                    onChange={(e) =>
                      setTaxPercent(parseFloat(e.target.value) || 0)
                    }
                    className="w-16 text-right border rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                  <span className="text-gray-500">%</span>
                </div>
              </div>
              {taxAmount > 0 && (
                <div className="flex justify-between text-sm bg-gray-50 px-2 py-1 rounded">
                  <span>Tax Amount</span>
                  <span>+${taxAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-lg font-bold text-gray-900">
                    Net Total
                  </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ${netTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Balance Card */}
            <div className="mt-6 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-indigo-800">
                  Total Paid
                </span>
                <span className="text-lg font-bold text-indigo-700">
                  ${paidAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-indigo-800">
                  Remaining Balance
                </span>
                <span
                  className={`text-lg font-bold ${remainingAmount > 0.01 ? "text-red-600" : "text-green-600"}`}
                >
                  ${Math.max(0, remainingAmount).toFixed(2)}
                </span>
              </div>
              {remainingAmount > 0.01 && (
                <div className="flex items-start gap-2 mt-3 bg-orange-50 p-2 rounded border border-orange-200">
                  <AlertIcon />
                  <p className="text-xs text-orange-700 mt-0.5">
                    This invoice has an unpaid balance of $
                    {remainingAmount.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-md transition flex justify-center items-center gap-2"
            >
              <CheckIcon /> Finalize & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

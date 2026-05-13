import React, { useEffect, useMemo, useState } from "react";

// 💜 Ultra Beautiful Purple POS System (With Payments)
// Features:
// - Purple premium UI
// - Category + Brand + Search filters
// - Beautiful product cards
// - Advanced cart (qty + delete improved)
// - Payment system (methods + saved payments)
// - LocalStorage persistence
// - Responsive layout

const mockCategories = [
  { id: 1, name: "Food" },
  { id: 2, name: "Drinks" },
  { id: 3, name: "Household" },
];

const mockBrands = [
  { id: 1, name: "Brand A" },
  { id: 2, name: "Brand B" },
  { id: 3, name: "Brand C" },
];

const paymentMethods = [
  { id: "cash", name: "Cash" },
  { id: "card", name: "Card" },
  { id: "mobile", name: "Mobile Payment" },
];

const mockProducts = [
  {
    id: 1,
    nameEn: "Rice 5kg",
    price: 10,
    stockQuantity: 20,
    barcode: "111",
    categoryId: 1,
    brandId: 1,
  },
  {
    id: 2,
    nameEn: "Sugar 1kg",
    price: 2,
    stockQuantity: 50,
    barcode: "222",
    categoryId: 1,
    brandId: 2,
  },
  {
    id: 3,
    nameEn: "Milk 1L",
    price: 1.5,
    stockQuantity: 100,
    barcode: "333",
    categoryId: 2,
    brandId: 2,
  },
  {
    id: 4,
    nameEn: "Soap",
    price: 3,
    stockQuantity: 80,
    barcode: "444",
    categoryId: 3,
    brandId: 3,
  },
];

const CART_KEY = "pos_cart";
const PAYMENTS_KEY = "pos_payments";

export default function PointOfSalePage() {
  const [products] = useState(mockProducts);
  const [categories] = useState(mockCategories);
  const [brands] = useState(mockBrands);

  const [cart, setCart] = useState([]);
  const [payments, setPayments] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    const savedPayments = localStorage.getItem(PAYMENTS_KEY);

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedPayments) setPayments(JSON.parse(savedPayments));
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
  }, [payments]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.nameEn.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === "all" || p.categoryId === Number(categoryFilter);
      const matchBrand =
        brandFilter === "all" || p.brandId === Number(brandFilter);
      return matchSearch && matchCategory && matchBrand;
    });
  }, [search, categoryFilter, brandFilter, products]);

  const addToCart = (product) => {
    const exists = cart.find((i) => i.id === product.id);
    if (exists) {
      setCart(
        cart.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i)),
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) return;
    setCart(cart.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const removeItem = (id) => setCart(cart.filter((i) => i.id !== id));

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const checkout = () => {
    if (cart.length === 0) return;

    const newPayment = {
      id: Date.now(),
      items: cart,
      total,
      method: paymentMethod,
      date: new Date().toISOString(),
    };

    setPayments([...payments, newPayment]);
    setCart([]);
    alert("Payment successful 💜");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white p-6 shadow-xl">
        <h1 className="text-3xl font-extrabold">💜 Purple POS System</h1>
        <p className="text-sm opacity-90">
          Beautiful Training POS with Payments
        </p>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* PRODUCTS */}
        <div className="lg:col-span-3 space-y-4">
          {/* FILTERS */}
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow flex flex-col md:flex-row gap-3 border border-purple-200">
            <input
              className="flex-1 border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="border p-3 rounded-xl"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="border p-3 rounded-xl"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
            >
              <option value="all">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRODUCTS */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition p-4 border border-purple-100"
              >
                <h3 className="font-bold text-purple-800">{p.nameEn}</h3>
                <p className="text-sm text-gray-500">
                  Stock: {p.stockQuantity}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-bold text-purple-700">
                    ${p.price}
                  </span>

                  <button
                    onClick={() => addToCart(p)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CART + PAYMENT */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-4 lg:sticky lg:top-4 border border-purple-200">
          <h2 className="text-xl font-bold text-purple-800">🛒 Cart</h2>

          <div className="space-y-3 max-h-[300px] overflow-auto mt-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-semibold text-purple-700 text-sm">
                    {item.nameEn}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${item.price} × {item.qty} ={" "}
                    <b>${(item.price * item.qty).toFixed(2)}</b>
                  </p>
                </div>

                {/* Quantity + Delete BEAUTIFUL */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
                  >
                    -
                  </button>

                  <span className="font-bold w-6 text-center">{item.qty}</span>

                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-7 h-7 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 ml-1"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* PAYMENT SECTION */}
          <div className="mt-4 border-t pt-3">
            <select
              className="w-full border p-2 rounded-xl mb-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {paymentMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-purple-700">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={checkout}
              className="mt-3 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl shadow-lg"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

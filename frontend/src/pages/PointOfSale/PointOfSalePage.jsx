import { useEffect, useState } from "react";
import { create, read } from "../../api/apiWrapper";
import Filters from "./components/Filters";
import { useDebounce } from "../../hooks/useDebounce";
import Products from "./components/Products";
import Cart from "./components/Cart";
import { PAYMENT_METHOD } from "../../utils/constants";
import { toast } from "../../utils/toastHelper";
import { useLanguage } from "../../hooks/useLanguage";
import { printSaleInvoice } from "../../utils/printSaleInvoice";
import { showFail, showSuccess } from "../../utils/utils";

const CART_KEY = "market_flow_cart";
const PAYMENTS_KEY = "market_flow_payments";

export default function PointOfSalePage() {
  const [cart, setCart] = useState({
    cartItems: [],
  });

  // Mass
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.CASH);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100;
  const debouncedSearch = useDebounce(search, 500);

  const { translations, language } = useLanguage();

  const {
    empty_cart,
    no_items,
    not_enough_payment_amount,
    add_success,
    add_fail,
  } = translations.pages.point_of_sale_page;

  const generateFetchProductsUrl = () => {
    const queryParams = new URLSearchParams();

    queryParams.append("pageNumber", currentPage);
    queryParams.append("pageSize", pageSize);

    if (debouncedSearch?.trim() !== "") {
      queryParams.append("search", debouncedSearch.trim());
    }

    if (categoryId !== "" && categoryId !== "all") {
      queryParams.append("categoryId", parseInt(categoryId));
    }

    if (brandId !== "" && brandId !== "all") {
      queryParams.append("brandId", parseInt(brandId));
    }

    return `products?${queryParams.toString()}`;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setErrorCode("");

      const url = generateFetchProductsUrl();
      const result = await read(url);

      setProducts(result?.data?.items);

      // console.log("data", data);
      // console.log("total", data?.total);
    } catch (error) {
      setErrorCode(error?.code);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId, brandId, debouncedSearch, currentPage]);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    const savedPayments = localStorage.getItem(PAYMENTS_KEY);

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedPayments) {
      setPayments(JSON.parse(savedPayments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
  }, [payments]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const cartItems = prevCart?.cartItems || [];

      const existsIndex = cartItems.findIndex(
        (item) => Number(item.productId) === Number(product.id),
      );

      let updatedItems;

      if (existsIndex !== -1) {
        updatedItems = cartItems.map((item, index) =>
          index === existsIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        updatedItems = [
          ...cartItems,
          {
            productId: product.id,
            product,
            quantity: 1,
          },
        ];
      }

      return {
        ...prevCart,
        cartItems: updatedItems,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      return;
    }

    setCart((prevCart) => ({
      ...prevCart,
      cartItems: prevCart.cartItems.map((item) =>
        Number(item.productId) === Number(productId)
          ? { ...item, quantity }
          : item,
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const removeItem = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      cartItems: prevCart.cartItems.filter(
        (item) => Number(item.productId) !== Number(productId),
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const total =
    cart?.cartItems?.reduce((sum, cartItem) => {
      const price = Number(cartItem?.product?.price || 0);
      const quantity = Number(cartItem?.quantity || 0);

      return sum + price * quantity;
    }, 0) || 0;

  const paid = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0,
  );
  const remaining = total - paid;

  const validateFormData = () => {
    if (!cart.cartItems.length) {
      toast.error(no_items);
      return false;
    }

    if (!payments.length || remaining > 0) {
      toast.error(not_enough_payment_amount);
      return false;
    }

    return true;
  };

  const generatePayload = () => {
    // const payload = formData;

    // payload.discount = discountAmount;
    // payload.tax = taxAmount;
    // payload.totalBeforeDiscount = calculateSubTotal();
    // payload.netTotal = calculateNetTotal();

    const payload = {};

    payload.items = cart?.cartItems
      ?.filter((item) => item.productId && Number(item.quantity || 0) > 0)
      ?.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity || 0),
      }));

    payload.payments = payments
      .filter(
        (payment) => payment?.paymentMethod && Number(payment?.amount || 0) > 0,
      )
      .map((payment) => ({
        // paymentMethod: payment.paymentMethod,
        paymentMethod: parseInt(payment.paymentMethod),
        amount: Number(payment.amount || 0),
        transactionReference: payment.transactionReference?.trim() || null,
        // notes: payment.notes,
      }));

    console.log("payload -> ", payload);
    console.log("payments -> ", payments);
    console.log("cart -> ", cart?.cartItems);

    return payload;
  };

  const checkout = (e) => {
    e?.preventDefault();

    if (!validateFormData()) {
      return;
    }

    const payload = generatePayload();

    addSaleInvoice(payload);
  };

  async function addSaleInvoice(payload) {
    try {
      setActionLoading(true);
      const result = await create("sale-invoices", payload);
      showSuccess(result?.code, add_success);
      printSaleInvoice(result?.data, language);

      setCart({ cartItems: [] });
      setPayments([]);

      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(PAYMENTS_KEY);

      console.log("data -> ", result.data);
    } catch (err) {
      showFail(err?.code, add_fail);
      console.error("Error creating sale invoice", err);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* PRODUCTS */}
        <div className="lg:col-span-3 space-y-4">
          {/* FILTERS */}
          <Filters
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            brandId={brandId}
            setBrandId={setBrandId}
            search={search}
            setSearch={setSearch}
          />
          {/* PRODUCTS */}
          <Products products={products} addToCart={addToCart} />
        </div>

        {/* CART + PAYMENT */}
        <Cart
          cart={cart}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          total={total}
          checkout={checkout}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          payments={payments}
          setPayments={setPayments}
          paid={paid}
          remaining={remaining}
        />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import SearchableSelect from "../../../components/UI/SearchableSelect";
import { useDebounce } from "../../../hooks/useDebounce";
import { read } from "../../../api/apiWrapper";
import { useLanguage } from "../../../hooks/useLanguage";

const ProductSearch = ({ setItems, isEditable }) => {
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const { translations, language } = useLanguage();

  const { product_title, product_search } =
    translations.pages.purchase_invoice_page;

  const debouncedSearch = useDebounce(searchText);

  async function fetchProducts() {
    try {
      setLoadingProducts(true);
      const result = await read(`products/dropdown?search=${debouncedSearch}`);
      console.log("result -> ", result);
      setProducts(result?.data || []);
    } catch (error) {
      setProducts([]);
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function handleProductSelect(product) {
    console.log("product -> ", product);
    addItemToInvoice(product);
  }

  const addItemToInvoice = (product) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          product: product,
          quantity: 1,
        },
      ];
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch]);

  return (
    <SearchableSelect
      disabled={!isEditable}
      options={products}
      inputValue={searchText}
      label={product_title}
      showLabel={true}
      onInputChange={setSearchText}
      placeholder={product_search}
      onSelect={handleProductSelect}
      loading={loadingProducts}
      valueKey="id"
      labelKey={language == "en" ? "nameEn" : "nameAr"}
      //   disabled={isModeUpdate}
    />
  );
};
export default ProductSearch;

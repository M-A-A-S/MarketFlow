import { useEffect, useState } from "react";
import SearchableSelect from "../../../components/UI/SearchableSelect";
import { useDebounce } from "../../../hooks/useDebounce";
import { read } from "../../../api/apiWrapper";
import { useLanguage } from "../../../hooks/useLanguage";
import { Trash, Trash2 } from "lucide-react";

const CustomerSearch = ({ customer, setCustomer, isEditable = true }) => {
  const [searchText, setSearchText] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const { translations, language } = useLanguage();

  const { customer_title, customer_search } =
    translations.pages.point_of_sale_page;

  const debouncedSearch = useDebounce(searchText);

  async function fetchCustomers() {
    try {
      setLoadingCustomers(true);

      const result = await read(`customers/dropdown?search=${debouncedSearch}`);

      console.log("customers -> ", result);

      setCustomers(result?.data || []);
    } catch (error) {
      setCustomers([]);

      console.error("Failed to fetch customers:", error);
    } finally {
      setLoadingCustomers(false);
    }
  }

  async function handleCustomerSelect(selectedCustomer) {
    console.log("selected customer -> ", selectedCustomer);

    setCustomer(selectedCustomer);
  }

  useEffect(() => {
    fetchCustomers();
  }, [debouncedSearch]);

  return (
    <div className="space-y-2">
      <SearchableSelect
        disabled={!isEditable}
        options={customers}
        inputValue={searchText}
        label={customer_title}
        showLabel={true}
        onInputChange={setSearchText}
        placeholder={customer_search}
        onSelect={handleCustomerSelect}
        loading={loadingCustomers}
        valueKey="id"
        labelKey={"phone"}
        renderLabelOption={(item) =>
          `${item?.firstName || ""} ${item?.lastName || ""} (${item?.phone || "No Phone"})`
        }
      />
    </div>
  );
};

export default CustomerSearch;

import { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { Link, useNavigate, useParams } from "react-router-dom";
import { showFail, showSuccess } from "../../utils/utils";
import { create, read, update } from "../../api/apiWrapper";
import PageHeader from "../../components/PageHeader";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

const initialFormState = {
  firstName: "",
  lastName: "",
  phone: "",
};

const AddEditCustomerPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormState);

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [isModeUpdate, setIsModeUpdate] = useState(false);

  const { translations, language } = useLanguage();

  const {
    add_new_customer,
    edit_customer,

    first_name,
    first_name_placeholder,
    first_name_error,

    last_name,
    last_name_placeholder,
    last_name_error,

    phone,
    phone_placeholder,
    phone_error,
    invalid_phone_error,

    add_customer_success,
    add_customer_fail,

    update_customer_success,
    update_customer_fail,
  } = translations.pages.customers_page;

  const { save, back } = translations.common;

  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    setErrors({});

    if (id) {
      setIsModeUpdate(true);
      fetchCustomer(id);
    } else {
      setIsModeUpdate(false);
      setFormData(initialFormState);
    }
  }, [id]);

  const validateCustomerFormData = () => {
    let temp = {};

    if (!formData.firstName.trim()) {
      temp.firstName = "first_name_error";
    }

    if (!formData.lastName.trim()) {
      temp.lastName = "last_name_error";
    }

    const sudanPhoneRegex = /^(?:\+249|0)(?:[1-9][0-9])[0-9]{7}$/;

    if (!formData.phone.trim()) {
      temp.phone = "phone_error";
    } else if (!sudanPhoneRegex.test(formData.phone.trim())) {
      temp.phone = "invalid_phone_error";
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  async function fetchCustomer(id) {
    try {
      setLoading(true);
      const result = await read(`customers/${id}`);
      const customer = result?.data;
      setFormData({
        firstName: customer?.firstName || "",
        lastName: customer?.lastName || "",
        phone: customer?.phone || "",
      });
    } catch (err) {
      showFail(err?.code);
      console.error("error -> ", err);
    } finally {
      setLoading(false);
    }
  }

  const generateCustomerPayload = () => {
    return {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
    };
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateCustomerFormData()) {
      return;
    }

    const payload = generateCustomerPayload();

    if (isModeUpdate) {
      updateCustomer(payload);
    } else {
      addCustomer(payload);
    }
  };

  async function addCustomer(payload) {
    try {
      setActionLoading(true);
      const result = await create("customers", payload);
      showSuccess(result?.code, add_customer_success);
      navigate("/customers");
    } catch (err) {
      showFail(err?.code, add_customer_fail);
    } finally {
      setActionLoading(false);
    }
  }

  async function updateCustomer(payload) {
    try {
      setActionLoading(true);
      const result = await update(`customers/${id}`, payload);
      showSuccess(result?.code, update_customer_success);
      navigate("/customers");
    } catch (err) {
      showFail(err?.code, update_customer_fail);
    } finally {
      setActionLoading(false);
    }
  }

  const getErrorMessage = (field) => {
    return errors[field]
      ? translations.pages.customers_page[errors[field]]
      : "";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <Link to="/customers">
              {language === "en" ? <ArrowLeft /> : <ArrowRight />}
            </Link>

            {id ? edit_customer : add_new_customer}
          </div>
        }
      />

      <form
        className="
          bg-white dark:bg-slate-800
          p-6 rounded-xl shadow
          grid grid-cols-1 md:grid-cols-2 gap-4
        "
        onSubmit={handleSubmit}
      >
        <Input
          label={first_name}
          value={formData.firstName}
          errorMessage={getErrorMessage("firstName")}
          placeholder={first_name_placeholder}
          showLabel
          onChange={(e) => updateField("firstName", e.target.value)}
        />

        <Input
          label={last_name}
          value={formData.lastName}
          errorMessage={getErrorMessage("lastName")}
          placeholder={last_name_placeholder}
          showLabel
          onChange={(e) => updateField("lastName", e.target.value)}
        />

        <Input
          label={phone}
          value={formData.phone}
          errorMessage={getErrorMessage("phone")}
          placeholder={phone_placeholder}
          showLabel
          onChange={(e) => updateField("phone", e.target.value)}
        />

        {/* ACTIONS */}
        <div className="md:col-span-2 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate("/customers")}>
            {back}
          </Button>

          <Button type="submit" loading={actionLoading || loading}>
            {save}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default AddEditCustomerPage;

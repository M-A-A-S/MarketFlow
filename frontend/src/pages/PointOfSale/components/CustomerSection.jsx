import { useState } from "react";
import { create } from "../../../api/apiWrapper";

import CustomerSearch from "./CustomerSearch";
import CreateCustomerForm from "./CreateCustomerForm";

import { toast } from "../../../utils/toastHelper";
import { useLanguage } from "../../../hooks/useLanguage";
import { showFail, showSuccess } from "../../../utils/utils";
import Button from "../../../components/UI/Button";
import { Plus } from "lucide-react";

const initialFormState = {
  firstName: "",
  lastName: "",
  phone: "",
};

const CustomerSection = ({
  customer,
  setCustomer,
  actionLoading,
  setActionLoading,
}) => {
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

  const [newCustomer, setNewCustomer] = useState(initialFormState);

  const [errors, setErrors] = useState({});

  const { translations } = useLanguage();

  const {
    customer: customer_title,
    add_customer_title,
    first_name_error,
    last_name_error,
    phone_error,
    invalid_phone_error,
    add_customer_success,
    add_customer_fail,
  } = translations.pages.point_of_sale_page;

  const validateCustomerData = () => {
    let newErrors = {};

    if (!newCustomer.firstName.trim()) {
      newErrors.firstName = first_name_error;
    }

    if (!newCustomer.lastName.trim()) {
      newErrors.lastName = last_name_error;
    }

    const sudanPhoneRegex = /^(?:\+249|0)(?:[1-9][0-9])[0-9]{7}$/;

    if (!newCustomer.phone.trim()) {
      newErrors.phone = phone_error;
    } else if (!sudanPhoneRegex.test(newCustomer.phone.trim())) {
      newErrors.phone = invalid_phone_error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleAddCustomer(e) {
    e?.preventDefault();
    setNewCustomer(initialFormState);
    setShowNewCustomerForm(true);
  }

  function handleCancelCustomer(e) {
    e?.preventDefault();
    setNewCustomer(initialFormState);
    setShowNewCustomerForm(false);
  }

  const generateCustomerPayload = () => {
    const payload = {
      firstName: newCustomer.firstName.trim(),
      lastName: newCustomer.lastName.trim(),
      phone: newCustomer.phone.trim(),
    };
    return payload;
  };

  function handleCreateCustomer(e) {
    e?.preventDefault();

    if (!validateCustomerData()) {
      return;
    }

    const payload = generateCustomerPayload();

    addCustomer(payload);
  }

  async function addCustomer(payload) {
    try {
      setActionLoading(true);
      const result = await create("customers", payload);
      const createdCustomer = result?.data;
      setCustomer(createdCustomer);
      setShowNewCustomerForm(false);
      setNewCustomer(initialFormState);
      showSuccess(result?.code, add_customer_success);
      toast.success(add_customer_success);
    } catch (err) {
      console.error("Error creating customer", err);
      showFail(err?.code, add_customer_fail);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">{customer_title}</h2>

        <Button onClick={handleAddCustomer}>
          <Plus /> {add_customer_title}
        </Button>
      </div>

      {/* SEARCH */}
      <CustomerSearch
        customer={customer}
        setCustomer={setCustomer}
        isEditable={!actionLoading}
      />

      {/* CREATE FORM */}
      {showNewCustomerForm && (
        <CreateCustomerForm
          newCustomer={newCustomer}
          setNewCustomer={setNewCustomer}
          createCustomer={handleCreateCustomer}
          onCancel={handleCancelCustomer}
          errors={errors}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default CustomerSection;

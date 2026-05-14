import { useState } from "react";
import { create, update } from "../../../api/apiWrapper";

import CustomerSearch from "./CustomerSearch";
import CustomerForm from "./CustomerForm";

import { toast } from "../../../utils/toastHelper";
import { useLanguage } from "../../../hooks/useLanguage";
import { showFail, showSuccess } from "../../../utils/utils";
import Button from "../../../components/UI/Button";
import { Plus, Trash2 } from "lucide-react";
import SelectedCustomerCard from "./SelectedCustomerCard";

const initialFormState = {
  id: "",
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
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const [customerFormData, setCustomerFormData] = useState(initialFormState);

  const [errors, setErrors] = useState({});

  const [isEditMode, setIsEditMode] = useState(false);

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
    update_customer_success,
    update_customer_fail,
  } = translations.pages.point_of_sale_page;

  const validateCustomerData = () => {
    let newErrors = {};

    if (!customerFormData.firstName.trim()) {
      newErrors.firstName = first_name_error;
    }

    if (!customerFormData.lastName.trim()) {
      newErrors.lastName = last_name_error;
    }

    const sudanPhoneRegex = /^(?:\+249|0)(?:[1-9][0-9])[0-9]{7}$/;

    if (!customerFormData.phone.trim()) {
      newErrors.phone = phone_error;
    } else if (!sudanPhoneRegex.test(customerFormData.phone.trim())) {
      newErrors.phone = invalid_phone_error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleAddCustomer(e) {
    e?.preventDefault();
    setIsEditMode(false);
    setShowCustomerForm(true);
    setCustomerFormData(initialFormState);
  }

  function handleEditCustomer(e) {
    e?.preventDefault();
    setIsEditMode(true);
    setShowCustomerForm(true);
    setCustomerFormData({
      id: customer?.id || "",
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      phone: customer?.phone || "",
    });
  }

  function handleCancelCustomer(e) {
    e?.preventDefault();
    setCustomerFormData(initialFormState);
    setErrors({});
    setShowCustomerForm(false);
  }

  const generateCustomerPayload = () => {
    const payload = {
      firstName: customerFormData.firstName.trim(),
      lastName: customerFormData.lastName.trim(),
      phone: customerFormData.phone.trim(),
    };
    return payload;
  };

  function handleSaveCustomer(e) {
    e?.preventDefault();

    if (!validateCustomerData()) {
      return;
    }

    const payload = generateCustomerPayload();

    if (isEditMode) {
      updateCustomer(payload);
    } else {
      addCustomer(payload);
    }
  }

  async function addCustomer(payload) {
    try {
      setActionLoading(true);
      const result = await create("customers", payload);
      const createdCustomer = result?.data;
      setCustomer(createdCustomer);
      setShowCustomerForm(false);
      setCustomerFormData(initialFormState);
      showSuccess(result?.code, add_customer_success);
    } catch (err) {
      console.error("Error creating customer", err);
      showFail(err?.code, add_customer_fail);
    } finally {
      setActionLoading(false);
    }
  }

  async function updateCustomer(payload) {
    try {
      setActionLoading(true);
      const result = await update(`customers/${customer.id}`, payload);
      const updatedCustomer = result?.data;
      setCustomer(updatedCustomer);
      setShowCustomerForm(false);
      setIsEditMode(false);
      setCustomerFormData(initialFormState);
      showSuccess(result?.code, update_customer_success);
    } catch (err) {
      console.error(err);

      showFail(err?.code, update_customer_fail);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 space-y-4">
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

      {customer && (
        <SelectedCustomerCard
          customer={customer}
          setCustomer={setCustomer}
          onEdit={handleEditCustomer}
        />
      )}

      {/* CREATE FORM */}
      {showCustomerForm && (
        <CustomerForm
          customerFormData={customerFormData}
          setCustomerFormData={setCustomerFormData}
          onSubmit={handleSaveCustomer}
          onCancel={handleCancelCustomer}
          errors={errors}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default CustomerSection;

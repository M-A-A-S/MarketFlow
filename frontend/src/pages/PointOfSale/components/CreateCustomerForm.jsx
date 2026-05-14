import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import { useLanguage } from "../../../hooks/useLanguage";

const CreateCustomerForm = ({
  newCustomer,
  setNewCustomer,
  createCustomer,
  errors,
  onCancel,
  actionLoading,
}) => {
  const { translations } = useLanguage();

  const {
    first_name_label,
    last_name_label,
    phone_label,
    address_label,
    first_name_placeholder,
    last_name_placeholder,
    phone_placeholder,
    address_placeholder,
    save_customer,
  } = translations.pages.point_of_sale_page;

  const { cancel } = translations.common;

  const updateField = (name, value) => {
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
      <Input
        label={first_name_label}
        value={newCustomer.firstName}
        errorMessage={errors.firstName}
        placeholder={first_name_placeholder}
        showLabel
        onChange={(e) => updateField("firstName", e.target.value)}
      />

      <Input
        label={last_name_label}
        value={newCustomer.lastName}
        errorMessage={errors.lastName}
        placeholder={last_name_placeholder}
        showLabel
        onChange={(e) => updateField("lastName", e.target.value)}
      />

      <Input
        label={phone_label}
        value={newCustomer.phone}
        errorMessage={errors.phone}
        placeholder={phone_placeholder}
        showLabel
        onChange={(e) => updateField("phone", e.target.value)}
      />

      <div className="flex items-center gap-2 justify-end">
        <Button disabled={actionLoading} onClick={onCancel}>
          {cancel}
        </Button>
        <Button type="submit" disabled={actionLoading} onClick={createCustomer}>
          {save_customer}
        </Button>
      </div>
    </form>
  );
};

export default CreateCustomerForm;

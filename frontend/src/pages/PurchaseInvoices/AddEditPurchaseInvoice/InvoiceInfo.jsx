import { useLanguage } from "../../../hooks/useLanguage";
import SupplierSelect from "../../../components/Selects/SupplierSelect";
import Input from "../../../components/UI/Input";

const InvoiceInfo = ({
  formData,
  updateField,
  isModeUpdate,
  errors,
  isEditable,
}) => {
  const { translations } = useLanguage();

  const { add_invoice_title, invoice_no, invoice_date, supplier } =
    translations.pages.purchase_invoice_page;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <h2 className="text-lg font-semibold mb-4 border-b dark:border-b-gray-700 pb-2">
        {add_invoice_title}
      </h2>

      <div className="grid items-center grid-cols-1 sm:grid-cols-3 gap-4">
        {isModeUpdate && (
          <Input
            readOnly
            disabled
            showLabel={true}
            label={invoice_no}
            value={formData.invoiceNumber}
            onChange={(e) => updateField("invoiceNumber", e.target.value)}
            errorMessage={errors.invoiceNumber}
          />
        )}

        <Input
          // type="date"
          readOnly={!isEditable}
          disabled={!isEditable}
          type="datetime-local"
          showLabel={true}
          label={invoice_date}
          value={formData.invoiceDate}
          onChange={(e) => updateField("invoiceDate", e.target.value)}
          errorMessage={errors.invoiceDate}
        />

        <SupplierSelect
          readOnly={!isEditable}
          disabled={!isEditable}
          showLabel={true}
          label={supplier}
          value={formData.supplierId}
          onChange={(e) => updateField("supplierId", e.target.value)}
          errorMessage={errors.supplierId}
        />
      </div>
    </div>
  );
};
export default InvoiceInfo;

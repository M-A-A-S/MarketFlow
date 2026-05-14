import { Pen, Pencil, Trash2 } from "lucide-react";

const SelectedCustomerCard = ({ customer, setCustomer, onEdit }) => {
  return (
    <div className="border dark:border-slate-700 rounded-lg p-3 bg-gray-50 dark:bg-slate-800 flex items-center justify-between">
      <div>
        <div className="font-medium">
          {customer?.firstName && customer?.lastName
            ? `${customer.firstName} ${customer.lastName}`
            : customer?.phone || "Customer"}
        </div>

        {customer?.phone && (
          <div className="text-sm text-gray-500">{customer.phone}</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setCustomer(null)}
          className="text-red-500 hover:text-red-600 text-sm"
        >
          <Trash2 size={16} />
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="text-green-500 hover:text-green-600 text-sm ml-2"
        >
          <Pencil size={16} />
        </button>
      </div>
    </div>
  );
};
export default SelectedCustomerCard;

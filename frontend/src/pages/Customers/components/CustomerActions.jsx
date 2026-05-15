import { Pencil, Trash2 } from "lucide-react";
import { safeCall } from "../../../utils/utils";

const CustomerActions = ({
  customer,
  handleEditCustomer,
  handleDeleteCustomer,
  className,
}) => {
  const onEdit = safeCall(handleEditCustomer);
  const onDelete = safeCall(handleDeleteCustomer);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* EDIT */}
      <button
        onClick={() => onEdit(customer)}
        className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900 transition"
      >
        <Pencil size={18} />
      </button>

      {/* DELETE */}
      <button
        onClick={() => onDelete(customer)}
        className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
export default CustomerActions;

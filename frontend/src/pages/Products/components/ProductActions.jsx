import { Pencil, Trash2 } from "lucide-react";
import { safeCall } from "../../../utils/utils";

const ProductActions = ({ handleEdit, handleDelete, className, product }) => {
  const onEdit = safeCall(handleEdit);
  const onDelete = safeCall(handleDelete);

  return (
    <div className={`flex items-center justify-end gap-3 ${className}`}>
      <button
        onClick={() => onEdit(product)}
        className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900 transition"
      >
        <Pencil size={18} />
      </button>

      <button
        onClick={() => onDelete(product)}
        className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
export default ProductActions;

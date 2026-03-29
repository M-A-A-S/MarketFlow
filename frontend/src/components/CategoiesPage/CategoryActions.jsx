import { Pencil, Trash2 } from "lucide-react";
import { safeCall } from "../../utils/utils";

const CategoryActions = ({
  handleEditCategory,
  handleDeleteCategory,
  className,
  category,
}) => {
  const onEdit = safeCall(handleEditCategory);
  const onDelete = safeCall(handleDeleteCategory);

  return (
    <div className={`flex items-center justify-end gap-3 ${className}`}>
      <button
        onClick={() => onEdit(category)}
        className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900 transition"
      >
        <Pencil size={18} />
      </button>

      <button
        onClick={() => onDelete(category)}
        className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
export default CategoryActions;

import { Layers, Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { safeCall } from "../../utils/utils";
import CategoryActions from "./CategoryActions";

const CategoryCard = ({
  category,
  handleDeleteCategory,
  handleEditCategory,
}) => {
  const { language } = useLanguage();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition border border-transparent p-3 flex flex-col">
      {/* Image */}
      {category.imageUrl && (
        <div className="w-full h-36 rounded-lg overflow-hidden mb-3">
          <img
            src={category.imageUrl}
            alt={language === "en" ? category.nameEn : category.nameAr}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="flex items-center gap-2 font-semibold text-lg">
        <span className="flex items-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-purple-500">
          <Layers size={18} />
        </span>
        {language === "en" ? category.nameEn : category.nameAr}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm text-start text-gray-600 dark:text-gray-300">
        {language === "en" ? category.descriptionEn : category.descriptionAr}
      </p>

      {/* Actions */}
      <CategoryActions
        handleEditCategory={handleEditCategory}
        handleDeleteCategory={handleDeleteCategory}
        category={category}
        className={"mt-4 pt-4 border-t border-gray-100"}
      />
    </div>
  );
};

export default CategoryCard;

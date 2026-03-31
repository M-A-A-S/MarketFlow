import { Tag } from "lucide-react";
import { useLanguage } from "../../../hooks/useLanguage";
import BrandActions from "./BrandActions";

const BrandCard = ({ brand, handleDelete, handleEdit }) => {
  const { language } = useLanguage();

  const name = language === "en" ? brand.nameEn : brand.nameAr;
  const description =
    language === "en" ? brand.descriptionEn : brand.descriptionAr;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition border border-transparent p-3 flex flex-col">
      {/* Image */}
      {brand.imageUrl && (
        <div className="w-full h-36 rounded-lg overflow-hidden mb-3">
          <img
            src={brand.imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="flex items-center gap-2 font-semibold text-lg">
        <span className="flex items-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-indigo-500">
          <Tag size={18} />
        </span>
        {name}
      </h3>

      {/* Description */}
      {description && (
        <p className="mt-2 text-sm text-start text-gray-600 dark:text-gray-300">
          {description}
        </p>
      )}

      {/* Website */}
      {brand.websiteUrl && (
        <a
          href={brand.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-sm text-blue-500 hover:underline break-all"
        >
          {brand.websiteUrl}
        </a>
      )}

      {/* Actions */}
      <BrandActions
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        brand={brand}
        className="mt-4 pt-4 border-t border-gray-100"
      />
    </div>
  );
};

export default BrandCard;

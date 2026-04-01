import { User, Phone, Calendar, Trash2, Edit2 } from "lucide-react";
import { useLanguage } from "../../../hooks/useLanguage";
import SupplierActions from "./SupplierActions"; // similar to BrandActions
import { formatDate } from "../../../utils/utils";

const SupplierCard = ({
  supplier,
  handleEditSupplier,
  handleDeleteSupplier,
}) => {
  const { language } = useLanguage();
  const person = supplier?.person;

  if (!person) return null;

  const fullName = `${person.firstName} ${person.lastName}`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition border border-transparent p-4 flex flex-col">
      {/* Image */}
      <div className="w-full h-36 rounded-lg overflow-hidden mb-3 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
        {person.imageUrl ? (
          <img
            src={person.imageUrl}
            alt={fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={48} className="text-gray-400" />
        )}
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <User size={20} className="text-purple-500" />
        {fullName}
      </h3>

      {/* Phone */}
      {person.phone && (
        <p className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-1 gap-2">
          <Phone size={16} className="text-gray-500" />
          {person.phone}
        </p>
      )}

      {/* Date of Birth */}
      {person.dateOfBirth && (
        <p className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-2 gap-2">
          <Calendar size={16} className="text-gray-500" />
          {formatDate(person.dateOfBirth)}
        </p>
      )}

      {/* Actions */}
      <SupplierActions
        handleEditSupplier={handleEditSupplier}
        handleDeleteSupplier={handleDeleteSupplier}
        supplier={supplier}
        className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2"
      />
    </div>
  );
};

export default SupplierCard;

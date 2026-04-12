import { Trash2 } from "lucide-react";
import { useLanguage } from "../../../hooks/useLanguage";
import { formatMoney } from "../../../utils/utils";
import Input from "../../../components/UI/Input";

const ItemsTable = ({ items = [], setItems }) => {
  const { translations, language } = useLanguage();

  const {
    product_empty,
    table_product,
    table_qty,
    table_price,
    table_total,
    table_action,
  } = translations.pages.purchase_invoice_page;

  // Update item
  const updateItem = (index, field, value) => {
    const numVal = parseFloat(value) || 0;
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        return { ...item, [field]: numVal };
      }),
    );
  };

  // Remove item
  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {items.length === 0 ? (
        <div className="p-10 text-center text-gray-400 border-2 border-dashed m-4 rounded-lg">
          {product_empty}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800  dark:text-gray-300 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">
                  {table_product}
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  {table_qty}
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  {table_price}
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  {table_total}
                </th>
                <th className="px-4 py-3 text-center font-semibold w-16">
                  {table_action}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {items.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {language == "en"
                        ? item?.product?.nameEn
                        : item?.product?.nameAr}
                    </p>
                    {/* <p className="text-xs text-gray-500">{item.sku}</p> */}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(idx, "quantity", e.target.value)
                      }
                      className="w-20"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Input
                      type="number"
                      min="0"
                      readOnly
                      value={item?.product?.price}
                      className="w-24"
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-medium ">
                    ${formatMoney(item.quantity * item?.product?.price)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => removeItem(idx)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default ItemsTable;

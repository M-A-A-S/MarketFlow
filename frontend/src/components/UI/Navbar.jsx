import { Globe, Moon, ShoppingCart, Sun } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { useTheme } from "../../hooks/useTheme";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const { translations, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Map paths to translation keys
  const pageMap = {
    "/dashboard": "dashboard",

    // Menu Module
    "/menu-items": "menu_items",
    "/menu-categories": "categories",
    "/extras-groups": "extras_groups",
    "/extras": "extras",
    "/sizes": "sizes",

    // Inventory Module
    "/ingredients": "ingredients",
    "/suppliers": "suppliers",
    "/inventory-transactions": "inventory_transactions",
    "/inventory-batches": "inventory_batches",

    // HR Module
    "/hr/employees": "employees",
    "/hr/shift-types": "shift_types",
    "/hr/leave-types": "leave_types",
    "/hr/work-schedules": "work_schedules",
    "/hr/attendances": "attendances",
    // "/hr/leaves": "leaves",
    "/hr/leave-requests": "leave_requests",
    "/hr/leave-approvals": "leave_approvals",

    "/hr/payroll": "payroll",

    "/point-of-sale": "point_of_sale",
    "/orders": "orders",
    "/analytics": "analytics",
    "/settings": "settings",
  };

  const pageKey = pageMap[location.pathname] || "dashboard";
  const currentTitle = translations.sidebar[pageKey];

  return (
    <header
      className={`p-4 px-12 bg-white dark:bg-slate-800  
        ${language == "en" ? "pl-24" : "pr-24"} h-16 sticky z-10 top-0 left-0 right-0 shadow-sm 
        border-b dark:border-b-slate-600 flex items-center justify-between`}
    >
      <h2 className="font-medium">{currentTitle}</h2>
      <div className="flex items-center gap-1">
        <button
          className="flex items-center gap-1 transition-all duration-300 hover:bg-slate-300 rounded p-1"
          onClick={toggleLanguage}
        >
          <Globe className="h-6 w-6 text-gray-600 hover:text-gray-700 transition-all duration-300" />
          <span>{language == "en" ? "AR" : "EN"}</span>
        </button>
        <button
          className="transition-all duration-300 hover:bg-slate-300 rounded p-1"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Moon className="h-6 w-6 text-gray-600 hover:text-gray-700 transition-all duration-300" />
          ) : (
            <Sun className="h-6 w-6 text-gray-600 hover:text-gray-700 transition-all duration-300" />
          )}
        </button>
        {/* <button className="relative transition-all duration-300 hover:bg-slate-300 rounded p-1">
          <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-gray-700" />
          <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {10}
          </span>
        </button> */}
      </div>
    </header>
  );
};
export default Navbar;

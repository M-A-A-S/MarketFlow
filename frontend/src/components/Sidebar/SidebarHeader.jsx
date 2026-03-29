import { ChefHat, MenuIcon } from "lucide-react";
import { safeCall } from "../../utils/utils";

const SidebarHeader = ({ sidebarOpen, toggle }) => {
  const handleToggle = safeCall(toggle);

  return (
    <div
      className="flex items-center justify-between gap-1 p-4 
    border-b dark:border-b-slate-600 h-16"
    >
      {sidebarOpen && (
        <div className="flex items-center space-x-2">
          <ChefHat className={`h-8 w-8 text-purple-600`} />
          <h3 className="text-xl font-bold">MarketFlow</h3>
        </div>
      )}
      {!sidebarOpen && (
        <ChefHat className={`h-8 w-8 text-purple-600 mx-auto`} />
      )}
      <button onClick={handleToggle}>
        <MenuIcon className="h-5 w-5" />
      </button>
    </div>
  );
};
export default SidebarHeader;

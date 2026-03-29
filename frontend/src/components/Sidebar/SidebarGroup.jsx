import { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import SidebarItem from "./SidebarItem";
import { ChevronDown, ChevronUp } from "lucide-react";

const SidebarGroup = ({ group, sidebarOpen }) => {
  const [open, setOpen] = useState(false);
  const { translations, language } = useLanguage();

  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full 
        p-3 mb-2 rounded-lg 
        transition-colors 
        transition-all duration-300
        hover:bg-purple-100 dark:hover:text-gray-950`}
      >
        <div className="flex items-center">
          <span className="icon">{group.icon}</span>
          {sidebarOpen && (
            <span
              className={`${language == "en" ? "ml-3" : "mr-3"} font-medium`}
            >
              {translations.sidebar[group.key]}
            </span>
          )}
        </div>

        {/* {sidebarOpen && open ? (ChevronUp size={18} /> ): (<ChevronDown />) } */}

        {sidebarOpen &&
          (open ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
      </button>
      {open && (
        // <ul className="ml-6 mt-2">
        <ul className="mt-2">
          {group?.children?.map((child) => (
            <SidebarItem
              key={child.key}
              item={child}
              sidebarOpen={sidebarOpen}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
export default SidebarGroup;

import { NavLink } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

const SidebarItem = ({ item, sidebarOpen }) => {
  const { translations, language } = useLanguage();

  return (
    <li>
      <NavLink
        // onClick={() => setSidebarOpen(false)}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center w-full p-3 rounded-lg mb-2 
                transition-colors 
                transition-all duration-300 
                hover:bg-purple-100 dark:hover:text-gray-950
                ${isActive ? `bg-purple-100 text-purple-700` : ""}`
        }
      >
        <span className="icon">{item.icon}</span>
        {sidebarOpen && (
          <span className={`${language == "en" ? "ml-3" : "mr-3"} font-medium`}>
            {translations.sidebar[item.key]}
          </span>
        )}
      </NavLink>
    </li>
  );
};
export default SidebarItem;

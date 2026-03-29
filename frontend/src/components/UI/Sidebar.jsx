import {
  LayoutDashboard,
  Package,
  UtensilsCrossed,
  Layers,
  Tags,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import SidebarHeader from "../Sidebar/SidebarHeader";
import SidebarNav from "../Sidebar/SidebarNav";
// import { useAuth } from "../../hooks/useAuth";

const menus = [
  {
    key: "dashboard",
    path: "/",
    icon: <LayoutDashboard />,
    roles: ["administrator", "manager"],
  },

  {
    key: "point_of_sale",
    path: "/point-of-sale",
    icon: <UtensilsCrossed />,
    roles: ["administrator", "manager", "cashier"],
  },

  {
    key: "products",
    icon: <Package />,
    roles: ["administrator", "manager"],
    children: [
      {
        key: "categories",
        path: "/categories",
        icon: <Layers />,
        roles: ["administrator", "manager"],
      },
      {
        key: "brands",
        path: "/brands",
        icon: <Tags />,
        roles: ["administrator", "manager"],
      },
      {
        key: "products",
        path: "/products",
        icon: <Package />,
        roles: ["administrator", "manager"],
      },
    ],
  },
];

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { language } = useLanguage();

  // const { currentRole, userRoles } = useAuth();

  // const filterLinksByRole = (links, roles) => {
  //   return links
  //     .filter(
  //       (menu) =>
  //         !menu.roles || menu.roles.some((role) => roles.includes(role)),
  //     )
  //     .map((menu) => {
  //       if (!menu.children) {
  //         return menu;
  //       }

  //       const children = menu.children.filter(
  //         (child) =>
  //           !child.roles || child.roles.some((role) => roles.includes(role)),
  //       );

  //       return { ...menu, children };
  //     })
  //     .filter((menu) => !menu.children || menu.children.length > 0);
  // };

  // const links = filterLinksByRole(menus, currentRole);
  // const links = filterLinksByRole(menus, userRoles);

  const links = menus;

  return (
    <aside
      className={`bg-white dark:bg-slate-800 shadow-lg  transition-all duration-300 
        fixed z-20 top-0  ${language == "en" ? "left-0" : "right-0"}  
        h-screen flex flex-col  ${sidebarOpen ? "w-64" : "w-20"} `}
    >
      {/* Top */}
      <SidebarHeader
        sidebarOpen={sidebarOpen}
        toggle={() => setSidebarOpen(!sidebarOpen)}
      />
      {/* Links */}
      <SidebarNav sidebarOpen={sidebarOpen} links={links} />
      {/* Bottom */}
      {/* <div className="bg-green-300 p-10">Bottom</div> */}
    </aside>
  );
};
export default Sidebar;

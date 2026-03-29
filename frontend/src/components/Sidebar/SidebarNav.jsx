import SidebarGroup from "./SidebarGroup";
import SidebarItem from "./SidebarItem";

const SidebarNav = ({ sidebarOpen, links = [] }) => {
  return (
    <nav className="mt-6 px-2 flex-1 overflow-y-auto">
      <ul>
        {links?.map((link) =>
          link?.children ? (
            <SidebarGroup
              key={link?.key}
              group={link}
              sidebarOpen={sidebarOpen}
            />
          ) : (
            <SidebarItem
              key={link?.key}
              item={link}
              sidebarOpen={sidebarOpen}
            />
          ),
        )}
      </ul>
    </nav>
  );
};
export default SidebarNav;

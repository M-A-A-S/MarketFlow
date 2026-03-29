import { Outlet } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import Navbar from "../components/UI/Navbar";
import Sidebar from "../components/UI/Sidebar";

const MainLayout = () => {
  const { language } = useLanguage();
  return (
    <div>
      <Navbar />
      <Sidebar />
      <main
        className={`p-10 min-h-screen text-start ${language == "en" ? "pl-24" : "pr-24"}`}
      >
        <Outlet />
      </main>
    </div>
  );
};
export default MainLayout;

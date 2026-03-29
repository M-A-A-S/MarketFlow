import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ToastContainer from "./components/UI/ToastContainer";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import PointOfSalePage from "./pages/PointOfSalePage";
import CategoiesPage from "./pages/CategoiesPage";
import BrandsPage from "./pages/BrandsPage";
import ProductsPage from "./pages/ProductsPage";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/point-of-sale" element={<PointOfSalePage />} />

            <Route path="/categories" element={<CategoiesPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/products" element={<ProductsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;

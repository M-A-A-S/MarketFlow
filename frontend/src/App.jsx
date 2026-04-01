import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ToastContainer from "./components/UI/ToastContainer";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import PointOfSalePage from "./pages/PointOfSale/PointOfSalePage";
import CategoiesPage from "./pages/Categoies/CategoiesPage";
import BrandsPage from "./pages/Brands/BrandsPage";
import ProductsPage from "./pages/Products/ProductsPage";
import AddEditProductPage from "./pages/Products/AddEditProductPage";
import SuppliersPage from "./pages/Suppliers/SuppliersPage";
import AddEditSupplierPage from "./pages/Suppliers/AddEditSupplierPage";

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
            <Route path="/add-product" element={<AddEditProductPage />} />
            <Route path="/edit-product/:id" element={<AddEditProductPage />} />

            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/add-supplier" element={<AddEditSupplierPage />} />
            <Route
              path="/edit-supplier/:id"
              element={<AddEditSupplierPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;

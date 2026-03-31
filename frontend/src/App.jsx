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
            <Route path="/add-edit-product" element={<AddEditProductPage />} />
            <Route
              path="/add-edit-product/:id"
              element={<AddEditProductPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;

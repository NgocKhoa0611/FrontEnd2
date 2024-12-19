import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "../components/Admin/layout/Sidebar";
import MainContent from "../components/Admin/layout/MainContent";
import ProductsList from '../components/Admin/products/ProductsList';
import ProductsDetailList from '../components/Admin/products/ProductsDetailList';
import ProductsAdd from '../components/Admin/products/ProductsAdd';
import ProductsEdit from '../components/Admin/products/ProductsEdit';
import ProductDetailList from '../components/Admin/products/ProductsDetailList';
import DetailAdd from '../components/Admin/products/DetailAdd';
import DetailEdit from '../components/Admin/products/DetailEdit';
import CategoriesList from '../components/Admin/categories/CategoriesList';
import CategoriesAdd from '../components/Admin/categories/CategoriesAdd';
import CategoriesEdit from '../components/Admin/categories/CategoriesEdit';
import OrdersList from '../components/Admin/orders/OrdersList';
import OrdersEdit from '../components/Admin/orders/OrdersEdit';
import UsersList from '../components/Admin/users/UsersList';
import LoginAdmin from '../components/Admin/account/LoginAdmin';
import '../components/Admin/assets/styles/admin.css';
import '../components/Admin/assets/styles/index.css';
import OrderDetailList from "../components/Admin/orders/OrdersDetailList";

const AdminRoutes = () => {
    const location = useLocation(); // Get the current path

    const isLoginPage = location.pathname.endsWith("/login");
    return (
        <div className="app">
            {/* Render Sidebar only if not on the login page */}
            {!isLoginPage && <Sidebar />}
            <div className="">
                <Routes>
                    <Route path="/" element={<MainContent />} />
                    <Route path="/login" element={<LoginAdmin />} />
                    <Route path="/productlist" element={<ProductsList />} />
                    <Route path="/productlist/add-product" element={<ProductsAdd />} />
                    <Route path="/productlist/edit-product/:id" element={<ProductsEdit />} />
                    <Route path="/productdetaillist/:id" element={<ProductDetailList />} />
                    <Route path="/productdetaillist/add-detail/:id" element={<DetailAdd />} />
                    <Route path="/productdetaillist/edit-detail/:id" element={<DetailEdit />} />
                    <Route path="/categorieslist" element={<CategoriesList />} />
                    <Route path="/categorieslist/add-categories" element={<CategoriesAdd />} />
                    <Route path="/categorieslist/edit-categories/:id" element={<CategoriesEdit />} />
                    <Route path="/productlist/:id" element={<ProductsDetailList />} />
                    <Route path="/orderslist" element={<OrdersList />} />
                    <Route path="/orders_detail/:id" element={<OrderDetailList />} />
                    <Route path="/orderslist/edit/:id" element={<OrdersEdit />} />
                    <Route path="/userslist" element={<UsersList />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminRoutes;

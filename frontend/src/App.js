import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/user/Home';
import Dashboard from './pages/admin/Dashboard';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from "./layouts/UserLayout";

import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import RolePage from './pages/admin/role/RolePage';
import UserPage from './pages/admin/user/UserPage';
import CategoryPage from './pages/admin/category/CategoryPage';
import SizePage from './pages/admin/size/SizePage';
import DiscountPage from './pages/admin/discount/DiscountPage';
import ProductPage from './pages/admin/product/ProductPage';
import ProductSizePage from './pages/admin/product-size/ProductSizePage';
import ContactPage from './pages/admin/contact/ContactPage';

import { CartProvider } from './pages/user/CartContext';

const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* User routes */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='/admin/roles' element={<RolePage />} />
            <Route path="/admin/users" element={<UserPage />} />
            <Route path='/admin/categories' element={<CategoryPage />} />
            <Route path='/admin/sizes' element={<SizePage />} />
            <Route path='/admin/discounts' element={<DiscountPage />} />
            <Route path='/admin/products' element={<ProductPage />} />
            <Route path='/admin/product_sizes' element={<ProductSizePage />} />
            <Route path='/admin/contacts' element={<ContactPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;

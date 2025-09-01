import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/user/Home';
import Dashboard from './pages/admin/Dashboard';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from "./layouts/UserLayout";
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

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;

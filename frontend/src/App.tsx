import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/User/Home";
import Cart from "./components/User/Cart";
import Category from "./components/User/Category";
import Checkout from "./components/User/Checkout";
import Order from "./components/User/Order";
import History from "./components/User/History";
import Account from "./components/User/Account";

import PharmacyHome from "./components/Pharmacy/Home";
import PharmacyOrder from "./components/Pharmacy/Order";
import PharmacyReport from "./components/Pharmacy/Reports";
import PharmacyProduct from "./components/Pharmacy/Products";
import PharmacyAccount from "./components/Pharmacy/Account";
import PharmacySupplierOrders from "./components/Pharmacy/SupplierOrders";
import DistributorHome from "./components/Distributor/Home";
import DistributorOrder from "./components/Distributor/Order";
import DistributorBatch from "./components/Distributor/Batch";
import DistributorProduct from "./components/Distributor/Products";
import DistributorReports from "./components/Distributor/Report";


// Component xử lý layout theo route
const AppContent: React.FC = () => {
  return (
    <>
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />

      {/* USER */}
      <Route path="/" element={<Home/>}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/category" element={<Category/>}/>
      <Route path="/checkout" element={<Checkout/>}/>
      <Route path="/orders" element={<Order/>}/>
      <Route path="/history" element={<History/>}/>
      <Route path="/account" element={<Account/>}/>

      {/* PHARMACY */}
      <Route path="/pharmacy/home" element={<PharmacyHome/>}/>
      <Route path="/pharmacy/orders" element={<PharmacyOrder/>}/>
      <Route path="/pharmacy/products" element={<PharmacyProduct/>}/>
      <Route path="/pharmacy/report" element={<PharmacyReport/>}/>
      <Route path="/pharmacy/account" element={<PharmacyAccount/>}/>
      <Route path="/pharmacy/supplier" element={<PharmacySupplierOrders/>}/>

      {/* DISTRIBUTOR */}
      <Route path="/distributor/home" element={<DistributorHome/>}/>
      <Route path="/distributor/orders" element={<DistributorOrder/>}/>
      <Route path="/distributor/batch" element={<DistributorBatch/>}/>
      <Route path="/distributor/products" element={<DistributorProduct/>}/>
      <Route path="/distributor/reports" element={<DistributorReports/>}/>
      <Route path="/distributor/account" element={<DistributorReports/>}/>

    </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

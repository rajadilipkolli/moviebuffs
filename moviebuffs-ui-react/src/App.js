import React from "react";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements, Navigate } from "react-router-dom";
import Login from "./components/Login";
import ProductsContainer from "./containers/ProductsContainer";
import ProductContainer from "./containers/ProductContainer";
import ProductsByGenreContainer from "./containers/ProductsByGenreContainer";
import CartContainer from "./containers/CartContainer";
import OrderConfirmation from "./components/OrderConfirmation";
import Layout from "./components/Layout";
import "./App.css";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/products" element={<ProductsContainer />} />
        <Route path="/products/:id" element={<ProductContainer />} />
        <Route path="/genres" element={<ProductsByGenreContainer />} />
        <Route path="/cart" element={<CartContainer />} />
        <Route path="/orderconfirmation/:orderId" element={<OrderConfirmation />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Navbar from "./components/Navbar";
import Products from "./components/Products";
import AddProduct from "./components/AddProduct";
import ProductDetails from "./components/ProductDetails";
import MyListings from "./components/MyListings";
import Login from "./components/Login";
import Register from "./components/Register";
import About from "./components/About";
import CategoriesPage from "./components/CategoriesPage";
import EditProduct from "./components/EditProduct";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import Chat from "./components/Chat";
import Conversations from "./components/Conversations";

function App() {
  const [products, setProducts] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      const formattedProducts = res.data.map((product) => ({
        ...product,
        images: Array.isArray(product.images) ? product.images : [],
      }));
      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Router>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Products products={products} />} />
            <Route path="/products" element={<Products products={products} />} />
            <Route
              path="/products/:id"
              element={<ProductDetails products={products} />}
            />
            <Route
              path="/add-product"
              element={currentUser ? <AddProduct /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-listings"
              element={
                currentUser ? (
                  <MyListings deleteProduct={deleteProduct} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/edit/:id"
              element={currentUser ? <EditProduct /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={currentUser ? <AdminDashboard /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route
  path="/conversations"
  element={currentUser ? <Conversations /> : <Navigate to="/login" />}
/>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
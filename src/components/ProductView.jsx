// ==========================
// File: pages/ProductView.jsx
// Product Detail Page (Flipkart-style + Dynamic Backend + Responsive)
// ==========================
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";

// ✅ Dynamic API URL
// const BASE_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "") || "";
const API_URL = `https://saheli-backend.vercel.app/api/products`;

const CART_KEY = "ecom_cart";

// 🔹 Read Cart from LocalStorage
function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

// 🔹 Save Cart to LocalStorage
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("storage"));
}

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // ✅ Fetch Single Product from Backend
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        const prod =
          res.data?.product ||
          (Array.isArray(res.data) ? res.data[0] : res.data);
        setProduct(prod || null);
      } catch (err) {
        console.error("❌ Error loading product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // ✅ Add to Cart Function
  function addToCart(product) {
    if (!product || product.stock <= 0) return;
    const currentCart = readCart();
    const existing = currentCart.find((c) => c._id === product._id);
    const updated = existing
      ? currentCart.map((c) =>
          c._id === product._id ? { ...c, qty: c.qty + 1 } : c
        )
      : [...currentCart, { ...product, qty: 1 }];

    saveCart(updated);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  // ✅ Loading UI
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading product details...
      </div>
    );

  // ❌ Product not found
  if (!product)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-600">
        <p>Product not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );

  // ✅ Product Detail UI
  return (
    <div className="min-h-[600px] bg-gray-100 flex flex-col items-center py-6 sm:py-10 px-3 sm:px-6 relative">
      {/* 🔙 Back Button */}
      <div className="w-full max-w-6xl mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-semibold text-sm sm:text-base"
        >
          <FaArrowLeft /> Back to Products
        </button>
      </div>

      {/* 🛍️ Product Container */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
        {/* Left: Image */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r">
          <img
            src={
              product.image ||
              "https://via.placeholder.com/600x400.png?text=No+Image"
            }
            alt={product.title || "Product Image"}
            className="w-full max-w-md h-auto object-contain rounded-lg transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Right: Product Details */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {product.title || "Untitled Product"}
            </h1>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              {product.category || "Uncategorized"}
            </p>

            <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4">
              {product.description ||
                "No description available for this product."}
            </p>

            <div className="flex items-center gap-4 mt-6">
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                ₹{product.price ?? "N/A"}
              </span>
              {product.stock > 0 ? (
                <span className="text-green-600 text-sm font-medium">
                  In Stock: {product.stock}
                </span>
              ) : (
                <span className="text-red-500 text-sm font-medium">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className={`flex-1 px-6 py-3 rounded-lg text-white font-semibold text-base shadow-md transition-all ${
                product.stock <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="flex-1 px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base shadow-md transition-all"
            >
              Go to Cart
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow-lg animate-bounce z-50">
          <FaCheckCircle /> Added to Cart
        </div>
      )}
    </div>
  );
}

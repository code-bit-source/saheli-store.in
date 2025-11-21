// ==========================
// ProductView.jsx – Minimal UI + ScrollToTop + Recommended
// ==========================
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";

const API_URL = `https://saheli-backend.vercel.app/api/products`;
const CART_KEY = "ecom_cart";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("storage"));
}

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Fetch Selected Product
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        const prod =
          res.data?.product ||
          (Array.isArray(res.data) ? res.data[0] : res.data);
        setProduct(prod || null);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // Fetch Recommended
  useEffect(() => {
    async function fetchRecommended() {
      try {
        const res = await axios.get(API_URL);
        const list = res.data.products || res.data || [];
        setRecommended(list.filter((p) => p.recommended));
      } catch {}
    }
    fetchRecommended();
  }, []);

  // Add to Cart
  function addToCart(p) {
    if (!p || p.stock <= 0) return;

    const cart = readCart();
    const exist = cart.find((c) => c._id === p._id);

    const updated = exist
      ? cart.map((c) =>
          c._id === p._id ? { ...c, qty: c.qty + 1 } : c
        )
      : [...cart, { ...p, qty: 1 }];

    saveCart(updated);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  // Loading
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-xl">
        Loading product...
      </div>
    );

  if (!product)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-600">Product not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6">

      {/* BACK BUTTON */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => {
            navigate(-1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-lg font-medium"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* ========================== */}
      {/* 🔥 MINIMAL PRODUCT SECTION */}
      {/* ========================== */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* IMAGE SECTION (Big + Clean) */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-center">
          <img
            src={product.image}
            className="w-full max-w-[500px] object-contain rounded-md   transition-transform"
          />
        </div>

        {/* RIGHT SIDE – Minimal Details */}
        <div className="flex flex-col justify-between bg-white p-6 rounded-2xl shadow-md">

          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {product.title}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{product.category}</p>

            {/* Price */}
            <div className="mt-4">
              <p className="text-3xl sm:text-4xl font-bold text-blue-700">
                ₹{product.price}
              </p>

              {product.stock > 0 ? (
                <p className="text-green-600 mt-1 font-medium">
                  ✔ In Stock ({product.stock})
                </p>
              ) : (
                <p className="text-red-500 mt-1 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Description minimal */}
            <p className="mt-4 text-gray-700 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => addToCart(product)}
              className={`flex-1 py-3 rounded-lg text-white font-semibold text-lg ${
                product.stock <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Add to Cart
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="flex-1 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg"
            >
              Go to Cart
            </button>
          </div>

        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg animate-bounce">
          <FaCheckCircle /> Added to Cart
        </div>
      )}

      {/* ================================ */}
      {/* 🔥 RECOMMENDED SECTION */}
      {/* ================================ */}
      {recommended.length > 0 && (
        <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recommended Products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommended.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  navigate(`/product/${item._id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="cursor-pointer border rounded-xl bg-gray-50 shadow hover:shadow-lg transition hover:-translate-y-1 overflow-hidden"
              >
                <img
                  src={item.image}
                  className="h-40 w-full object-cover"
                />

                <div className="p-3">
                  <h3 className="font-medium text-gray-800 truncate">
                    {item.title}
                  </h3>

                  <p className="text-blue-600 font-bold mt-1">
                    ₹{item.price}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white mt-2 py-1.5 rounded-lg text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

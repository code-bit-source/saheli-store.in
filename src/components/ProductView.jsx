// ==========================
// ProductView.jsx – Professional Clean UI
// ==========================
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import Navbar from "./Navbar";

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

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
    setTimeout(() => setShowToast(false), 1800);
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading product...
      </div>
    );

  if (!product)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-500">Product not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 bg-gray-800 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6">
        <Navbar />
      {/* BACK BUTTON */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* PRODUCT SECTION */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* IMAGE SECTION (FIXED HEIGHT) */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[420px] object-contain rounded-lg"
          />
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="flex flex-col justify-between bg-white p-6 rounded-2xl shadow-sm">

          <div>
            <h1 className="text-2xl sm:text-3xl text-gray-800">
              {product.title}
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              {product.category}
            </p>

            <div className="mt-4">
              <p className="text-3xl text-gray-900">
                ₹{product.price}
              </p>

              {product.stock > 0 ? (
                <p className="text-green-600 mt-1 text-sm">
                  In Stock ({product.stock})
                </p>
              ) : (
                <p className="text-red-500 mt-1 text-sm">
                  Out of Stock
                </p>
              )}
            </div>

            <p className="mt-4 text-gray-700 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className={`flex-1 py-3 rounded-full text-sm transition ${
                product.stock <= 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
              }`}
            >
              Add to Cart
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="flex-1 py-3 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-sm"
            >
              Go to Cart
            </button>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full shadow animate-pulse flex items-center gap-2">
          <FaCheckCircle /> Added to Cart
        </div>
      )}

      {/* RECOMMENDED */}
      {recommended.length > 0 && (
        <div className="max-w-6xl mx-auto mt-12 bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg text-gray-800 mb-5">
            Recommended Products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommended.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
                className="cursor-pointer bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <img
                  src={item.image}
                  className="h-[170px] w-full object-cover"
                />

                <div className="p-3">
                  <h3 className="text-sm text-gray-700 truncate">
                    {item.title}
                  </h3>

                  <p className="text-gray-900 text-sm mt-1">
                    ₹{item.price}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 mt-2 py-1.5 rounded-full text-[12px]"
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

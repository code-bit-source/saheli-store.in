// ==========================
// File: components/Cart.jsx
// Saheli Store – Fully Fixed Cart + Dynamic API + WhatsApp Integration (Updated)
// ==========================

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import {
  FaArrowLeft,
  FaTrashAlt,
  FaShoppingCart,
  FaCheckCircle,
} from "react-icons/fa";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const CART_KEY = "ecom_cart";

// ✅ Dynamically read backend URL from environment
const BASE_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "") || "";
if (!BASE_URL)
  console.warn("⚠️ Missing VITE_API_URL in .env file — API calls may fail.");

const PRODUCT_API = `${BASE_URL}/api/products`;
const ORDER_API = `${BASE_URL}/api/orders`;

// 🧩 Utility: Safe Cart Read/Write
const readCart = () => {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};
const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

// ✅ Normalize product data for backend order format
const normalizeCart = (cart) =>
  cart.map((item) => ({
    productId: item._id || null,
    title: item.title || item.name || "Unnamed Product",
    name: item.name || item.title || "Unnamed Product",
    price: Number(item.price) || 0,
    qty: Number(item.qty) || 1,
    image: item.image || "",
  }));

export default function Cart() {
  const [cart, setCart] = useState(readCart());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const navigate = useNavigate();
  const cartRef = useRef(null);

  // 🎬 Animation (GSAP)
  useEffect(() => {
    if (cartRef.current)
      gsap.fromTo(
        cartRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
  }, []);

  // 🔹 Fetch all products (for recommendations)
  useEffect(() => {
    let mounted = true;
    axios
      .get(PRODUCT_API)
      .then((res) => {
        let fetched = [];
        if (Array.isArray(res.data)) fetched = res.data;
        else if (Array.isArray(res.data.products)) fetched = res.data.products;
        else if (Array.isArray(res.data.data)) fetched = res.data.data;
        if (mounted) setProducts(fetched);
      })
      .catch((err) => console.error("❌ Product fetch error:", err));
    return () => (mounted = false);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const recommended = Array.isArray(products)
    ? products.filter((p) => p.recommended)
    : [];

  // 🔹 Cart Item Update (Quantity + Remove)
  const updateQty = useCallback(
    (item, delta) => {
      const updated = cart.map((c) =>
        c._id === item._id ? { ...c, qty: Math.max(1, c.qty + delta) } : c
      );
      setCart(updated);
      saveCart(updated);
    },
    [cart]
  );

  const removeItem = useCallback(
    (id) => {
      const updated = cart.filter((c) => c._id !== id);
      setCart(updated);
      saveCart(updated);
    },
    [cart]
  );

  const addToCart = useCallback(
    (p) => {
      const product = {
        _id: p._id || p.id || Date.now(),
        title: p.title || "Unnamed Product",
        name: p.name || p.title || "Unnamed Product",
        price: Number(p.price) || 0,
        image: p.image || "",
        qty: 1,
      };

      const exist = cart.find((c) => c._id === product._id);
      const updated = exist
        ? cart.map((c) =>
            c._id === product._id ? { ...c, qty: c.qty + 1 } : c
          )
        : [...cart, product];
      setCart(updated);
      saveCart(updated);
    },
    [cart]
  );

  // 🟢 WhatsApp Message Builder
  const buildWhatsAppUrl = (order, receiptUrl = "") => {
    const message = `
🧾 *New Order Received*
-----------------------------------
👤 *Customer:* ${order.customer.name}
📞 *Phone:* ${order.customer.phone}
🏠 *Address:* ${order.customer.line1}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}

📦 *Items:*
${order.cartItems
  .map((i) => `• ${i.title || i.name} ×${i.qty} = ₹${i.price * i.qty}`)
  .join("\n")}

💰 *Total:* ₹${order.totalPrice}
-----------------------------------
${receiptUrl ? `📄 *Receipt:* ${receiptUrl}` : ""}
Thank you for shopping with *Saheli Store*!`;

    return `https://wa.me/919315868930?text=${encodeURIComponent(message)}`;
  };

  // 🧾 Checkout Process
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cart.length) return alert("🛒 Your cart is empty!");
    if (!address.name || !address.phone || !address.line1)
      return alert("⚠️ Please fill all required fields.");

    try {
      setLoading(true);

      // 1️⃣ Normalize Cart
      const normalizedCart = normalizeCart(cart);
      const order = {
        customer: address,
        cartItems: normalizedCart,
        totalPrice: total,
        paymentMethod: "Cash on Delivery",
        orderStatus: "Pending",
      };

      // 2️⃣ Create Order
      const res = await axios.post(ORDER_API, order);
      const orderId = res.data?.order?._id || res.data?._id;
      if (!orderId) throw new Error("❌ Failed to create order");

      // 3️⃣ Fetch Receipt (retry 3 times)
      let receiptUrl = "";
      for (let i = 0; i < 3; i++) {
        try {
          const receiptRes = await axios.get(`${ORDER_API}/receipt/${orderId}`);
          if (receiptRes.data?.pdfUrl) {
            receiptUrl = `${BASE_URL}${receiptRes.data.pdfUrl}`;
            break;
          }
        } catch {
          await new Promise((r) => setTimeout(r, 1500));
        }
      }

      // 4️⃣ Open WhatsApp message
      const waUrl = buildWhatsAppUrl(order, receiptUrl);
      window.open(waUrl, "_blank");

      // 5️⃣ Cleanup
      localStorage.removeItem(CART_KEY);
      setCart([]);
      alert("✅ Order placed successfully!");
    } catch (err) {
      console.error("❌ Order error:", err.response?.data || err.message);
      alert("❌ Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // 🖼️ UI
  // ==========================
  return (
    <div ref={cartRef} className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-6"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 🛒 CART ITEMS */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800 flex items-center gap-2">
            <FaShoppingCart className="text-blue-600" /> Your Cart
          </h2>

          {!cart.length ? (
            <p className="text-gray-500 text-center py-10 text-lg">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-gray-100 pb-5"
                >
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-gray-800">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      ₹{item.price} × {item.qty} ={" "}
                      <span className="font-semibold text-gray-800">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item, -1)}
                        className="px-3 py-1 border rounded-lg hover:bg-gray-100 font-bold"
                      >
                        −
                      </button>
                      <span className="font-semibold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item, 1)}
                        className="px-3 py-1 border rounded-lg hover:bg-gray-100 font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="ml-4 text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
                      >
                        <FaTrashAlt /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <div className="mt-6 text-right text-xl font-semibold text-gray-800">
              Total: ₹{total}
            </div>
          )}
        </div>

        {/* ✅ CHECKOUT */}
        <aside className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="font-semibold text-xl mb-4 text-gray-800 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" /> Checkout Details
          </h3>

          <form onSubmit={handleCheckout} className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={address.name}
              onChange={(e) =>
                setAddress({ ...address, name: e.target.value })
              }
              className="w-full border p-2.5 rounded-lg"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
              className="w-full border p-2.5 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Address Line"
              value={address.line1}
              onChange={(e) =>
                setAddress({ ...address, line1: e.target.value })
              }
              className="w-full border p-2.5 rounded-lg"
              required
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                className="w-1/2 border p-2.5 rounded-lg"
              />
              <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                className="w-1/2 border p-2.5 rounded-lg"
              />
            </div>
            <input
              type="text"
              placeholder="Pincode"
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
              className="w-full border p-2.5 rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-2.5 rounded-lg font-semibold transition`}
            >
              {loading ? "Processing..." : "Checkout"}
            </button>
          </form>
        </aside>
      </div>

      {/* 🔥 Recommended Section */}
      {recommended.length > 0 && (
        <div className="mt-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            🔥 Recommended For You
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {recommended.map((p) => (
              <div
                key={p._id}
                className="border rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition"
              >
                <img
                  src={p.image || "https://via.placeholder.com/150"}
                  alt={p.title}
                  className="h-40 w-full object-cover rounded-t-xl"
                />
                <div className="p-3">
                  <h4 className="font-medium text-gray-800 truncate">
                    {p.title}
                  </h4>
                  <p className="text-blue-600 font-semibold mb-2">
                    ₹{p.price}
                  </p>
                  <button
                    onClick={() => addToCart(p)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-lg text-sm font-medium"
                  >
                    Add Now
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

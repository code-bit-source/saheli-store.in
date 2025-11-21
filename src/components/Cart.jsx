// ==========================
// File: components/Cart.jsx
// Saheli Store – Checkout + Delivery Charge Logic + WhatsApp Redirect
// (UI improved for cart items & checkout panel; functionality unchanged)
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

// Backend URLs
const BASE_URL = "https://saheli-backend.vercel.app";
const PRODUCT_API = `${BASE_URL}/api/products`;
const ORDER_API = `${BASE_URL}/api/orders`;

// Local Storage Helpers
const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};
const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

// Normalize Cart for Backend
const normalizeCart = (cart) =>
  cart.map((item) => ({
    productId: item._id || null,
    title: item.title || "Unnamed Product",
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

  // Animation
  useEffect(() => {
    gsap.fromTo(
      cartRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.45 }
    );
  }, []);

  // Fetch products
  useEffect(() => {
    axios
      .get(PRODUCT_API)
      .then((res) =>
        setProducts(res.data.products || res.data.data || res.data || [])
      )
      .catch(() => {});
  }, []);

  // 🧮 MAIN TOTAL
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // 🆕 DELIVERY CHARGE LOGIC
  const DELIVERY_THRESHOLD = 1000;
  const DELIVERY_CHARGE = subtotal > 0 && subtotal < DELIVERY_THRESHOLD ? 120 : 0;

  const finalTotal = subtotal + DELIVERY_CHARGE;

  const amountLeftForFree = Math.max(0, DELIVERY_THRESHOLD - subtotal);

  const recommended = products.filter((p) => p.recommended);

  // Update Qty
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

  // Remove
  const removeItem = useCallback(
    (id) => {
      const updated = cart.filter((c) => c._id !== id);
      setCart(updated);
      saveCart(updated);
    },
    [cart]
  );

  // Add recommended
  const addToCart = useCallback(
    (p) => {
      const product = {
        _id: p._id,
        title: p.title,
        price: Number(p.price),
        image: p.image,
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

  // Checkout
  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!cart.length) return alert("🛒 Your cart is empty!");
    if (!address.name || !address.phone || !address.line1)
      return alert("⚠️ Please fill all required fields.");

    try {
      setLoading(true);

      const normalizedCart = normalizeCart(cart);

      const order = {
        customer: address,
        cartItems: normalizedCart,
        totalPrice: finalTotal, // ⬅ delivery charge included
        deliveryCharge: DELIVERY_CHARGE,
        paymentMethod: "Cash on Delivery",
        orderStatus: "Pending",
      };

      const res = await axios.post(ORDER_API, order);
      const orderId = res.data?.order?._id || res.data?._id;

      // Generate receipt async
      axios.get(`${ORDER_API}/receipt/${orderId}`).catch(() => {});

      // WhatsApp Message
      const message = `
🧾 *New Order Received*
-----------------------------------
👤 *Customer:* ${order.customer.name}
📞 *Phone:* ${order.customer.phone}
🏠 *Address:* ${order.customer.line1}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}

📦 *Items:*
${order.cartItems
        .map((i) => `• ${i.title} ×${i.qty} = ₹${i.price * i.qty}`)
        .join("\n")}

💵 *Subtotal:* ₹${subtotal}
🚚 *Delivery Charge:* ₹${DELIVERY_CHARGE}
-----------------------------------
💰 *Total Payable:* ₹${finalTotal}
-----------------------------------
Thank you for shopping with *Saheli Store*!`;

      const phoneNumber = "919315868930";
      const encoded = encodeURIComponent(message);

      window.location.href = `https://wa.me/${phoneNumber}?text=${encoded}`;

      localStorage.removeItem(CART_KEY);
      setCart([]);

    } catch {
      alert("❌ Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // UI – improved styling for cart items & checkout panel
  // ==========================
  return (
    <div ref={cartRef} className="max-w-6xl mx-auto px-4 py-8">
      {/* Back */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
            <FaShoppingCart className="text-blue-600" />
            <span className="font-semibold">{cart.length} items</span>
          </div>
          <div className="text-gray-500">Subtotal: <span className="font-semibold">₹{subtotal}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-lg border">
          <h2 className="text-2xl font-semibold mb-5 flex items-center gap-2 text-gray-800">
            <FaShoppingCart className="text-blue-600" /> Your Cart
          </h2>

          {!cart.length ? (
            <p className="text-gray-500 text-center py-10 text-lg">Your cart is empty.</p>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row gap-4 items-start sm:items-center border-b pb-5"
                >
                  {/* Image */}
                  <div className="w-full sm:w-28 flex-shrink-0 flex items-center justify-center">
                    <div className="w-28 h-28 bg-gray-50 rounded-lg overflow-hidden border">
                      <img
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col sm:ml-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description || ""}</p>
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium text-gray-800">₹{item.price}</span>
                          <span className="text-gray-500 ml-2">x {item.qty}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-sm text-gray-700 font-semibold">₹{item.price * item.qty}</div>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
                          title="Remove item"
                        >
                          <FaTrashAlt /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Qty controls */}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => updateQty(item, -1)}
                        className="w-10 h-9 flex items-center justify-center border rounded-md bg-white hover:bg-gray-50"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <div className="min-w-[44px] text-center font-semibold">{item.qty}</div>
                      <button
                        onClick={() => updateQty(item, 1)}
                        className="w-10 h-9 flex items-center justify-center border rounded-md bg-white hover:bg-gray-50"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>

                      {/* Stock/Badge placeholder - keep same content, optional small badge */}
                      {item.stock !== undefined && (
                        <div className={`ml-3 px-2 py-1 text-xs rounded-full ${item.stock > 5 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-800"}`}>
                          {item.stock > 5 ? "In Stock" : `Only ${item.stock} left`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DELIVERY INFO */}
          {cart.length > 0 && (
            <div className="mt-6 rounded-lg border p-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Subtotal:</span> ₹{subtotal}
                </p>

                {DELIVERY_CHARGE > 0 ? (
                  <p className="text-sm text-red-600 mt-1">
                    Add <span className="font-semibold">₹{amountLeftForFree}</span> more to get <span className="font-semibold">FREE Delivery</span>
                  </p>
                ) : (
                  <p className="text-sm text-green-600 mt-1">🎉 You have free delivery</p>
                )}
              </div>

              <div className="text-right">
                <p className="text-sm">
                  Delivery Charge:{" "}
                  <span className={DELIVERY_CHARGE ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                    ₹{DELIVERY_CHARGE}
                  </span>
                </p>
                <p className="text-lg font-bold mt-1">Total: ₹{finalTotal}</p>
              </div>
            </div>
          )}
        </div>

        {/* CHECKOUT FORM (styled) */}
        <aside className="bg-white p-6 rounded-2xl shadow-lg border">
          <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" /> Checkout Details
          </h3>

          <form onSubmit={handleCheckout} className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              required
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="text"
              placeholder="Address"
              required
              value={address.line1}
              onChange={(e) =>
                setAddress({ ...address, line1: e.target.value })
              }
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                className="w-1/2 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                className="w-1/2 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <input
              type="text"
              placeholder="Pincode"
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white py-3 rounded-lg font-semibold transition`}
            >
              {loading ? "Processing..." : `Checkout • ₹${finalTotal}`}
            </button>

            <p className="text-xs text-gray-500 mt-2">
              Note: If order total is less than ₹{DELIVERY_THRESHOLD}, a delivery charge of ₹{DELIVERY_CHARGE || 120} will be applied.
            </p>
          </form>
        </aside>
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className="mt-10 bg-white p-6 rounded-2xl shadow-lg  ">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">🔥 Recommended For You</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {recommended.map((p) => (
              <div key={p._id} className="border rounded-xl bg-gray-50 shadow-sm overflow-hidden">
                <div className="h-40 bg-white flex items-center justify-center overflow-hidden">
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="font-medium truncate">{p.title}</h4>
                  <p className="text-blue-600 font-semibold mb-2">₹{p.price}</p>
                  <button
                    onClick={() => addToCart(p)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm"
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

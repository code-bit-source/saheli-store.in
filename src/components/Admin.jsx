// ==========================
// File: components/Admin.jsx
// Saheli Store – Full Admin Panel (Products + Orders + Analytics + Receipts)
// ==========================

import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaChartLine,
  FaClipboardList,
  FaSignOutAlt,
  FaTrashAlt,
  FaBoxOpen,
  FaUserShield,
  FaEdit,
  FaSearch,
  FaTimes,
  FaShoppingCart,
  FaDownload,
  FaFilePdf,
  FaBox,
  FaRupeeSign,
  FaUsers,
} from "react-icons/fa";

// ✅ Dynamic API URLs from .env (Vercel Ready)
const BASE_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "") || "";
if (!BASE_URL) console.warn("⚠️ Missing VITE_API_URL in .env file");

const API_URL = `${BASE_URL}/api/products`;
const ORDER_URL = `${BASE_URL}/api/orders`;
const ADMIN_LOGGED = "admin_logged";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem(ADMIN_LOGGED) === "true"
  );
  const [activePage, setActivePage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // 🔹 Fetch data after login
  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
      fetchOrders();
    }
  }, [isLoggedIn]);

  // ==========================
  // 🔹 API HANDLERS (SAFE)
  // ==========================
  async function fetchProducts() {
    try {
      const res = await axios.get(API_URL);
      console.log("🧾 Products API:", res.data);
      let fetched = [];
      if (Array.isArray(res.data)) fetched = res.data;
      else if (Array.isArray(res.data.products)) fetched = res.data.products;
      else if (Array.isArray(res.data.data)) fetched = res.data.data;
      setProducts(fetched);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      setProducts([]);
    }
  }

  async function fetchOrders() {
    try {
      const res = await axios.get(ORDER_URL);
      console.log("📦 Orders API:", res.data);
      let fetched = [];
      if (Array.isArray(res.data)) fetched = res.data;
      else if (Array.isArray(res.data.orders)) fetched = res.data.orders;
      else if (Array.isArray(res.data.data)) fetched = res.data.data;
      setOrders(fetched);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      setOrders([]);
    }
  }

  function handleLogout() {
    localStorage.removeItem(ADMIN_LOGGED);
    setIsLoggedIn(false);
  }

  if (!isLoggedIn) return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;

  // =========================================================
  // 🧭 DASHBOARD – PRODUCTS MANAGEMENT
  // =========================================================
  function AdminDashboard() {
    const [form, setForm] = useState({
      title: "",
      price: "",
      description: "",
      image: "",
      category: "",
      stock: 5,
      recommended: false,
      bestSeller: false,
    });
    const [editProduct, setEditProduct] = useState(null);
    const [search, setSearch] = useState("");

    const filtered = Array.isArray(products)
      ? products.filter((p) =>
          p.title?.toLowerCase().includes(search.toLowerCase())
        )
      : [];

    const resetForm = () => {
      setForm({
        title: "",
        price: "",
        description: "",
        image: "",
        category: "",
        stock: 5,
        recommended: false,
        bestSeller: false,
      });
    };

    async function addProduct(e) {
      e.preventDefault();
      try {
        const res = await axios.post(API_URL, form);
        const newProduct = res.data.product || res.data;
        setProducts([newProduct, ...products]);
        resetForm();
        alert("✅ Product added successfully!");
      } catch (err) {
        console.error(err);
        alert("❌ Failed to add product");
      }
    }

    async function saveEdit(e) {
      e.preventDefault();
      try {
        const res = await axios.put(`${API_URL}/${editProduct._id}`, form);
        const updated = products.map((p) =>
          p._id === editProduct._id ? res.data.product || res.data : p
        );
        setProducts(updated);
        setEditProduct(null);
        resetForm();
        alert("✏️ Updated successfully!");
      } catch {
        alert("❌ Failed to update product");
      }
    }

    async function deleteProduct(id) {
      if (!confirm("🗑️ Delete this product permanently?")) return;
      try {
        await axios.delete(`${API_URL}/${id}`);
        setProducts(products.filter((p) => p._id !== id));
        alert("✅ Product deleted successfully!");
      } catch {
        alert("❌ Failed to delete product");
      }
    }

    async function updateStock(id, stock) {
      try {
        const res = await axios.patch(`${API_URL}/${id}`, {
          stock: Number(stock),
        });
        setProducts(
          products.map((p) =>
            p._id === id ? res.data.product || res.data : p
          )
        );
      } catch {
        alert("❌ Failed to update stock");
      }
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Product List */}
        <div className="md:col-span-2 bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FaBoxOpen className="text-blue-600" /> Product Management
            </h2>
            <div className="flex items-center border rounded-lg px-3 py-1.5 bg-gray-50">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none bg-transparent text-sm text-gray-700 w-44"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <div
                  key={p._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {p.title}
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditProduct(p);
                          setForm(p);
                        }}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteProduct(p._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {p.description || "No description available."}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-bold">
                      ₹{p.price}
                    </span>
                    <span className="text-xs text-gray-500">
                      {p.category}
                    </span>
                  </div>
                  <div className="mt-3 text-sm">
                    <label className="text-gray-600 font-medium">Stock:</label>
                    <input
                      type="number"
                      value={p.stock}
                      onChange={(e) => updateStock(p._id, e.target.value)}
                      className="w-20 border rounded p-1 ml-2 text-center text-gray-800"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Add/Edit Product */}
        <aside className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 max-h-[90vh] sticky top-4 overflow-y-auto hide-scrollbar">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            {editProduct ? "✏️ Edit Product" : "➕ Add Product"}
          </h2>

          <form
            onSubmit={editProduct ? saveEdit : addProduct}
            className="space-y-3"
          >
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Product Title"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Price (₹)"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              placeholder="Stock"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setForm({ ...form, image: reader.result });
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full border p-2 rounded-lg cursor-pointer"
              />
              {form.image && (
                <div className="mt-3 relative">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: "" })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Category"
              className="w-full border p-2 rounded-lg"
            />
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Description"
              className="w-full border p-2 rounded-lg"
            ></textarea>

            <div className="flex gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.recommended}
                  onChange={(e) =>
                    setForm({ ...form, recommended: e.target.checked })
                  }
                />
                Recommended
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.bestSeller}
                  onChange={(e) =>
                    setForm({ ...form, bestSeller: e.target.checked })
                  }
                />
                Bestseller
              </label>
            </div>

            <button
              type="submit"
              className={`w-full ${
                editProduct
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-600 hover:bg-green-700"
              } text-white py-2.5 rounded-lg font-semibold transition`}
            >
              {editProduct ? "Save Changes" : "Add Product"}
            </button>
          </form>
        </aside>
      </div>
    );
  }

  // =========================================================
  // 📦 ORDERS PAGE + ANALYTICS (same as before, no logic error)
  // =========================================================
  async function deleteOrder(id) {
    if (!confirm("⚠️ Delete this order and its receipt permanently?")) return;
    try {
      await axios.delete(`${ORDER_URL}/${id}`);
      alert("✅ Order & receipt deleted successfully!");
      fetchOrders();
    } catch {
      alert("❌ Failed to delete order");
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await axios.put(`${ORDER_URL}/${id}`, { orderStatus: status });
      fetchOrders();
    } catch {
      alert("❌ Failed to update order status");
    }
  }

  async function handleReceipt(id) {
    try {
      await axios.get(`${ORDER_URL}/receipt/${id}`);
      alert("✅ Receipt generated successfully!");
      fetchOrders();
    } catch {
      alert("❌ Failed to generate receipt");
    }
  }

  function Orders() {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <FaShoppingCart className="text-blue-600" /> Manage Orders ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full text-sm border">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="border p-2">#</th>
                  <th className="border p-2">Customer</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Payment</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Receipt</th>
                  <th className="border p-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o._id} className="border-b text-center hover:bg-gray-50">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{o.customer?.name}</td>
                    <td className="p-2 text-green-600 font-semibold">₹{o.totalPrice}</td>
                    <td className="p-2">{o.paymentMethod}</td>
                    <td className="p-2">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className="border rounded p-1 text-sm"
                      >
                        {[
                          "Pending",
                          "Processing",
                          "Packed",
                          "Shipped",
                          "Delivered",
                          "Cancelled",
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      {o.receipt?.pdfUrl ? (
                        <a
                          href={`${BASE_URL}${o.receipt.pdfUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaDownload />
                        </a>
                      ) : (
                        <button
                          onClick={() => handleReceipt(o._id)}
                          className="text-red-500 hover:text-red-700 flex items-center justify-center mx-auto"
                        >
                          <FaFilePdf />
                          <span className="ml-1 text-xs">Generate</span>
                        </button>
                      )}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => deleteOrder(o._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // =========================================================
  // 📊 ANALYTICS PAGE
  // =========================================================
  function Analytics() {
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalDelivered = orders.filter(
      (o) => o.orderStatus === "Delivered"
    ).length;
    const totalPending = orders.filter(
      (o) => o.orderStatus === "Pending"
    ).length;
    const lowStock = products.filter((p) => p.stock < 5);

    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <FaChartLine className="text-blue-600" /> Analytics Dashboard
        </h2>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<FaBox />} title="Total Products" value={products.length} color="blue" />
          <StatCard icon={<FaUsers />} title="Total Orders" value={orders.length} color="purple" />
          <StatCard
            icon={<FaRupeeSign />}
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            color="green"
          />
          <StatCard
            icon={<FaClipboardList />}
            title="Delivered Orders"
            value={totalDelivered}
            color="yellow"
          />
        </div>

        {/* Pending & Low Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 border p-5 rounded-xl">
            <h3 className="font-semibold text-lg mb-3 text-gray-700">
              ⚠️ Pending Orders ({totalPending})
            </h3>
            {totalPending === 0 ? (
              <p className="text-gray-500">All orders processed!</p>
            ) : (
              <ul className="space-y-2 text-gray-700">
                {orders
                  .filter((o) => o.orderStatus === "Pending")
                  .map((o) => (
                    <li key={o._id} className="p-2 border rounded-lg">
                      {o.customer?.name} — ₹{o.totalPrice}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="bg-gray-50 border p-5 rounded-xl">
            <h3 className="font-semibold text-lg mb-3 text-gray-700">
              🧯 Low Stock Alerts ({lowStock.length})
            </h3>
            {lowStock.length === 0 ? (
              <p className="text-gray-500">All products well stocked!</p>
            ) : (
              <ul className="space-y-2 text-gray-700">
                {lowStock.map((p) => (
                  <li key={p._id} className="p-2 border rounded-lg">
                    {p.title} — Only {p.stock} left!
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  function StatCard({ icon, title, value, color }) {
    const colors = {
      blue: "bg-blue-100 text-blue-700",
      purple: "bg-purple-100 text-purple-700",
      green: "bg-green-100 text-green-700",
      yellow: "bg-yellow-100 text-yellow-700",
    };
    return (
      <div className={`flex items-center gap-4 p-5 rounded-xl border shadow-sm ${colors[color]}`}>
        <div className="text-3xl">{icon}</div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN LAYOUT
  // =========================================================
  return (
    <div className="flex h-screen bg-gray-100 hide-scrollbar">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg border-r flex flex-col">
        <div className="p-4 text-center border-b">
          <h2 className="text-xl font-bold text-blue-600">🛠️ Admin Panel</h2>
        </div>
        <nav className="flex-1 p-3 space-y-2">
          <button
            onClick={() => setActivePage("dashboard")}
            className={`w-full flex items-center gap-3 p-2 rounded-lg ${
              activePage === "dashboard" ? "bg-blue-600 text-white" : "hover:bg-blue-50"
            }`}
          >
            <FaClipboardList /> Products
          </button>
          <button
            onClick={() => setActivePage("orders")}
            className={`w-full flex items-center gap-3 p-2 rounded-lg ${
              activePage === "orders" ? "bg-blue-600 text-white" : "hover:bg-blue-50"
            }`}
          >
            <FaShoppingCart /> Orders
          </button>
          <button
            onClick={() => setActivePage("analytics")}
            className={`w-full flex items-center gap-3 p-2 rounded-lg ${
              activePage === "analytics" ? "bg-blue-600 text-white" : "hover:bg-blue-50"
            }`}
          >
            <FaChartLine /> Analytics
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="m-3 flex items-center justify-center gap-2 text-sm bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 hide-scrollbar">
        {activePage === "dashboard" && <AdminDashboard />}
        {activePage === "orders" && <Orders />}
        {activePage === "analytics" && <Analytics />}
      </main>
    </div>
  );
}

// --------------------------
// LOGIN COMPONENT
// --------------------------
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ADMIN_EMAIL = "amritmr760@gmail.com";
  const ADMIN_PASSWORD = "amritmr760@gmail.com";

  function handleLogin(e) {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_logged", "true");
      onLogin();
    } else setError("❌ Invalid email or password");
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <FaUserShield className="text-blue-600 text-5xl mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================
// CSS Helper (Hide Scrollbar)
// ==========================
const style = document.createElement("style");
style.textContent = `
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;
document.head.appendChild(style);

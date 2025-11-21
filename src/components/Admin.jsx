// ==========================
// File: components/Admin.jsx
// Saheli Store – Admin Panel (Products + Orders + Analytics + Customer Insights + Excel Export)
// ==========================

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
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
  FaBox,
  FaRupeeSign,
  FaUsers,
  FaUserFriends,
  FaMapMarkedAlt,
  FaStar,
  FaBars,
  FaSyncAlt,
  FaFileCsv,
  FaFileExcel,
  FaBroom,
} from "react-icons/fa";

// --------------------------
// Config
// --------------------------
const API_URL = `https://saheli-backend.vercel.app/api/products`;
const ORDER_URL = `https://saheli-backend.vercel.app/api/orders`;
const ADMIN_LOGGED = "admin_logged";

// --------------------------
// Main Component
// --------------------------
export default function Admin() {
  // Auth + UI states
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem(ADMIN_LOGGED) === "true"
  );
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch initial data after login
  useEffect(() => {
    if (isLoggedIn) {
      refreshAll();
    }
  }, [isLoggedIn]);

  async function fetchProducts() {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data.products || res.data || []);
    } catch (err) {
      console.error("❌ Product Fetch Error:", err);
    }
  }

  async function fetchOrders() {
    try {
      const res = await axios.get(ORDER_URL);
      setOrders(res.data.orders || res.data || []);
    } catch (err) {
      console.error("❌ Order Fetch Error:", err);
    }
  }

  async function refreshAll() {
    try {
      setLoadingData(true);
      await Promise.all([fetchProducts(), fetchOrders()]);
    } finally {
      setLoadingData(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(ADMIN_LOGGED);
    setIsLoggedIn(false);
  }

  if (!isLoggedIn) return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;

  // --------------------------
  // Excel Export (XLSX)
  // --------------------------
  function exportOrdersExcel() {
    if (!orders || orders.length === 0) {
      alert("No orders to export.");
      return;
    }

    const excelData = orders.map((o) => ({
      OrderID: o._id,
      CustomerName: o.customer?.name || "",
      Phone: o.customer?.phone || "",
      Address:
        `${o.customer?.address?.line1 || ""}, ${o.customer?.address?.city || ""}, ${o.customer?.address?.state || ""} - ${o.customer?.address?.pincode || ""}`,
      TotalPrice: o.totalPrice || 0,
      PaymentMethod: o.paymentMethod || "",
      PaymentStatus: o.paymentStatus || "",
      OrderStatus: o.orderStatus || "",
      Date: new Date(o.createdAt).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, `orders_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  // --------------------------
  // Product Dashboard (Add/Edit/Delete)
  // --------------------------
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

    const filtered = products.filter((p) =>
      (p.title || "").toLowerCase().includes(search.toLowerCase())
    );

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
      setEditProduct(null);
    };

    async function addProduct(e) {
      e.preventDefault();
      try {
        const res = await axios.post(API_URL, form);
        setProducts([res.data.product || res.data, ...products]);
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
        resetForm();
        alert("✏️ Updated successfully!");
      } catch (err) {
        console.error(err);
        alert("❌ Failed to update product");
      }
    }

    async function deleteProduct(id) {
      if (!confirm("🗑️ Delete this product permanently?")) return;
      try {
        await axios.delete(`${API_URL}/${id}`);
        setProducts(products.filter((p) => p._id !== id));
        alert("✅ Product deleted successfully!");
      } catch (err) {
        console.error("❌ Delete product error:", err);
        alert("❌ Failed to delete product");
      }
    }

    async function updateStock(id, stock) {
      try {
        const res = await axios.put(`${API_URL}/${id}`, { stock: Number(stock) });
        setProducts(products.map((p) => (p._id === id ? res.data.product || res.data : p)));
      } catch (err) {
        console.error("❌ Update stock error:", err);
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
                    <h3 className="font-semibold text-gray-800 text-lg">{p.title}</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditProduct(p);
                          setForm(p);
                          window.scrollTo({ top: 0, behavior: "smooth" });
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
                    <span className="text-blue-600 font-bold">₹{p.price}</span>
                    <span className="text-xs text-gray-500">{p.category}</span>
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

          <form onSubmit={editProduct ? saveEdit : addProduct} className="space-y-3">
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
                    reader.onloadend = () => setForm({ ...form, image: reader.result });
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
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              className="w-full border p-2 rounded-lg"
            ></textarea>

            <div className="flex gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.recommended}
                  onChange={(e) => setForm({ ...form, recommended: e.target.checked })}
                />
                Recommended
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.bestSeller}
                  onChange={(e) => setForm({ ...form, bestSeller: e.target.checked })}
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
            <button
              type="button"
              onClick={() => { resetForm(); }}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
            >
              Reset
            </button>
          </form>
        </aside>
      </div>
    );
  }

  // --------------------------
  // Orders Section
  // --------------------------
  async function handleStatusChange(id, status) {
    try {
      await axios.put(`${ORDER_URL}/${id}`, { orderStatus: status });
      fetchOrders();
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      alert("❌ Failed to update order status");
    }
  }

  async function deleteOrder(id) {
    if (!confirm("❌ Are you sure? Delete this order permanently?")) return;

    try {
      await axios.delete(`${ORDER_URL}/${id}`);
      fetchOrders();
      alert("🗑️ Order deleted successfully!");
    } catch (err) {
      console.error("❌ Delete Order Error:", err);
      alert("❌ Failed to delete order");
    }
  }

  // Receipt handling: robust
  async function handleReceipt(id, existingUrl) {
    try {
      if (existingUrl) {
        const fullUrl = existingUrl.startsWith("http")
          ? existingUrl
          : `https://saheli-backend.vercel.app${existingUrl}`;

        window.open(fullUrl, "_blank", "noopener,noreferrer");
        return;
      }

      const res = await axios.get(`${ORDER_URL}/receipt/${id}`);
      const pdfUrl =
        res.data?.url ||
        res.data?.pdfUrl ||
        res.data?.receipt?.pdfUrl ||
        null;

      if (pdfUrl) {
        const fullUrl = pdfUrl.startsWith("http")
          ? pdfUrl
          : `https://saheli-backend.vercel.app${pdfUrl}`;

        window.open(fullUrl, "_blank", "noopener,noreferrer");
        fetchOrders();
      } else {
        alert("Receipt generating... refresh after a few seconds.");
        fetchOrders();
      }
    } catch (err) {
      console.error("❌ Receipt Error:", err);
      alert("❌ Failed to open or generate receipt");
      fetchOrders();
    }
  }

  function Orders() {
    const [search, setSearch] = useState("");
    const filtered = orders.filter((o) =>
      (o.customer?.name || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FaShoppingCart className="text-blue-600" /> Manage Orders ({orders.length})
          </h2>

          <div className="flex items-center gap-2">
            <button onClick={exportOrdersExcel} className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700">
              <FaFileExcel /> Export Excel
            </button>
            <button onClick={() => refreshAll()} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200">
              <FaSyncAlt /> Refresh
            </button>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <FaSearch className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer..."
            className="border p-2 rounded w-64"
          />
        </div>

        {filtered.length === 0 ? (
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
                {filtered.map((o, i) => (
                  <tr key={o._id} className="border-b text-center hover:bg-gray-50">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{o.customer?.name}</td>
                    <td className="p-2 text-green-600 font-semibold">₹{o.totalPrice}</td>
                    <td className="p-2">
                      {o.paymentStatus === "Paid" ? "Online Payment" : o.paymentMethod}
                    </td>
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
                    <td className="p-2">{new Date(o.createdAt).toLocaleDateString()}</td>

                    <td className="p-2">
                      <button
                        onClick={() =>
                          handleReceipt(o._id, o.receipt?.pdfUrl || null)
                        }
                        className="text-blue-600 hover:text-blue-800 flex items-center justify-center mx-auto"
                      >
                        <FaDownload />
                      </button>
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

  // --------------------------
  // Analytics Section
  // --------------------------
  function Analytics() {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const totalDelivered = orders.filter((o) => o.orderStatus === "Delivered").length;
    const totalPending = orders.filter((o) => o.orderStatus === "Pending").length;
    const lowStock = products.filter((p) => (p.stock || 0) < 5);

    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <FaChartLine className="text-blue-600" /> Analytics Dashboard
        </h2>

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

  // --------------------------
  // Customer Insights & Behavior (Section 4)
  // --------------------------
  function CustomerInsights() {
    const uniqueCustomers = useMemo(() => {
      const map = new Map();
      orders.forEach((o) => {
        const key = o.customer?.phone || o.customer?.name || o._id;
        if (!map.has(key)) {
          map.set(key, { name: o.customer?.name || "Unknown", phone: o.customer?.phone || "", total: o.totalPrice || 0, orders: 1, city: o.customer?.address?.city || "Unknown" });
        } else {
          const cur = map.get(key);
          cur.total += (o.totalPrice || 0);
          cur.orders += 1;
          map.set(key, cur);
        }
      });
      return Array.from(map.values());
    }, [orders]);

    const totalUniqueCustomers = uniqueCustomers.length;
    const repeatCustomers = uniqueCustomers.filter((c) => c.orders >= 2).length;
    const topCustomers = [...uniqueCustomers].sort((a, b) => b.total - a.total).slice(0, 5);
    const locationDistribution = useMemo(() => {
      const loc = {};
      orders.forEach((o) => {
        const city = o.customer?.address?.city || "Unknown";
        loc[city] = (loc[city] || 0) + 1;
      });
      return Object.entries(loc).sort((a,b)=>b[1]-a[1]);
    }, [orders]);

    const topProducts = useMemo(() => {
      const pmap = {};
      orders.forEach((o) => {
        (o.cartItems || []).forEach((item) => {
          const id = item._id || item.id || item.productId || item.title;
          pmap[id] = pmap[id] || { title: item.title || id, qty: 0 };
          pmap[id].qty += item.qty || 1;
        });
      });
      return Object.values(pmap).sort((a,b)=>b.qty-a.qty).slice(0,5);
    }, [orders]);

    const monthlyNew = useMemo(() => {
      const m = {};
      orders.forEach((o) => {
        const dt = new Date(o.createdAt);
        const key = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}`;
        const phone = o.customer?.phone || o.customer?.name || o._id;
        m[key] = m[key] || new Set();
        m[key].add(phone);
      });
      return Object.entries(m).map(([k,v])=>({ month:k, newCustomers:v.size })).sort((a,b)=>a.month.localeCompare(b.month));
    }, [orders]);

    const inventoryHealth = useMemo(() => {
      if (!products || products.length === 0) return { score: 100, outOfStock:0, lowStock:0 };
      const outOf = products.filter(p=> (p.stock||0) === 0).length;
      const low = products.filter(p=> (p.stock||0) > 0 && (p.stock||0) < 5).length;
      const total = products.length;
      const healthy = total - outOf - low;
      const score = Math.round((healthy / total) * 100);
      return { score, outOfStock: outOf, lowStock: low };
    }, [products]);

    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FaUserFriends className="text-blue-600" /> Customer Insights
          </h2>

          <div className="flex items-center gap-2">
            <button onClick={() => refreshAll()} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200">
              <FaSyncAlt /> Refresh
            </button>
            <button onClick={() => exportOrdersExcel()} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200">
              <FaFileExcel /> Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border bg-blue-50">
            <h4 className="font-medium text-sm text-blue-700">Total Unique Customers</h4>
            <p className="text-2xl font-bold mt-2">{totalUniqueCustomers}</p>
            <p className="text-xs text-gray-600 mt-1">Repeat: {repeatCustomers}</p>
          </div>

          <div className="p-4 rounded-xl border bg-green-50">
            <h4 className="font-medium text-sm text-green-700">Top Customers (by spend)</h4>
            <ul className="mt-2 space-y-1 text-sm">
              {topCustomers.length === 0 ? <li className="text-gray-500">No data</li> :
                topCustomers.map((c, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{c.name || "Unknown"}</span>
                    <span className="font-semibold">₹{c.total}</span>
                  </li>
                ))
              }
            </ul>
          </div>

          <div className="p-4 rounded-xl border bg-yellow-50">
            <h4 className="font-medium text-sm text-yellow-700">Inventory Health</h4>
            <p className="text-2xl font-bold mt-2">{inventoryHealth.score}/100</p>
            <p className="text-xs text-gray-600 mt-1">Out: {inventoryHealth.outOfStock} — Low: {inventoryHealth.lowStock}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-xl">
            <h4 className="font-medium mb-3">Top Ordered Products</h4>
            {topProducts.length === 0 ? <p className="text-gray-500">No orders yet.</p> :
              <ul className="space-y-2 text-sm">
                {topProducts.map((p, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{p.title}</span>
                    <span className="font-semibold">{p.qty}</span>
                  </li>
                ))}
              </ul>
            }
          </div>

          <div className="p-4 border rounded-xl">
            <h4 className="font-medium mb-3">Customer Locations</h4>
            {locationDistribution.length === 0 ? <p className="text-gray-500">No data</p> :
              <ul className="space-y-2 text-sm">
                {locationDistribution.slice(0,10).map(([city, count], i) => (
                  <li key={i} className="flex justify-between">
                    <span>{city}</span>
                    <span className="font-semibold">{count}</span>
                  </li>
                ))}
              </ul>
            }
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Monthly New Customers</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {monthlyNew.length === 0 ? <p className="text-gray-500">No data</p> :
              monthlyNew.slice(-6).map((m, i) => (
                <div key={i} className="p-3 border rounded">
                  <div className="text-sm text-gray-500">{m.month}</div>
                  <div className="text-lg font-bold">{m.newCustomers}</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }

  // --------------------------
  // Support & Settings (small quick actions)
  // --------------------------
  function SupportSettings() {
    function clearLocalCache() {
      if (!confirm("Clear localStorage and reload?")) return;
      localStorage.clear();
      alert("Local storage cleared. Reloading...");
      window.location.reload();
    }
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaUserShield className="text-blue-600" /> Support & Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <h4 className="font-medium">System Info</h4>
            <p className="text-sm text-gray-600 mt-2">API: <code className="text-xs">{API_URL}</code></p>
            <p className="text-sm text-gray-600">Orders API: <code className="text-xs">{ORDER_URL}</code></p>
            <p className="text-sm text-gray-600">Server Time: <code className="text-xs">{new Date().toISOString()}</code></p>
          </div>

          <div className="p-4 border rounded">
            <h4 className="font-medium">Quick Actions</h4>
            <div className="flex gap-2 mt-3">
              <button onClick={() => refreshAll()} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center gap-2"><FaSyncAlt/> Refresh</button>
              <button onClick={() => exportOrdersExcel()} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center gap-2"><FaFileExcel/> Export</button>
              <button onClick={() => clearLocalCache()} className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center gap-2"><FaBroom/> Clear Cache</button>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Support Messages</h4>
          <p className="text-sm text-gray-500">(Placeholder) This can show recent customer support messages or tickets — integrate later with /api/support.</p>
        </div>
      </div>
    );
  }

  // --------------------------
  // Main Layout Return
  // --------------------------
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-64 bg-white shadow-lg border-r flex-col">
        <div className="p-4 text-center border-b">
          <h2 className="text-xl font-bold text-blue-600">Admin Panel</h2>
        </div>

        <nav className="flex-1 p-3 space-y-2">
          <button
            onClick={() => setActivePage("dashboard")}
            className={`w-full flex items-center gap-3 p-2 rounded-lg ${activePage === "dashboard" ? "bg-blue-600 text-white" : "hover:bg-blue-50"}`}
          >
            <FaClipboardList /> Products
          </button>

          <button
            onClick={() => setActivePage("orders")}
            className={`w-full flex items-center gap-3 p-2 rounded-lg ${activePage === "orders" ? "bg-blue-600 text-white" : "hover:bg-blue-50"}`}
          >
            <FaShoppingCart /> Orders
          </button>

          <button
            onClick={() => setActivePage("analytics")}
            className={`w-full flex items-center gap-3 p-2 rounded-lg ${activePage === "analytics" ? "bg-blue-600 text-white" : "hover:bg-blue-50"}`}
          >
            <FaChartLine /> Analytics
          </button>

          <button
            onClick={() => setActivePage("customers")}
            className={`w-full flex items-center gap-3 p-2 rounded-lg ${activePage === "customers" ? "bg-blue-600 text-white" : "hover:bg-blue-50"}`}
          >
            <FaUserFriends /> Customers
          </button>

          <button
            onClick={() => setActivePage("support")}
            className={`w-full flex items-center gap-3 p-2 rounded-lg ${activePage === "support" ? "bg-blue-600 text-white" : "hover:bg-blue-50"}`}
          >
            <FaUserShield /> Support & Settings
          </button>
        </nav>

        <div className="m-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-sm bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileDrawerOpen(true)} className="text-xl text-blue-600"><FaBars/></button>
          <div className="font-bold text-lg text-blue-600">Admin Panel</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => refreshAll()} className="p-2 bg-gray-100 rounded"><FaSyncAlt/></button>
          <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded"><FaSignOutAlt/></button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-white p-4 border-r shadow h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-blue-600">Menu</h3>
              <button onClick={() => setMobileDrawerOpen(false)} className="p-2"><FaTimes/></button>
            </div>

            <nav className="space-y-2">
              <button onClick={() => { setActivePage("dashboard"); setMobileDrawerOpen(false); }} className="w-full text-left flex items-center gap-3 p-2 rounded hover:bg-gray-100">Products</button>
              <button onClick={() => { setActivePage("orders"); setMobileDrawerOpen(false); }} className="w-full text-left flex items-center gap-3 p-2 rounded hover:bg-gray-100">Orders</button>
              <button onClick={() => { setActivePage("analytics"); setMobileDrawerOpen(false); }} className="w-full text-left flex items-center gap-3 p-2 rounded hover:bg-gray-100">Analytics</button>
              <button onClick={() => { setActivePage("customers"); setMobileDrawerOpen(false); }} className="w-full text-left flex items-center gap-3 p-2 rounded hover:bg-gray-100">Customers</button>
              <button onClick={() => { setActivePage("support"); setMobileDrawerOpen(false); }} className="w-full text-left flex items-center gap-3 p-2 rounded hover:bg-gray-100">Support</button>
            </nav>

            <div className="mt-6">
              <button onClick={() => { setMobileDrawerOpen(false); handleLogout(); }} className="w-full bg-red-500 text-white py-2 rounded">Logout</button>
            </div>
          </div>

          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:pl-8 md:pr-8 mt-16 md:mt-0">
        {loadingData && (
          <div className="mb-4 p-3 bg-yellow-50 border rounded text-sm text-yellow-800 flex items-center gap-2">
            <FaSyncAlt className="animate-spin"/> Refreshing data...
          </div>
        )}

        {activePage === "dashboard" && <AdminDashboard />}
        {activePage === "orders" && <Orders />}
        {activePage === "analytics" && <Analytics />}
        {activePage === "customers" && <CustomerInsights />}
        {activePage === "support" && <SupportSettings />}
      </main>
    </div>
  );
}

// --------------------------
// Admin Login Component
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

// --------------------------
// CSS Helper (Hide Scrollbar)
// --------------------------
const style = document.createElement("style");
style.textContent = `
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;
document.head.appendChild(style);

// ==========================
// File: App.jsx
// Saheli Products – Router Setup + Footer + Clean Entry
// ==========================
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Front from "./components/Front.jsx";
import Cart from "./components/Cart.jsx";
import Admin from "./components/Admin.jsx";
import ProductView from "./components/ProductView.jsx";

function Navbar() {
  const location = useLocation();

  // (Optional) Active link helper
  const linkClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-blue-600 text-white shadow"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className="hidden"></nav> // Placeholder (you can design later)
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-8">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Left */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Saheli Products</h3>
          <p className="text-sm">
            A simple and smart eCommerce system made for managing and browsing
            products easily — built by{" "}
            <span className="font-medium text-blue-400">Amrit Kumar</span>.
          </p>
        </div>

        {/* Center */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                🏠 Home
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-blue-400 transition">
                🛒 Cart
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-blue-400 transition">
                ⚙️ Admin Panel
              </Link>
            </li>
          </ul>
        </div>

        {/* Right */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">Contact Us</h4>
          <p className="text-sm">
            📧{" "}
            <a
              href="mailto:amritmr760@gmail.com"
              className="text-blue-400 hover:underline"
            >
              amritmr760@gmail.com
            </a>
          </p>
          <p className="text-sm mt-1">📞 +91 9315868930</p>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="bg-gray-800 text-center py-3 text-xs text-gray-400">
        © {new Date().getFullYear()} Saheli Products. All rights reserved.
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto w-full">
        <Routes>
          <Route path="/" element={<Front />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductView />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

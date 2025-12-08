// ==========================
// File: App.jsx
// Saheli Products – Full Production Setup + Built-in ScrollToTop
// ==========================

import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Components
import Front from "./components/Front.jsx";
import Cart from "./components/Cart.jsx";
import Admin from "./components/Admin.jsx";
import ProductView from "./components/ProductView.jsx";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaPhoneAlt,
  FaHome,
  FaShoppingCart,
} from "react-icons/fa";

import Privacy from "./components/pages/Privacy.jsx";
import Return from "./components/pages/Return.jsx";
import Shipping from "./components/pages/Shipping.jsx";
import Terms from "./components/pages/Terms.jsx";
import Products from "./components/pages/Products.jsx";

function Navbar() {
  return <nav className="hidden"></nav>;
}

// ==========================
// ✅ BUILT-IN SCROLL TO TOP
// ==========================
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

// ==========================
// ⚡ Footer With Policy Links
// ==========================
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h3 className="text-xl text-white mb-3">
            Saheli Products
          </h3>
          <p className="text-sm leading-6">
            India's simple and smart shopping platform delivering a smooth and fast experience.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">

            <li className="flex items-center gap-2">
              <FaHome className="text-blue-400" />
              <Link to="/" className="hover:text-blue-400 transition">Home</Link>
            </li>

            <li className="flex items-center gap-2">
              <FaShoppingCart className="text-blue-400" />
              <Link to="/cart" className="hover:text-blue-400 transition">Cart</Link>
            </li>

          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="text-lg text-white mb-3">Our Policies</h4>
          <ul className="space-y-2 text-sm">

            <li>
              <Link to="/Return-Refund" className="hover:text-blue-400 transition">
                Return Policy
              </Link>
            </li>

            <li>
              <Link to="/Shipping-policy" className="hover:text-blue-400 transition">
                Shipping Policy
              </Link>
            </li>

            <li>
              <Link to="/privacy-policy" className="hover:text-blue-400 transition">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link to="/terms-and-conditions" className="hover:text-blue-400 transition">
                Terms & Conditions
              </Link>
            </li>

          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg text-white mb-3">Contact Us</h4>

          <p className="text-sm flex items-center gap-2">
            <FaEnvelope className="text-blue-400" />
            <a
              href="mailto:amritmr760@gmail.com"
              className="text-blue-400 hover:underline"
            >
              amritmr760@gmail.com
            </a>
          </p>

          <p className="text-sm flex items-center gap-2 mt-2">
            <FaPhoneAlt className="text-blue-400" /> 
            +91 9315868930
          </p>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-gray-400 text-sm">Follow us:</span>

            <div className="flex gap-4 text-xl">
              <FaFacebookF className="cursor-pointer hover:text-blue-400" />
              <FaInstagram className="cursor-pointer hover:text-pink-400" />
              <FaTwitter className="cursor-pointer hover:text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="bg-gray-800 text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Saheli Products — Built by Amrit Kumar.
        All rights reserved.
      </div>
    </footer>
  );
}

// ==========================
// ✅ APP – Main Router With ScrollToTop Inside
// ==========================
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* ✅ SCROLL RESET ON EVERY ROUTE CHANGE */}
      <ScrollToTop />

      <main className="flex-1 mx-auto w-full">
        <Routes>
          <Route path="/" element={<Front />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductView />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/products" element={<Products />} />

          {/* Policy Pages */}
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/Return-Refund" element={<Return />} />
          <Route path="/Shipping-policy" element={<Shipping />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

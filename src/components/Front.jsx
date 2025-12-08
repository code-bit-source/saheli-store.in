// ==========================
// File: components/Front.jsx
// Saheli Products – Scroll Fix + Dynamic Backend + Mobile Responsive Cards
// ==========================
import { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";
import {
  FaShoppingCart,
  FaSearch,
  FaCheckCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CiShoppingTag } from "react-icons/ci";
import Banner from "./Banner";

// ==========================
// 🔹 Config
// ==========================
const CART_KEY = "ecom_cart";
const API_URL = `https://saheli-backend.vercel.app/api/products`;

// ==========================
// 🔹 Local Storage Helpers
// ==========================
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

// ==========================
// 🔹 Main Component
// ==========================
export default function Front() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(readCart());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [showToast, setShowToast] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true); // ⭐ FIX
  const cardsRef = useRef([]);
  const navigate = useNavigate();

  // ==========================
  // 🔹 Fetch Products
  // ==========================
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get(API_URL);
        setProducts(res.data.products || res.data || []);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      } finally {
        setTimeout(() => setLoading(false), 100);
      }
    }
    fetchProducts();
  }, []);

  // ==========================
  // 🔥 LOADER (NO HOOK ERROR)
  // ==========================
  const Loader = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 z-[9999]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

        <h1 className="mt-6 text-2xl font-bold   text-blue-700 tracking-wide animate-pulse">
          Saheli <span className="text-gray-700">Store…</span>
        </h1>

        <div className="text-sm text-gray-600 flex items-center text-center gap-3 mt-2">
         <h1> Loading your experience</h1>  <CiShoppingTag className="text-xl" />
        </div>
      </div>
    </div>
  );

  // ==========================
  // 🔹 GSAP Animation
  // ==========================
  useEffect(() => {
    const validCards = cardsRef.current.filter((el) => el);
    if (validCards.length > 0) {
      gsap.fromTo(
        validCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    }
  }, [products]);

  // ==========================
  // 🔹 Filters + Sorting
  // ==========================
  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category || "Uncategorized"))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let res = [...products];
    if (query)
      res = res.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(query.toLowerCase()) ||
          (p.description || "").toLowerCase().includes(query.toLowerCase())
      );
    if (category !== "All")
      res = res.filter((p) => (p.category || "Uncategorized") === category);
    if (sort === "low") res.sort((a, b) => a.price - b.price);
    if (sort === "high") res.sort((a, b) => b.price - a.price);
    if (sort === "new") res.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    return res;
  }, [products, query, category, sort]);

  // ==========================
  // 🔹 Recommended / Best Sellers
  // ==========================
  const randomize = (arr) => arr.sort(() => 0.5 - Math.random()).slice(0, 3);
  const recommended = randomize(products.filter((p) => p.recommended));
  const bestSellers = randomize(products.filter((p) => p.bestSeller));

  // ==========================
  // 🔹 Cart
  // ==========================
  function addToCart(product) {
    if (product.stock <= 0) return;
    const existing = cart.find((c) => c._id === product._id);

    const updated = existing
      ? cart.map((c) =>
          c._id === product._id ? { ...c, qty: c.qty + 1 } : c
        )
      : [...cart, { ...product, qty: 1 }];

    saveCart(updated);
    setCart(updated);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 500);
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // ==========================
  // 🔹 JSX UI
  // ==========================
  return (
    <>
      {loading && <Loader />}

      <div
        className="min-h-screen w-full bg-fixed bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("https://plus.unsplash.com/premium_photo-1681433429713-5c75cfae63fa?auto=format&fit=crop&q=80&w=1200")`,
        }}
      >
        <div className="min-h-screen w-full bg-white/55 backdrop-blur-[1px]">
          {/* 🔹 Navbar */}
          <header className="sticky top-0 z-50 bg-white shadow-md w-full">
            <div className="flex justify-between items-center px-6 md:px-10 py-3">
              <div
                className="flex items-center gap-2 text-xl sm:text-2xl   text-blue-600 cursor-pointer"
                onClick={() => {
                  navigate("/");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Saheli<span className="text-gray-700 font-light">Store</span>
              </div>

              <div className="hidden md:flex items-center border border-gray-300 rounded-full px-4 py-2 w-[450px] lg:w-[600px] bg-gray-50 shadow-sm">
                <FaSearch className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 text-gray-700 bg-transparent outline-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="/cart"
                  className="relative flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition"
                >
                  <FaShoppingCart />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-1.5 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </a>

                <button
                  className="md:hidden text-blue-600 text-xl"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
              </div>
            </div>

            {menuOpen && (
              <div className="md:hidden bg-gray-100 px-4 py-3 border-t">
                <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-sm">
                  <FaSearch className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 text-gray-700 outline-none text-sm"
                  />
                </div>
              </div>
            )}
          </header>



<Banner />
        





              
          {/* 🔹 Filters */}
          <div className="w-full px-6 mt-4 flex flex-wrap justify-between items-center gap-3">
              

            <div className="flex flex-wrap gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border p-2 rounded-md bg-white shadow-sm text-sm"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border p-2 rounded-md bg-white shadow-sm text-sm"
              >
                <option value="default">Sort By</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
                <option value="new">Newest</option>
              </select>
            </div>
          </div>

          {/* 🔹 Products Grid */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 sm:px-6 py-8">

                  

            <div className="lg:col-span-3">
              <h2 className="text-lg sm:text-2xl font-bold mb-4 text-gray-800">
                Featured Products
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {filteredProducts.length === 0 ? (
                  <div className="col-span-full bg-white rounded-xl p-6 text-center text-gray-500 shadow-sm border">
                    No products found.
                  </div>
                ) : (
                  filteredProducts.map((p, index) => (
                    <ProductCard
                      key={p._id}
                      product={p}
                      index={index}
                      cardsRef={cardsRef}
                      addToCart={addToCart}
                    />
                  ))
                )}
              </div>
            </div>

            {/* 🔹 Sidebar */}
            <aside className="space-y-8 mt-6 lg:mt-0">
              <SidebarSection
                title="Recommended"
                color="blue"
                products={recommended}
                badge="Top"
              />
              <SidebarSection
                title="Best Sellers"
                color="red"
                products={bestSellers}
                badge="Hot"
              />
            </aside>
          </div>

          {/* 🔹 Category Wise Section */}
          <div className="w-full mt-10 px-4 sm:px-6 space-y-10">
            {categories
              .filter((c) => c !== "All")
              .map((cat) => {
                const items = products.filter((p) => p.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat}>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                      {cat}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                      {items.map((p, i) => (
                        <ProductCard
                          key={p._id}
                          product={p}
                          index={i}
                          addToCart={addToCart}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* 🔹 Toast */}
          {showToast && (
            <div className="fixed top-5 right-5 bg-green-500 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow-lg animate-bounce z-50">
              <FaCheckCircle /> Added to Cart
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ==========================
// 🔹 Product Card
// ==========================
function ProductCard({ product, index, cardsRef, addToCart }) {
  const navigate = useNavigate();

  return (
    <div
      key={product._id}
      ref={(el) => cardsRef && (cardsRef.current[index] = el)}
      onClick={() => {
        navigate(`/product/${product._id}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="group bg-white rounded-2xl border border-gray-100 
      shadow-sm hover:shadow-md transition-all duration-300 
      cursor-pointer relative flex flex-col justify-between 
      h-[360px] sm:h-[410px] overflow-hidden"
    >
      {/* IMAGE */}
      <div className="flex justify-center items-center bg-gray-100/60 h-[220px] sm:h-[260px] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 
          group-hover:scale-105"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-[13px] text-gray-800 truncate leading-5">
            {product.title}
          </h3>

          <p className="text-[11px] text-gray-500 mt-1">
            {product.category}
          </p>
        </div>

        {/* PRICE + BUTTON */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-700">
            ₹{product.price}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            disabled={product.stock <= 0}
            className={`px-4 py-1.5 rounded-full text-[11px] transition
            ${
              product.stock <= 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
            }`}
          >
            {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}



// ==========================
// 🔹 Sidebar Section
// ==========================
function SidebarSection({ title, color, products, badge }) {
  const textColor = color === "blue" ? "text-blue-600" : "text-red-600";
  const borderColor = color === "blue" ? "border-blue-100" : "border-red-100";
  const bgGrad =
    color === "blue" ? "from-white to-blue-50" : "from-white to-red-50";

  return (
    <div
      className={`bg-gradient-to-br ${bgGrad} p-5 rounded-2xl shadow-lg border ${borderColor}`}
    >
      <h4
        className={`flex items-center justify-center gap-2 text-xl font-bold ${textColor} mb-5`}
      >
        <MdOutlineShoppingCart /> {title}
      </h4>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 italic text-sm">
          No products yet ✨
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.location.href = `/product/${p._id}`;
              }}
              className="group flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <img
                src={p.image}
                className="w-14 h-12 sm:w-16 sm:h-14 object-cover rounded-lg group-hover:scale-110 transition-transform"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                  {p.title}
                </p>
                <p className="text-xs text-gray-600 mt-1">₹{p.price}</p>
              </div>
              <span
                className={`text-[10px] bg-${color}-500 text-white px-2 py-[2px] rounded-full`}
              >
                {badge}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const API_URL = `https://saheli-backend.vercel.app/api/products`;

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        const list = data.products || data || [];

        setProducts(list);
        groupByCategory(list);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // ✅ GROUP BY CATEGORY
  const groupByCategory = (list) => {
    const grouped = list.reduce((acc, item) => {
      const category = item.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
    setGroupedProducts(grouped);
  };

  // ✅ LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading products...
      </div>
    );
  }

  // ✅ ERROR UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-10">
    <Navbar />

    {/* ✅ PAGE HEADER */}
    <div className="max-w-7xl mt-16 mx-auto mb-14 text-center">
      <h1 className="text-2xl text-gray-900 tracking-wide">
        Saheli Store Collection
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Discover hand-picked styles made for everyday elegance
      </p>
    </div>

    {/* ✅ CATEGORY-WISE PRODUCTS */}
    <div className="max-w-7xl mx-auto space-y-20">
      {Object.keys(groupedProducts).map((category) => (
        <div key={category}>

          {/* ✅ HIGHLIGHTED CATEGORY TITLE */}
          <div className="mb-7 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Highlight badge line */}
              <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-200" />

              <h2 className="text-lg text-gray-900 tracking-wide relative">
                {category}

                {/* Soft underline glow */}
                <span className="absolute left-0 -bottom-1 w-full h-[2px] 
                bg-gradient-to-r from-yellow-300 to-transparent"></span>
              </h2>
            </div>

            {/* Item Count Badge */}
            <span className="text-[11px] px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
              {groupedProducts[category].length} items
            </span>
          </div>

          {/* ✅ PRODUCTS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-7">
            {groupedProducts[category].map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group bg-white rounded-2xl shadow-sm 
                hover:shadow-lg hover:-translate-y-1 transition-all duration-300 
                cursor-pointer overflow-hidden flex flex-col"
              >
                {/* ✅ IMAGE */}
                <div className="h-[230px] bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition 
                    duration-500 group-hover:scale-110"
                  />
                </div>

                {/* ✅ CONTENT */}
                <div className="p-4 flex flex-col gap-2 flex-grow">
                  <h3 className="text-sm text-gray-900 line-clamp-2 leading-snug">
                    {product.title}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {product.category}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="text-sm text-gray-900">
                      ₹{product.price}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product._id}`);
                      }}
                      className="text-[11px] px-3 py-1.5 rounded-full 
                      bg-yellow-400 hover:bg-yellow-300 
                      text-gray-900 transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  </div>
);

};

export default Products;

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { FiShoppingBag } from "react-icons/fi";

const SaheliBanner = () => {
  const navigate = useNavigate();
  const bannerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      bannerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );
  }, []);

  const productImages = [
    "https://images.unsplash.com/photo-1520975916090-3105956dac38", // kurti / dress
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9", // beauty
    "https://plus.unsplash.com/premium_photo-1661645433820-24c8604e4db5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // bags / accessories
  ];

  return (
    <motion.div
      ref={bannerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full min-h-[420px] flex flex-col md:flex-row items-center justify-between 
      px-8 md:px-20 py-16   overflow-hidden 
      bg-gradient-to-br from-[#f8fbff] via-[#eef5ff] to-[#fdeff4] shadow-xl"
    >
      {/* Soft Background Orbs */}
      <div className="absolute -top-24 -left-24 w-[260px] h-[260px] bg-blue-200/40 rounded-full blur-[120px]" />
      <div className="absolute -bottom-24 -right-24 w-[260px] h-[260px] bg-rose-200/40 rounded-full blur-[120px]" />

      {/* LEFT CONTENT */}
      <div className="relative z-10 max-w-xl text-gray-700">
        <span className="inline-block mb-4 px-5 py-1.5 text-sm rounded-full 
        bg-white shadow text-gray-600">
          ✦ Saheli Store Exclusive
        </span>

        <h1 className="text-4xl md:text-5xl font-light leading-tight mb-5 text-gray-800">
          Everyday Elegance <br />
          <span className="text-gray-900">For Modern Women</span>
        </h1>

        <p className="text-base md:text-lg text-gray-600 mb-9">
          Thoughtfully curated fashion, beauty & lifestyle essentials 
          designed for comfort, confidence & grace.
        </p>

        {/* SINGLE SHOP BUTTON */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-3 px-9 py-3.5 rounded-full 
          bg-gradient-to-r from-blue-500 to-rose-400 text-white text-base
          hover:opacity-90 transition shadow-lg"
        >
          <FiShoppingBag className="text-lg" />
          Shop Collection
        </button>
      </div>

      {/* ✅ RIGHT PRODUCT IMAGE CARDS */}
      <div className="relative z-10 mt-16 md:mt-0 flex gap-7">
        {productImages.map((img, i) => (
          <motion.div
            key={i}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.2 }}
            className={`w-[120px] h-[180px] rounded-3xl 
            bg-white shadow-lg overflow-hidden
            ${i === 0 ? "rotate-12" : i === 1 ? "-rotate-6" : "rotate-6"}`}
          >
            <img
              src={img}
              alt="product"
              className="w-full h-full object-cover rounded-3xl"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SaheliBanner;

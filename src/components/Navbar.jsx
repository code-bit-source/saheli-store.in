import { Link, useLocation } from "react-router-dom";
 

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="w-full bg-white/80 backdrop-blur-md  shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">

        {/* ✅ BRAND NAME */}
        <Link
          to="/"
          className="text-lg sm:text-xl tracking-wide text-gray-800 hover:text-gray-900 transition"
        >
          Saheli Store
        </Link>

        {/* ✅ NAV LINKS */}
        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <Link
            to="/"
            className={`hover:text-gray-900 transition ${
              location.pathname === "/" ? "text-gray-900" : ""
            }`}
          >
            Home
          </Link>

           
        </nav>
      </div>
    </header>
  );
}

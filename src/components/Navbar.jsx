import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { admin } = useAuth();
  const navigate = useNavigate();

  return (
    <header>
      {bannerVisible && (
        <div className="bg-black text-white text-center text-xs py-2 px-8 relative">
          Sign up and get 20% off to your first order.{" "}
          <span className="underline font-semibold cursor-pointer">Sign Up Now</span>
          <button
            onClick={() => setBannerVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-base leading-none"
          >
            &#x2715;
          </button>
        </div>
      )}

      <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect y="3" width="22" height="2" rx="1" fill="#000"/>
              <rect y="10" width="22" height="2" rx="1" fill="#000"/>
              <rect y="17" width="22" height="2" rx="1" fill="#000"/>
            </svg>
          </button>

          <Link to="/" className="text-xl md:text-2xl font-black tracking-tight text-black shrink-0">
            SHOP.CO
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <span className="cursor-pointer hover:text-black flex items-center gap-1">
              Shop
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <Link to="/" className="hover:text-black">On Sale</Link>
            <Link to="/" className="hover:text-black">New Arrivals</Link>
            <Link to="/" className="hover:text-black">Brands</Link>
          </div>

          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2 flex-1 max-w-xs">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="#9CA3AF" strokeWidth="1.5"/>
              <path d="M11 11l3 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search for products..." className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"/>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="hidden md:flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4.5v15m7.5-7.5h-15"/>
              </svg>
              Admin
            </Link>
            <button className="md:hidden">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="7" stroke="#000" strokeWidth="1.5"/>
                <path d="M15 15l3 3" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M2.5 2.5h2l2.7 10.5h9l2-7H6.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="18" r="1.2" fill="#000"/>
                <circle cx="17" cy="18" r="1.2" fill="#000"/>
              </svg>
            </button>
            <button>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="8" r="4" stroke="#000" strokeWidth="1.5"/>
                <path d="M3 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t mt-3 pt-3 pb-2 flex flex-col gap-3 text-sm font-medium text-gray-700">
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="#9CA3AF" strokeWidth="1.5"/>
                <path d="M11 11l3 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input type="text" placeholder="Search..." className="bg-transparent outline-none w-full text-sm"/>
            </div>
            <span className="cursor-pointer px-1">Shop</span>
            <span className="cursor-pointer px-1">On Sale</span>
            <span className="cursor-pointer px-1">New Arrivals</span>
            <span className="cursor-pointer px-1">Brands</span>
          </div>
        )}
      </nav>
    </header>
  );
}

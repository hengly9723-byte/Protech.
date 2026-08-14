import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/cpu-logo-black-bold2.png";

const Navbar = ({ user, onOpenAuth, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = user?.full_name || user?.email || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="h-[60px] md:h-[75px] w-[100%] md:w-[93%] mx-auto mt-6 rounded-full bg-[#ffffff5f] border border-white/60 shadow-[-5px_-5px_15px_rgba(255,255,255,1),_6px_6px_18px_rgba(0,0,0,0.08)] backdrop-blur-md">
      <nav className="h-full flex items-center justify-between px-2 md:px-3">
        {/* Logo Section */}
        <a
          href="#"
          className="px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-[#e4ebed] flex items-center gap-2 transition hover:opacity-90"
        >
          <img className="w-6 md:w-8" src={logo} alt="Protech logo" />
          <h1 className="font-orbitron text-xl md:text-2xl font-bold tracking-wide">
            Protech.
          </h1>
        </a>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          <a href="#" className="hover:text-black transition">
            Home
          </a>
          <a href="#" className="hover:text-black transition">
            Products
          </a>
          <a href="#" className="hover:text-black transition">
            About
          </a>
        </div>

        {/* Auth / User Action Button */}
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 px-1 py-1 md:px-2 md:py-1.5 rounded-full bg-white text-black text-md font-semibold hover:bg-[#ffffff5f] transition shadow-md active:scale-95 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold uppercase">
                {userInitial}
              </div>
              <span className="max-w-[120px] truncate">{userName}</span>
              <svg
                className={`w-4 h-4 text-gray-300 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {user.full_name || "User"}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition font-medium flex items-center gap-2 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-8 py-3.5 rounded-full bg-black text-white text-md font-semibold hover:bg-gray-800 transition shadow-md active:scale-95 cursor-pointer"
          >
            Sign In
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

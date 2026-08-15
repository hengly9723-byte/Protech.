import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/cpu-logo-black-bold2.png";
import search from "../assets/search-icon-centered.svg";

const Navbar = ({ user, onOpenAuth, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
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

  // Reset avatar error when user changes (e.g. new login)
  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatar_url]);

  const displayName = user?.full_name || user?.email?.split("@")[0] || "User";
  const userInitial = displayName.charAt(0).toUpperCase();
  const hasAvatar = user?.avatar_url && !avatarError;

  return (
    <header className="h-[60px] md:h-[75px] w-[100%] md:w-[93%] mx-auto mt-6 rounded-full bg-[#ffffff5f] border border-white/60 shadow-[-5px_-5px_15px_rgba(255,255,255,1),_6px_6px_18px_rgba(0,0,0,0.08)] backdrop-blur-md">
      <nav className="h-full flex items-center justify-between px-2 md:px-3">
        <div className="flex items-center gap-4">
          {/* Logo Section */}
          <a
            href="#"
            className="shadow-xs px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-[#e4ebed] flex items-center gap-2 transition hover:opacity-90"
          >
            <img className="w-6 md:w-8" src={logo} alt="Protech logo" />
            <h1 className="font-orbitron text-xl md:text-2xl font-bold tracking-wide">
              Protech.
            </h1>
          </a>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Products..."
              className="shadow-xs w-75 h-10 pl-4 pr-14 py-6.5 rounded-full border-none bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 truncate"
            />
            <button className="flex transition shadow-xs active:scale-95 justify-center items-center absolute top-1 right-1 w-11 h-11 bg-black rounded-full text-white cursor-pointer">
              <img className="w-5" src={search} alt="search icon" />
            </button>
          </div>
        </div>

        {/* Auth / User Action Button */}
        {user ? (
          <div className="relative" ref={menuRef}>
            {/* Profile Trigger Button */}
            <button
              id="user-menu-trigger"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 px-1 py-1 md:px-2 md:py-1.5 rounded-full bg-white text-black font-semibold hover:bg-gray-50 transition shadow-xs active:scale-95 cursor-pointer"
            >
              {/* Avatar: Google photo or initial fallback */}
              {hasAvatar ? (
                <img
                  src={user.avatar_url}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm text-white font-bold uppercase">
                  {userInitial}
                </div>
              )}

              {/* Name + email stacked — hidden on small screens */}
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 leading-tight max-w-[110px] truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-gray-400 leading-tight max-w-[110px] truncate">
                  {user.email}
                </p>
              </div>

              {/* Chevron */}
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
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
              <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                {/* Profile Header */}
                <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                  {hasAvatar ? (
                    <img
                      src={user.avatar_url}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg text-white font-bold uppercase shadow-md flex-shrink-0">
                      {userInitial}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                    {user.role && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-100 text-blue-700 capitalize">
                        {user.role}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sign Out */}
                <button
                  id="sign-out-btn"
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition font-medium flex items-center gap-2.5 cursor-pointer"
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
            id="sign-in-btn"
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

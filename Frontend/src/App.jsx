import React, { useState } from "react";
import Product from "./page/Product";
import Navbar from "./components/Navbar";
import Auth from "./page/Auth";

const App = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#cfe8f2] via-[#e6f1f3] to-[#f0f1da] p-4 sm:p-6 flex flex-col gap-6">
      {/* Branded background accents */}
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-[#4f7cff]/30 to-[#8ec5ff]/10 blur-3xl -z-10" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-[#ffd166]/30 blur-3xl -z-10" />
      <div aria-hidden className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[24rem] h-[24rem] rounded-full bg-[#a8e6ff]/25 blur-3xl -z-10" />

      <Navbar 
        user={user} 
        onOpenAuth={() => setShowAuthModal(true)} 
        onLogout={handleLogout} 
      />

      <main className="w-full max-w-7xl mx-auto">
        {/* <Product /> */}
      </main>

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold text-xl z-10 cursor-pointer"
            >
              ✕
            </button>
            <Auth onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
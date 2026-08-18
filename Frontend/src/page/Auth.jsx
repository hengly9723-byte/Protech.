import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../services/api";
import logo from "../assets/cpu-logo-black-bold2.png";

const Auth = ({ onLoginSuccess }) => {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Check if there's any remembered user info for personalized greeting
  const savedUser = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setMessage({ text: "", type: "" });
      setLoading(true);
      try {
        const token = tokenResponse.access_token;
        const response = await googleLogin(token);

        setMessage({
          text: response.data.message || "Google Login Successful!",
          type: "success",
        });

        if (response.data.access_token) {
          localStorage.setItem("access_token", response.data.access_token);
          localStorage.setItem("refresh_token", response.data.refresh_token);
        }

        if (response.data.user && onLoginSuccess) {
          onLoginSuccess(response.data.user);
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Google Sign-In failed on backend verification.";
        setMessage({ text: errorMsg, type: "error" });
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setMessage({
        text: "Google Sign-In was cancelled or failed to initialize.",
        type: "error",
      });
    },
  });

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl shadow-blue-900/10">
        {/* Feedback Message */}
        {message.text && (
          <div
            className={`p-3 mb-6 rounded-xl text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Logo + Wordmark */}
        <div className="flex flex-col items-center mb-8">
          <img className="w-16 md:w-20" src={logo} alt="Protech logo" />
          <h1 className="font-orbitron text-3xl md:text-4xl font-bold tracking-wide mt-3">
            Protech.
          </h1>

          <h2 className="text-center text-xl font-semibold text-gray-800 mt-6">
            Welcome to Protech
          </h2>
          <p className="text-center text-gray-500 text-sm mt-1">
            Sign in with Google to continue.
          </p>
        </div>

        {/* Custom Google Sign-In Pill Button */}
        <div className="flex flex-col items-center justify-center w-full">
          <button
            type="button"
            onClick={() => !loading && login()}
            disabled={loading}
            className="w-full max-w-sm flex items-center justify-between gap-3 bg-[#4285F4] hover:bg-[#3367D6] active:scale-[0.98] text-white px-3.5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {/* Left: Profile Avatar (same size as Google icon on the right) */}
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-white/20 border border-white/30">
              {savedUser?.avatar_url ? (
                <img
                  src={savedUser.avatar_url}
                  alt={savedUser.full_name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>

            {/* Middle: Text / Name */}
            <div className="flex flex-col text-left flex-1 min-w-0 pr-1">
              <span className="text-sm font-semibold truncate leading-tight">
                {loading
                  ? "Signing in..."
                  : savedUser?.full_name
                  ? `Sign in as ${savedUser.full_name}`
                  : "Sign in with Google"}
              </span>
              {savedUser?.email && !loading && (
                <span className="text-xs text-blue-100 truncate leading-tight mt-0.5">
                  {savedUser.email}
                </span>
              )}
            </div>

            {/* Right: Google 'G' Logo inside White Circle (same size as avatar on left) */}
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm p-1.5">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../services/api";
import logo from "../assets/cpu-logo-black-bold2.png";

const Auth = ({ onLoginSuccess }) => {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setMessage({ text: "", type: "" });
    setLoading(true);
    try {
      const idToken = credentialResponse.credential;
      const response = await googleLogin(idToken);

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
  };

  const handleGoogleError = () => {
    setMessage({
      text: "Google Sign-In was cancelled or failed to initialize.",
      type: "error",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="w-full max-w-md p-10 sm:p-12 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl shadow-blue-900/10">
        {/* Feedback Message */}
        {message.text && (
          <div
            className={`p-3 mb-6 rounded-lg text-sm ${
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

          <h2 className="text-center text-xl font-semibold text-gray-800 mt-8">
            Welcome to Protech
          </h2>
          <p className="text-center text-gray-500 mt-2">
            Sign in with Google to continue.
          </p>
        </div>

        {/* Google Sign-In — the only authentication method */}
        <div className="flex flex-col items-center justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_blue"
            shape="pill"
            size="large"
            text="signin_with"
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
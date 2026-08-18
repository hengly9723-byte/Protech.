import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { registerUser, loginUser, googleLogin } from "../services/api";

const Auth = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);

    const payload = isSignUp
      ? formData
      : { email: formData.email, password: formData.password };

    try {
      const response = isSignUp
        ? await registerUser(payload)
        : await loginUser(payload);
      setMessage({
        text: response.data.message || "Success!",
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
        error.response?.data?.message ||
        error.response?.data?.error ||
        JSON.stringify(error.response?.data) ||
        "An error occurred.";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

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
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white backdrop-blur-md border border-white/60 shadow-xl">
        {/* Toggle Header */}
        <div className="flex justify-center mb-6 border-b pb-3">
          <button
            className={`text-lg font-semibold px-4 py-1 cursor-pointer ${
              !isSignUp ? "border-b-2 border-black text-black" : "text-gray-500"
            }`}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
          <button
            className={`text-lg font-semibold px-4 py-1 cursor-pointer ${
              isSignUp ? "border-b-2 border-black text-black" : "text-gray-500"
            }`}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
        </div>

        {/* Feedback Message */}
        {message.text && (
          <div
            className={`p-3 mb-4 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Google Sign-In Section */}
        <div className="mb-6 flex flex-col items-center justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_blue"
            shape="pill"
            size="large"
            text={isSignUp ? "signup_with" : "signin_with"}
          />
          <div className="w-full flex items-center my-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-3 text-xs text-gray-400 font-medium uppercase">Or with email</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required={isSignUp}
                className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-black text-white font-medium hover:bg-gray-900 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;

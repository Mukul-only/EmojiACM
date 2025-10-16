import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await login({ identifier, password });
      } else {
        await signup({ username: identifier, password });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username/Email Field */}
      <div className="space-y-2">
        <label className="block text-text-primary text-sm font-medium">
          Username or email address
        </label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Enter your username or email"
          required
          className="w-full px-4 py-3 bg-transparent border border-stroke rounded-lg text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="block text-text-primary text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className="w-full px-4 py-3 bg-transparent border border-stroke rounded-lg text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        />
      </div>

      {/* Forgot Password Link */}
      <div className="text-right">
        <button
          type="button"
          className="text-primary hover:text-primary/80 transition-colors text-sm"
        >
          Forgot Password?
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-400 text-sm text-center">{error}</div>}

      {/* Sign In Button */}
      <button
        type="submit"
        className="w-full py-3 bg-primary text-brand-dark font-medium rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.02]"
      >
        {isLogin ? "Sign in" : "Sign up"}
      </button>

      {/* Sign Up Link */}
      <div className="text-center">
        <span className="text-text-primary text-sm">
          {isLogin ? "haven't registered yet?" : "Already have an account?"}{" "}
        </span>
        {isLogin ? (
          <a
            href="https://infotrek25.tech/events"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
          >
            sign up
          </a>
        ) : (
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
          >
            sign in
          </button>
        )}
      </div>
    </form>
  );
};

export default AuthForm;

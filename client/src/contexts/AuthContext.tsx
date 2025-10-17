import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, AuthContextType } from "../types";
import * as authApi from "../api/auth.api";

export const AuthContext = createContext<
  (AuthContextType & { token: string | null }) | null
>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("authToken")
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedToken = localStorage.getItem("authToken");

      // If there's a token in localStorage, set it in state and axios headers
      if (storedToken) {
        setToken(storedToken);
        authApi.apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;

        try {
          const data = await authApi.getMe();
          setUser(data.user);
        } catch (error) {
          console.error("Session validation error:", error);
          // Token is invalid, clear everything
          setUser(null);
          setToken(null);
          localStorage.removeItem("authToken");
          delete authApi.apiClient.defaults.headers.common["Authorization"];
        }
      }
      setIsLoading(false);
    };
    checkLoggedIn();
  }, []); // Run only on initial mount

  const login = async (credentials: any) => {
    try {
      const data = await authApi.login(credentials);
      setUser(data.user);
      // Store the token in both state and localStorage
      setToken(data.token);
      localStorage.setItem("authToken", data.token);
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (credentials: any) => {
    try {
      const data = await authApi.signup(credentials);
      setUser(data.user);
      // Store the token in both state and localStorage
      setToken(data.token);
      localStorage.setItem("authToken", data.token);
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      // Clear everything regardless of server response
      setUser(null);
      setToken(null);
      localStorage.removeItem("authToken");
      delete authApi.apiClient.defaults.headers.common["Authorization"];
    }
  };

  return (
    // --- CHANGE 6: Expose the token in the provider's value ---
    <AuthContext.Provider
      value={{ user, token, isLoading, login, signup, logout }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

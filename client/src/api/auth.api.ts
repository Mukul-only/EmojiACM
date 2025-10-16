import axios from "axios";
import type { User } from "../types"; // Assuming you have a User type defined

// Define a type for login/signup credentials for clarity
interface AuthCredentials {
  username: string;
  password?: string; // Password is required for login/signup but not for other operations
}

// Create an Axios instance. This is a good practice for setting base URLs
// and default headers for all requests to your API.
export const apiClient = axios.create({
  baseURL: "/api/auth", // The Vite proxy will handle redirecting this to the backend
  withCredentials: true, // This is crucial for sending/receiving httpOnly cookies
});

/**
 * Sends a signup request to the server.
 * @param credentials - The user's username and password.
 * @returns A promise that resolves to the server's response data (containing the user object).
 */
export const signup = async (
  credentials: AuthCredentials
): Promise<{ user: User; token: string }> => {
  const { data } = await apiClient.post("/signup", credentials);
  // Set the token in the default headers for future requests
  if (data.token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
  }
  return data;
};

/**
 * Sends a login request to the server.
 * @param credentials - The user's username and password.
 * @returns A promise that resolves to the server's response data (containing the user object).
 */
export const login = async (
  credentials: AuthCredentials
): Promise<{ user: User; token: string }> => {
  const { data } = await apiClient.post("/login", credentials);
  // Set the token in the default headers for future requests
  if (data.token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
  }
  return data;
};

/**
 * Sends a request to the server to fetch the currently authenticated user's data.
 * This is used to verify if a user's session is still valid.
 * @returns A promise that resolves to the server's response data (containing the user object).
 */
export const getMe = async (): Promise<{
  user: User;
  teamMembers?: User[];
}> => {
  try {
    const { data } = await apiClient.get("/me");
    return data;
  } catch (error: any) {
    console.error(
      "Failed to get user profile:",
      error.response?.data?.message || error.message
    );
    // Rethrow with more context
    throw error.response?.data?.message
      ? new Error(error.response.data.message)
      : error;
  }
};

/**
 * Sends a logout request to the server, which will clear the httpOnly cookie.
 * @returns A promise that resolves when the request is complete.
 */
export const logout = async (): Promise<void> => {
  await apiClient.post("/logout");
};

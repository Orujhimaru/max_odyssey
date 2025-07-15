// src/services/supabase.js
import { createClient } from "@supabase/supabase-js";

// Supabase credentials
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://qadgpvzilznmneaxlopa.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZGdwdnppbHpubW5lYXhsb3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxODU2NzEsImV4cCI6MjA2Mzc2MTY3MX0.0oRulmj0t1xHRDCy7lbX3PPu1E_mGnnmYzzIbL-9g2k";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

// Helper functions for authentication
export const authHelpers = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("sb-qadgpvzilznmneaxlopa-auth-token");
  },

  // Get stored user data
  getStoredUser: () => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  },

  // Store user data
  storeUserData: (user) => {
    localStorage.setItem("userData", JSON.stringify(user));
  },

  // Clear stored auth data
  clearAuthData: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    // Clear Supabase session data
    localStorage.removeItem("sb-qadgpvzilznmneaxlopa-auth-token");
  },

  // Format user display name
  getUserDisplayName: (user) => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  },

  // Check if email is confirmed
  isEmailConfirmed: (user) => {
    return !!user?.email_confirmed_at;
  },
};

// Error handling helper
export const handleAuthError = (error) => {
  console.error("Auth error:", error);

  // Map common Supabase auth errors to user-friendly messages
  const errorMessages = {
    "Invalid login credentials": "Invalid email or password. Please try again.",
    "Email not confirmed":
      "Please check your email and click the confirmation link.",
    "User already registered": "An account with this email already exists.",
    "Password should be at least 6 characters":
      "Password must be at least 6 characters long.",
    "Unable to validate email address: invalid format":
      "Please enter a valid email address.",
    "Signup requires a valid password": "Please enter a valid password.",
    "Email rate limit exceeded":
      "Too many emails sent. Please wait before trying again.",
    "Invalid API key":
      "Authentication service unavailable. Please try again later.",
  };

  return (
    errorMessages[error?.message] ||
    error?.message ||
    "An unexpected error occurred."
  );
};

export default supabase;

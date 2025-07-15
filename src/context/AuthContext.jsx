import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase, authHelpers, handleAuthError } from "../services/supabase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Initialize auth state
  useEffect(() => {
    console.log("AuthProvider: Initializing...");

    const initializeAuth = async () => {
      try {
        // Get initial session from Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("AuthProvider: Error getting session:", error);
        } else {
          console.log("AuthProvider: Initial session:", session);

          if (session) {
            setSession(session);
            setUser(session.user);

            // Store auth data in localStorage for compatibility
            localStorage.setItem("token", session.access_token);
            authHelpers.storeUserData(session.user);
          } else {
            // Check for legacy token in localStorage
            const legacyToken = localStorage.getItem("token");
            if (legacyToken) {
              console.log("AuthProvider: Found legacy token, migrating...");
              // For now, keep legacy behavior for backward compatibility
              // TODO: Remove this when fully migrated to Supabase
              const {
                data: { user },
                error,
              } = await supabase.auth.getUser();
              if (user && !error) {
                setUser(user);
                authHelpers.storeUserData(user);
              }
            }
          }
        }
      } catch (error) {
        console.error("AuthProvider: Error during initialization:", error);
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthProvider: Auth state changed:", event, session);

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session) {
        // Store auth data
        localStorage.setItem("token", session.access_token);
        authHelpers.storeUserData(session.user);
      } else {
        // Clear auth data
        authHelpers.clearAuthData();
      }
    });

    return () => {
      console.log("AuthProvider: Cleaning up auth listener");
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, fullName) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      console.log("AuthProvider: Sign up successful:", data);
      return { success: true, data };
    } catch (error) {
      console.error("AuthProvider: Sign up error:", error);
      const friendlyMessage = handleAuthError(error);
      return { success: false, error: friendlyMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log("AuthProvider: Sign in successful:", data);
      return { success: true, data };
    } catch (error) {
      console.error("AuthProvider: Sign in error:", error);
      const friendlyMessage = handleAuthError(error);
      return { success: false, error: friendlyMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with OAuth (Google, GitHub, etc.)
  const signInWithOAuth = async (provider) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        throw error;
      }

      console.log("AuthProvider: OAuth sign in initiated:", data);
      return { success: true, data };
    } catch (error) {
      console.error("AuthProvider: OAuth sign in error:", error);
      const friendlyMessage = handleAuthError(error);
      return { success: false, error: friendlyMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      console.log("AuthProvider: Sign out successful");

      // Clear all auth data
      authHelpers.clearAuthData();
      setUser(null);
      setSession(null);

      return { success: true };
    } catch (error) {
      console.error("AuthProvider: Sign out error:", error);
      const friendlyMessage = handleAuthError(error);
      return { success: false, error: friendlyMessage };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      console.log("AuthProvider: Password reset email sent");
      return { success: true };
    } catch (error) {
      console.error("AuthProvider: Password reset error:", error);
      const friendlyMessage = handleAuthError(error);
      return { success: false, error: friendlyMessage };
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) {
        throw error;
      }

      console.log("AuthProvider: Profile updated:", data);

      // Update local user state
      setUser(data.user);
      authHelpers.storeUserData(data.user);

      return { success: true, data };
    } catch (error) {
      console.error("AuthProvider: Profile update error:", error);
      const friendlyMessage = handleAuthError(error);
      return { success: false, error: friendlyMessage };
    } finally {
      setLoading(false);
    }
  };

  // Legacy login method for backward compatibility
  const login = async (username) => {
    console.warn(
      "AuthProvider: Using legacy login method. Consider migrating to signIn."
    );

    try {
      // For backward compatibility, simulate the old API behavior
      // In a real migration, you'd probably want to map usernames to emails
      // or implement a custom endpoint that handles username-based login

      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const newToken = data.token;

      // Save token to localStorage
      localStorage.setItem("token", newToken);

      // Fetch user data
      const userResponse = await fetch("http://localhost:8080/user/profile", {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        authHelpers.storeUserData(userData);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Legacy login error:", error);
      return false;
    }
  };

  // Legacy logout method for backward compatibility
  const logout = () => {
    console.warn(
      "AuthProvider: Using legacy logout method. Consider migrating to signOut."
    );
    authHelpers.clearAuthData();
    setUser(null);
    setSession(null);
  };

  // Helper methods
  const isAuthenticated = () => {
    return !!user || !!session;
  };

  const getUserDisplayName = () => {
    return authHelpers.getUserDisplayName(user);
  };

  const isEmailConfirmed = () => {
    return authHelpers.isEmailConfirmed(user);
  };

  const authContextValue = {
    // User and session state
    user,
    session,
    loading,
    initializing,

    // Authentication methods
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updateProfile,

    // Legacy methods for backward compatibility
    login,
    logout,

    // Helper methods
    isAuthenticated: isAuthenticated(),
    getUserDisplayName,
    isEmailConfirmed,

    // Legacy properties for backward compatibility
    token: session?.access_token || localStorage.getItem("token"),
  };

  // Don't render children until auth is initialized
  if (initializing) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #667eea",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p style={{ color: "#666", margin: 0 }}>Initializing...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

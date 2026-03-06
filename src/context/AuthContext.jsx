import React, { createContext, useContext, useState, useEffect } from "react";
import { getSession, onAuthStateChange, signOut, isAdmin } from "../services/auth";

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("[AuthContext] Initializing auth...");
        
        // Check for existing session
        const session = await getSession();
        
        if (session?.user) {
          console.log("[AuthContext] Session found for:", session.user.email);
          setUser(session.user);
          
          // Check if admin
          const admin = await isAdmin(session.user.email);
          setIsAdminUser(admin);
        } else {
          console.log("[AuthContext] No session found");
          setUser(null);
          setIsAdminUser(false);
        }
      } catch (err) {
        console.error("[AuthContext] Init error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      console.log("[AuthContext] Auth state changed:", event);
      
      if (session?.user) {
        setUser(session.user);
        const admin = await isAdmin(session.user.email);
        setIsAdminUser(admin);
      } else {
        setUser(null);
        setIsAdminUser(false);
      }
    });

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsAdminUser(false);
  };

  const value = {
    user,
    isAdminUser,
    loading,
    error,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

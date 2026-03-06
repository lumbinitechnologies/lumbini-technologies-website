import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../services/supabase";

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const { session, user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!session) {
        navigate("/Login", { replace: true });
        return;
      }

      try {
        const { data, error } = await supabase
          .from("admins")
          .select("id")
          .eq("email", user?.email)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          navigate("/dashboard", { replace: true });
          return;
        }

        setIsAdmin(true);
      } catch (err) {
        console.error("Admin check failed:", err);
        navigate("/dashboard", { replace: true });
      } finally {
        setAdminLoading(false);
      }
    };

    if (!loading) {
      checkAdmin();
    }
  }, [session, user, loading, navigate]);

  if (loading || adminLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "white" }}>
        Initializing dashboard...
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return children;
};

export default AdminRoute;

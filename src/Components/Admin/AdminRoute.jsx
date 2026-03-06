import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

// ✅ No fetchIsAdmin import — querying admins table directly

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user ?? null;

        console.log("[AdminRoute] Logged in as:", user?.email);

        if (!user) {
          console.log("[AdminRoute] No user, redirecting to login");
          navigate("/Login?redirect=/admin-dashboard", { replace: true });
          return;
        }

        // ✅ Direct query — no external service needed
        const { data, error } = await supabase
          .from("admins")
          .select("id")
          .eq("email", user.email)
          .maybeSingle();

        console.log("[AdminRoute] Admin check:", { data, error });

        if (!data) {
          console.log("[AdminRoute] Not an admin, redirecting home");
          navigate("/", { replace: true });
          return;
        }

        console.log("[AdminRoute] Admin confirmed ✓");
        setIsAdmin(true);
      } catch (err) {
        console.error("[AdminRoute] Unexpected error:", err);
        navigate("/", { replace: true });
      } finally {
        setChecking(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (checking) {
    return (
      <div
        style={{
          color: "#facc15",
          textAlign: "center",
          padding: "4rem",
          background: "#000",
          minHeight: "100vh",
          fontFamily: "monospace",
        }}
      >
        Verifying admin access...
      </div>
    );
  }

  if (!isAdmin) return null;

  return children;
};

export default AdminRoute;

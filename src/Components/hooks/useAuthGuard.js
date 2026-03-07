import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const useAuthGuard = (redirectTo = "/Login") => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const redirectTarget = useMemo(() => {
    const current = `${location.pathname}${location.search || ""}`;
    return `${redirectTo}?redirect=${encodeURIComponent(current)}`;
  }, [location.pathname, location.search, redirectTo]);

  useEffect(() => {
    if (loading) return;
    if (user) return;
    navigate(redirectTarget, { replace: true });
  }, [loading, user, navigate, redirectTarget]);

  return { user, loading };
};

export default useAuthGuard;

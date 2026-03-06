import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

const useAuthGuard = (redirectTo = "/Login") => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const timeoutId = window.setTimeout(() => {
      if (!active) return;
      // Safety: never let the UI spin forever if getSession hangs/rejects
      setUser((u) => u ?? null);
      setLoading(false);
    }, 4000);

    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!active) return;
        setUser(session?.user ?? null);
        setLoading(false);
      } catch {
        if (!active) return;
        setUser(null);
        setLoading(false);
      } finally {
        window.clearTimeout(timeoutId);
      }
    })();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      data.subscription.unsubscribe();
    };
  }, []);

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

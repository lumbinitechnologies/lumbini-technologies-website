import React, { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "./services/supabase";

// Components (eager — always needed)
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import AdminRoute from "./Components/Admin/AdminRoute"; // guard, not a page
import MouseFollower from "./Components/Effects/MouseFollower";
import MouseParallax from "./Components/Effects/MouseParallax";
import CustomCursor from "./Components/Effects/CustomCursor";

// Lazy Pages
const Home = lazy(() => import("./Components/Home/Home"));
const About = lazy(() => import("./Components/About/About"));
const ServicePage = lazy(() => import("./Components/ServicePage/ServicePage"));
const Gallery = lazy(() => import("./Components/Gallery/Gallery"));
const Career = lazy(() => import("./Components/Career/Career"));
const Contact = lazy(() => import("./Components/Contact/Contact"));
const Login = lazy(() => import("./Components/Login/Login"));
const Signup = lazy(() => import("./Components/SignUp/SignUp"));
const Products = lazy(() => import("./Components/Products/Products"));
const InternshipApplication = lazy(
  () => import("./Components/InternshipApplication/InternshipApplication"),
);
const SkillArc = lazy(() => import("./Components/SkillArc/SkillArc"));
const MyApplications = lazy(() => import("./Components/Users/MyApplications"));
const UserDashboard = lazy(() => import("./Components/Users/UserDashboard"));
const AdminDashboard = lazy(() => import("./Components/Admin/AdminDashboard"));

// ── Auth-exempt routes (no redirect on unauthenticated) ───────────────────────
const PUBLIC_PATHS = [
  "/",
  "/about",
  "/gallery",
  "/servicepage",
  "/career",
  "/contact",
  "/products",
  "/login",
  "/signup",
  "/skillarc",
];

const isPublicPath = (path) => PUBLIC_PATHS.includes(path.toLowerCase());

// ── Scroll to top on route change ─────────────────────────────────────────────
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// ── Page transition wrapper ───────────────────────────────────────────────────
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -40 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// ── Animated routes ───────────────────────────────────────────────────────────
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ── Public ── */}
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/About"
          element={
            <PageWrapper>
              <About />
            </PageWrapper>
          }
        />
        <Route
          path="/Gallery"
          element={
            <PageWrapper>
              <Gallery />
            </PageWrapper>
          }
        />
        <Route
          path="/ServicePage"
          element={
            <PageWrapper>
              <ServicePage />
            </PageWrapper>
          }
        />
        <Route
          path="/Career"
          element={
            <PageWrapper>
              <Career />
            </PageWrapper>
          }
        />
        <Route
          path="/Contact"
          element={
            <PageWrapper>
              <Contact />
            </PageWrapper>
          }
        />
        <Route
          path="/Products"
          element={
            <PageWrapper>
              <Products />
            </PageWrapper>
          }
        />

        {/* ── Auth ── */}
        <Route
          path="/Login"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />
        <Route
          path="/signup"
          element={
            <PageWrapper>
              <Signup />
            </PageWrapper>
          }
        />

        {/* ── Internship ── */}
        <Route
          path="/internship-application"
          element={
            <PageWrapper>
              <InternshipApplication />
            </PageWrapper>
          }
        />

        {/* ── User ── */}
        <Route
          path="/dashboard"
          element={
            <PageWrapper>
              <UserDashboard />
            </PageWrapper>
          }
        />
        <Route
          path="/my-applications"
          element={
            <PageWrapper>
              <MyApplications />
            </PageWrapper>
          }
        />

        {/* ── Admin ── */}
        <Route
          path="/admin-dashboard"
          element={
            <PageWrapper>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </PageWrapper>
          }
        />

        {/* ── SkillArc (do not touch) ── */}
        <Route path="/skillarc" element={<SkillArc />} />

        {/* ── 404 ── */}
        <Route
          path="*"
          element={
            <PageWrapper>
              <div
                style={{ color: "white", textAlign: "center", padding: "3rem" }}
              >
                Page Not Found
              </div>
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

// ── Root App ──────────────────────────────────────────────────────────────────
const App = () => {
  // 1. On mount: check if an active session exists
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
      }
      if (!data.session) {
        console.log("No active session");
      }
    };
    checkSession();
  }, []);

  // 2. Ongoing: redirect to /Login when session expires or user signs out,
  //    but only if the current page is not a public route
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session && !isPublicPath(window.location.pathname)) {
          window.location.href = "/Login";
        }
      },
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <MouseFollower />
      <MouseParallax />
      <CustomCursor />
      <Navbar />
      <Suspense
        fallback={
          <div style={{ color: "white", textAlign: "center", padding: "2rem" }}>
            Loading...
          </div>
        }
      >
        <AnimatedRoutes />
      </Suspense>
      <Footer />
    </Router>
  );
};

export default App;

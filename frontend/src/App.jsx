import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Guests from "./pages/Guests";
import Payments from "./pages/Payments";
import Rooms from "./pages/Rooms";
import Family from "./pages/Family";
import Layout from "./layouts/Layout";
import PublicLayout from "./layouts/PublicLayout";
import { isLoggedIn } from "./utils/auth";
import VacatedGuests from "./pages/VacatedGuests";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Privacy from "./pages/public/Privacy";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Terms from "./pages/public/Terms";
import Features from "./pages/public/Features";
import Pricing from "./pages/public/Pricing";
import Help from "./pages/public/Help";
import HelpDetail from "./pages/public/HelpDetail";
import Blog from "./pages/public/Blog";
import BlogArticle from "./pages/public/BlogArticle";

/** Protects app routes: redirect to landing if not authenticated */
const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

/** For login/register: redirect to dashboard if already logged in */
const PublicOnlyRoute = ({ children }) => {
  if (isLoggedIn()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LANDING (public; redirect to dashboard if already logged in) */}
        <Route path="/" element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Landing />} />

        {/* AUTH (redirect to dashboard if already logged in) */}
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

        {/* PUBLIC PAGES (with shared navbar + footer) */}
        <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
        <Route path="/features" element={<PublicLayout><Features /></PublicLayout>} />
        <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
        <Route path="/help" element={<PublicLayout><Help /></PublicLayout>} />
        <Route path="/help/:slug" element={<PublicLayout><HelpDetail /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout><BlogArticle /></PublicLayout>} />

        {/* PROTECTED APP */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/guests"
          element={
            <ProtectedRoute>
              <Layout>
                <Guests />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Layout>
                <Payments />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <Layout>
                <Rooms />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/guests/:guestId/family"
          element={
            <ProtectedRoute>
              <Layout>
                <Family />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vacated-guests"
          element={
            <ProtectedRoute>
              <Layout>
                <VacatedGuests />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all: unauthenticated -> landing, authenticated -> dashboard */}
        <Route path="*" element={<Navigate to={isLoggedIn() ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

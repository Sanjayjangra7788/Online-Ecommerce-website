// src/routes/AppRoutes.jsx
// ──────────────────────────────────────────────────────────────────
// BrowserRouter HATA DIYA — ab main.jsx mein hai
// Auth0ProviderWithNavigate ke andar hona zaroori hai
// ──────────────────────────────────────────────────────────────────

import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import { Suspense, lazy } from "react";

const Home           = lazy(() => import("../pages/home/Home"));
const Products       = lazy(() => import("../pages/products/Products"));
const ProductDetails = lazy(() => import("../pages/products/ProductDetails"));
const Cart           = lazy(() => import("../pages/cart/Cart"));
const Wishlist       = lazy(() => import("../pages/wishlist/Wishlist"));
const Login          = lazy(() => import("../pages/auth/Login"));
const Profile        = lazy(() => import("../pages/profile/Profile"));
const Orders         = lazy(() => import("../pages/orders/Orders"));
const Shipping       = lazy(() => import("../pages/checkout/Shipping"));
const Payment        = lazy(() => import("../pages/checkout/Payment"));
const OrderSuccess   = lazy(() => import("../pages/checkout/OrderSuccess"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-[3px] border-t-transparent animate-spin"
          style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }}
        />
        <p className="text-[13px]" style={{ color: "var(--muted)" }}>Loading…</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    // ⚠️ BrowserRouter NAHI hai yahan — main.jsx mein hai
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index              element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
        <Route path="products"    element={<Suspense fallback={<PageLoader />}><Products /></Suspense>} />
        <Route path="products/:id" element={<Suspense fallback={<PageLoader />}><ProductDetails /></Suspense>} />
        <Route path="login"       element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
        <Route path="wishlist"    element={<Suspense fallback={<PageLoader />}><Wishlist /></Suspense>} />

        {/* Protected Routes — sirf logged in users ke liye */}
        <Route path="profile"  element={<Suspense fallback={<PageLoader />}><ProtectedRoute><Profile /></ProtectedRoute></Suspense>} />
        <Route path="orders"   element={<Suspense fallback={<PageLoader />}><ProtectedRoute><Orders /></ProtectedRoute></Suspense>} />
        <Route path="cart"     element={<Suspense fallback={<PageLoader />}><ProtectedRoute><Cart /></ProtectedRoute></Suspense>} />
        <Route path="shipping"      element={<Suspense fallback={<PageLoader />}><ProtectedRoute><Shipping /></ProtectedRoute></Suspense>} />
        <Route path="payment"       element={<Suspense fallback={<PageLoader />}><ProtectedRoute><Payment /></ProtectedRoute></Suspense>} />
        <Route path="order-success" element={<Suspense fallback={<PageLoader />}><ProtectedRoute><OrderSuccess /></ProtectedRoute></Suspense>} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;

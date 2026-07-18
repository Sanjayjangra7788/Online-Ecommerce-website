import { useState, useEffect, useRef, memo, useCallback } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart, FaHeart, FaSearch, FaTimes, FaBars,
  FaInstagram, FaTwitter, FaFacebookF, FaYoutube, FaUser,
  FaSignOutAlt, FaClipboardList, FaChevronDown, FaArrowUp,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import useAuth0Sync from "../auth/useAuth0Sync";

const AnnouncementBar = memo(() => (
  <div className="block text-white text-center py-2 sm:py-2.5 text-[10px] sm:text-[12px] font-medium tracking-widest uppercase"
    style={{ background: "var(--ink)" }}>
    <div className="overflow-hidden">
      <div className="marquee-inner flex gap-10 sm:gap-24 whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="flex gap-10 sm:gap-24 shrink-0">
            <span>✦ Free shipping over $100</span>
            <span>✦ New arrivals every week</span>
            <span>✦ Premium quality guaranteed</span>
            <span>✦ Easy 30-day returns</span>
          </span>
        ))}
      </div>
    </div>
  </div>
));

const Footer = memo(() => (
  <footer style={{ background: "var(--ink)", color: "white" }} className="mt-20">
    <div className="max-w-[1440px] mx-auto px-5 lg:px-10 py-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 pb-14" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div>
          <h2 className="font-display text-[34px] font-bold mb-4">
            San<span style={{ color: "var(--gold)" }}>Vora</span>
          </h2>
          <p className="text-[14px] leading-7 opacity-50">Premium shopping experience for the modern lifestyle.</p>
          <div className="flex items-center gap-4 mt-6">
            {[FaInstagram, FaTwitter, FaFacebookF, FaYoutube].map((Icon, i) => (
              <button key={i} className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-100 transition"
                style={{ background: "rgba(255,255,255,0.08)", opacity: 0.5 }}>
                <Icon className="text-[14px]" />
              </button>
            ))}
          </div>
        </div>
        {[
          { title: "Shop",    links: ["New Arrivals", "Trending", "Best Sellers", "Sale Items"] },
          { title: "Company", links: ["About Us", "Careers", "Blog", "Press"] },
          { title: "Support", links: ["Help Center", "Track Order", "Returns", "Contact"] },
        ].map(({ title, links }) => (
          <div key={title}>
            <h3 className="font-semibold text-[15px] mb-5 tracking-wide">{title}</h3>
            <div className="space-y-3">
              {links.map((link) => <p key={link} className="text-[14px] opacity-40 hover:opacity-80 cursor-pointer transition">{link}</p>)}
            </div>
          </div>
        ))}
      </div>
      <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] opacity-40">
        <p>© 2026 SanVora. All rights reserved.</p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((t) => (
            <span key={t} className="hover:opacity-80 cursor-pointer transition">{t}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
));

const CATEGORIES = ["New Arrivals", "Men", "Women", "Electronics", "Beauty", "Shoes", "Accessories", "Sale"];

function MainLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const { handleLogout } = useAuth0Sync();
  const authUser        = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);

  const cartCount     = useSelector((s) => s.cart?.cartItems?.reduce((a, i) => a + (i.quantity || 1), 0) ?? 0);
  const wishlistCount = useSelector((s) => s.wishlist?.wishlistItems?.length ?? 0);

  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [userOpen,    setUserOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          setShowScrollTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserOpen(false);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => { if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setSearchOpen(false); };
    if (searchOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [searchOpen]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }, [searchQuery, navigate]);

  const navStyle = {
    background: scrolled  ? "rgba(10,10,10,0.22)" : "none",
    backdropFilter: scrolled ? "blur(14px)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    boxShadow: scrolled ? "0 8px 30px rgba(0,0,0,0.25)" : "none",
    width: scrolled ? "96%" : "100%",
    borderRadius: scrolled ? "18px" : "0px",
    left: "50%",
    transform: "translateX(-50%)",
    top: scrolled ? "10px" : "38px",
    zIndex: 999,
    transition: "all .35s ease",
  };

  return (
    <div className="luxury-home-bg min-h-screen">
      <div className="fixed top-[-200px] right-[-100px] w-[500px] h-[500px] bg-yellow-200/10 blur-[120px] rounded-full pointer-events-none z-0" aria-hidden />
      <div className="fixed bottom-[-200px] left-[-100px] w-[400px] h-[400px] bg-pink-200/10 blur-[120px] rounded-full pointer-events-none z-0" aria-hidden />

      <AnnouncementBar />

      <header className="fixed z-[999] transition-all duration-300" style={navStyle}>
        <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-10">
          <div className="h-[60px] sm:h-[68px] flex items-center justify-between gap-1.5 sm:gap-6">

            <button onClick={() => setMobileOpen(true)} aria-label="Menu"
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-black/5 transition">
              <FaBars style={{ color: "var(--white)" ,cursor:"pointer"}} />
            </button>

            <Link to="/" className="flex-shrink-0 min-w-0">
              <h1 className="font-display font-bold tracking-tight leading-none truncate" style={{ fontSize: "clamp(20px,5.5vw,34px)" }}>
                <span style={{ color: "var(--white)" }}>San</span>
                <span style={{ color: "var(--gold)" }}>Vora</span>
              </h1>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {[["Home", "/"], ["Products", "/products"], ["Wishlist", "/wishlist"], ["Orders", "/orders"]].map(([label, path]) => (
                <Link key={path} to={path}
                  className="text-[14px] font-medium transition hover:opacity-60"
                  style={{ color: location.pathname === path ? "var(--gold)" : "var(--white)" }}>
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              <button onClick={() => setSearchOpen(true)} aria-label="Search"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition flex-shrink-0">
                <FaSearch className="text-[13px] sm:text-[15px]" style={{ color: "var(--white)" }} />
              </button>

              <Link to="/wishlist" aria-label="Wishlist" className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition flex-shrink-0">
                <FaHeart className="text-[15px] sm:text-[17px]" style={{ color: "var(--white)" }} />
                {wishlistCount > 0 && (
                  <span className="badge-pulse absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[9px] flex items-center justify-center font-bold"
                    style={{ background: "var(--red)" }}>{wishlistCount}</span>
                )}
              </Link>

              <Link to="/cart" aria-label="Cart"
                className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 h-9 sm:h-10 rounded-full font-medium text-[13px] transition hover:opacity-90 flex-shrink-0"
                style={{ background: "var(--ink)", color: "white" }}>
                <FaShoppingCart className="text-[13px] sm:text-[14px]" />
                <span className="hidden sm:block">Cart</span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
                    style={{ background: "var(--gold)", color: "var(--ink)" }}>{cartCount}</span>
                )}
              </Link>

              <div ref={userRef} className="relative hidden lg:block">
                <button onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 h-10 px-3 rounded-full hover:bg-black/5 transition">
                  {authUser?.picture ? (
                    <img src={authUser.picture} alt={authUser.name} style={{ width: "2rem", borderRadius: "9999px" }} />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-bold"
                      style={{ background: "var(--gold)", color: "var(--ink)" }}>
                      {authUser?.name ? authUser.name[0].toUpperCase() : <FaUser className="text-[11px]" />}
                    </div>
                  )}
                  <FaChevronDown className="text-[10px]" style={{ color: "var(--white)" }} />
                </button>

                {userOpen && (
                  <div className="absolute right-0 top-14 w-[220px] rounded-2xl overflow-hidden shadow-2xl z-50"
                    style={{ background: "white", border: "1px solid var(--border)" }}>
                    <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)", background: "var(--cream)" }}>
                      <p className="font-semibold text-[14px]" style={{ color: "var(--ink)" }}>
                        {authUser?.name || "Guest User"}
                      </p>
                      <p className="text-[12px] mt-0.5" style={{ color: "var(--muted)" }}>
                        {authUser?.email || "Browse as guest"}
                      </p>
                    </div>
                    {isAuthenticated ? (
                      <>
                        <Link to="/profile" className="flex items-center gap-3 px-5 py-3 text-[13px] hover:bg-black/5 transition" style={{ color: "var(--ink)" }}>
                          <FaUser className="text-[12px] opacity-50" /> My Profile
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3 px-5 py-3 text-[13px] hover:bg-black/5 transition" style={{ color: "var(--ink)" }}>
                          <FaClipboardList className="text-[12px] opacity-50" /> My Orders
                        </Link>
                        <Link to="/wishlist" className="flex items-center gap-3 px-5 py-3 text-[13px] hover:bg-black/5 transition" style={{ color: "var(--ink)" }}>
                          <FaHeart className="text-[12px] opacity-50" /> Wishlist
                        </Link>
                        <div style={{ borderTop: "1px solid var(--border)" }}>
                          <button onClick={handleLogout}
                            className="flex items-center gap-3 px-5 py-3 text-[13px] w-full text-left hover:bg-red-50 transition"
                            style={{ color: "var(--red)" }}>
                            <FaSignOutAlt className="text-[12px]" /> Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <Link to="/login"
                        className="block w-full text-left px-5 py-3.5 text-[13px] font-medium hover:bg-black/5 transition"
                        style={{ color: "var(--ink)" }}>
                        Sign In
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid darkgray" }} className="hidden lg:block">
          <div className="max-w-[1440px] mx-auto px-10">
            <div className="h-[44px] flex items-center gap-10 overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <Link key={cat} to="/products"
                  className="text-[13px] whitespace-nowrap transition font-medium opacity-60 hover:opacity-100"
                  style={{ color: cat === "Sale" ? "var(--red)" : "var(--white)", opacity: cat === "Sale" ? 1 : undefined, fontWeight: cat === "Sale" ? 600 : undefined }}>
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[120px] px-5"
          style={{ background: "rgba(15,14,13,0.6)", backdropFilter: "blur(8px)" }}
          onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-[680px]" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="flex items-center gap-4 rounded-2xl overflow-hidden shadow-2xl px-6 h-[68px]"
              style={{ background: "white" }}>
              <FaSearch style={{ color: "var(--gold)" }} className="text-xl flex-shrink-0" />
              <input autoFocus type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands…"
                className="flex-1 min-w-0 h-full text-[16px] bg-transparent outline-none" style={{ color: "var(--ink)" }} />
              <button type="button" onClick={() => setSearchOpen(false)} className="flex-shrink-0 hover:opacity-60 transition">
                <FaTimes style={{ color: "var(--muted)" }} />
              </button>
            </form>
            <p className="text-center mt-4 text-[13px] opacity-60 text-white">Press Enter to search · ESC to close</p>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-[1000] flex lg:hidden">
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setMobileOpen(false)} />
          <div className="relative w-[82vw] max-w-[280px] flex flex-col shadow-2xl" style={{ background: "white" }}>
            <div className="flex items-center justify-between px-5 h-[68px]" style={{ borderBottom: "1px solid var(--border)" }}>
              <Link to="/" className="font-display text-[26px] font-bold">
                <span style={{ color: "var(--ink)" }}>San</span><span style={{ color: "var(--gold)" }}>Vora</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5" style={{ color: "var(--ink)" }}>
                <FaTimes />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-1">
              {[["Home", "/"], ["Products", "/products"], ["Wishlist", "/wishlist"], ["Orders", "/orders"], ["Cart", "/cart"], ["Profile", "/profile"]].map(([label, path]) => (
                <Link key={path} to={path} className="flex items-center h-12 px-4 rounded-xl text-[15px] font-medium hover:bg-black/5 transition" style={{ color: "var(--ink)" }}>
                  {label}
                </Link>
              ))}
            </nav>
            <div className="px-5 py-5" style={{ borderTop: "1px solid var(--border)" }}>
              {isAuthenticated ? (
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 h-12 rounded-xl font-medium text-[14px]"
                  style={{ background: "var(--ink)", color: "white" }}>
                  <FaSignOutAlt /> Sign Out
                </button>
              ) : (
                <button onClick={() => navigate("/login")} className="w-full flex items-center justify-center h-12 rounded-xl font-medium text-[14px]"
                  style={{ background: "var(--ink)", color: "white" }}>
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-[1380px] mx-auto w-full px-4 sm:px-5 lg:px-10 pt-[108px] lg:pt-[148px] pb-10 relative z-10">
        <Outlet />
      </main>

      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-[900] w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #d4a843, #c9a84c, #b8922e)",
          color: "var(--ink)",
          boxShadow: "0 6px 20px rgba(201,168,76,0.45)",
          opacity: showScrollTop ? 1 : 0,
          transform: showScrollTop ? "translateY(0) scale(1)" : "translateY(16px) scale(0.85)",
          pointerEvents: showScrollTop ? "auto" : "none",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(0) scale(1.08)"; e.currentTarget.style.boxShadow = "0 8px 26px rgba(201,168,76,0.6)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(201,168,76,0.45)"; }}
      >
        <FaArrowUp className="text-[15px] sm:text-[16px]" />
      </button>

      <Footer />
    </div>
  );
}

export default MainLayout;

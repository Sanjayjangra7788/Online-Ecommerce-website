import { useEffect, memo, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../features/products/productSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { toggleWishlist } from "../../features/wishlist/wishlistSlice";
import { toast } from "react-toastify";
import {
  FaArrowRight, FaStar, FaShieldAlt, FaTruck, FaUndo,
  FaHeadset, FaHeart, FaShoppingCart, FaFire,
} from "react-icons/fa";

const CATEGORIES = [
  { name: "Men",         emoji: "👔", cat: "mens-shirts"     },
  { name: "Women",       emoji: "👗", cat: "womens-dresses"  },
  { name: "Electronics", emoji: "⚡", cat: "smartphones"     },
  { name: "Beauty",      emoji: "💄", cat: "beauty"          },
  { name: "Shoes",       emoji: "👟", cat: "mens-shoes"      },
  { name: "Watches",     emoji: "⌚", cat: "mens-watches"    },
];

const FEATURES = [
  { icon: FaTruck,     title: "Free Shipping",  desc: "On all orders over $100"    },
  { icon: FaShieldAlt, title: "Secure Payment", desc: "100% protected checkout"    },
  { icon: FaUndo,      title: "Easy Returns",   desc: "30-day hassle-free policy"  },
  { icon: FaHeadset,   title: "24/7 Support",   desc: "We're always here for you"  },
];

const TESTIMONIALS = [
  { name: "Priya S.", rating: 5, text: "Absolutely love the quality. SanVora is my go-to for premium finds.", avatar: "P" },
  { name: "James T.", rating: 5, text: "Fast shipping and stunning products. Can't recommend enough.",        avatar: "J" },
  { name: "Aisha K.", rating: 5, text: "Discovered so many hidden gems. The curation is impeccable.",        avatar: "A" },
];

// ── Memoised card ─────────────────────────────────────────────────────────────
const FeaturedCard = memo(function FeaturedCard({ item, onAddToCart, onToggleWishlist, isWishlisted }) {
  const orig = Math.round(item.price / (1 - item.discountPercentage / 100));
  return (
    <div
      className="pc-root relative flex flex-col overflow-hidden rounded-[20px]"
      style={{
        background: "linear-gradient(160deg, #1c1a15 0%, #141210 60%, #0e0c09 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        transition: "transform 0.32s cubic-bezier(0.22,1,0.36,1), box-shadow 0.32s ease, border-color 0.32s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.18)";
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.22)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.35)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      {/* ── IMAGE ZONE ── */}
      <Link
        to={`/products/${item.id}`}
        className="relative block overflow-hidden flex-shrink-0"
        style={{ height: "clamp(140px, 42vw, 230px)", background: "linear-gradient(145deg, #1e1b14, #161310)" }}
      >
        {item.discountPercentage > 5 && (
          <div
            className="absolute left-3 top-3 z-20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide text-white"
            style={{ background: "linear-gradient(135deg, #e05a4a, #c9392a)", boxShadow: "0 2px 8px rgba(217,79,61,0.45)" }}
          >
            -{Math.round(item.discountPercentage)}%
          </div>
        )}
        <button
          onClick={e => { e.preventDefault(); onToggleWishlist(item); }}
          className={`pc-wishlist absolute right-3 top-3 z-20 w-8 h-8 rounded-full flex items-center justify-center${isWishlisted ? " wishlisted" : ""}`}
          style={{
            background: isWishlisted ? "#fff0f0" : "rgba(255,255,255,0.92)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
          }}
        >
          <FaHeart className="text-[12px]" style={{ color: isWishlisted ? "var(--red)" : "#aaa" }} />
        </button>
        <img
          src={item.thumbnail} alt={item.title}
          loading="lazy" decoding="async"
          className="w-full h-full object-contain p-5"
          style={{ transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to top, #141210, transparent)" }} />
      </Link>

      {/* ── CARD BODY ── */}
      <div className="flex flex-col flex-1 px-4 pt-3.5 pb-4" style={{ gap: "10px" }}>
        <p className="text-[9px] uppercase tracking-[3px] font-bold truncate" style={{ color: "var(--gold)", letterSpacing: "0.18em" }}>
          {item.brand || item.category}
        </p>
        <Link to={`/products/${item.id}`}>
          <h2
            className="font-semibold text-[13.5px] leading-snug line-clamp-2"
            style={{ color: "rgba(255,255,255,0.88)", transition: "color 0.2s ease", minHeight: "36px" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.88)"; }}
          >
            {item.title}
          </h2>
        </Link>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-[10px]"
                style={{ color: i < Math.floor(item.rating) ? "#f59e0b" : "rgba(255,255,255,0.12)" }} />
            ))}
          </div>
          <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
            {item.rating?.toFixed(1)}
          </span>
        </div>
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-baseline gap-1.5 min-w-0 flex-shrink">
            <span className="font-bold text-[16px] sm:text-[19px] text-white leading-none whitespace-nowrap">${item.price}</span>
            {item.discountPercentage > 0 && (
              <span className="text-[10px] sm:text-[11px] line-through whitespace-nowrap" style={{ color: "rgba(255,255,255,0.25)" }}>${orig}</span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(item)}
            aria-label="Add to Cart"
            className="flex items-center justify-center gap-1.5 w-8 h-8 sm:w-auto sm:h-auto sm:px-3.5 sm:py-2 rounded-full text-[11.5px] font-semibold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #d4a843, #c9a84c, #b8922e)",
              color: "#0f0e0d",
              boxShadow: "0 3px 12px rgba(201,168,76,0.3)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.06)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(201,168,76,0.45)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 3px 12px rgba(201,168,76,0.3)";
            }}
          >
            <FaShoppingCart className="text-[12px] sm:text-[10px]" /> <span className="hidden sm:inline">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
});

// ── Skeleton ──────────────────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div
    className="rounded-[20px] overflow-hidden flex flex-col"
    style={{
      background: "linear-gradient(160deg, #1c1a15 0%, #141210 60%, #0e0c09 100%)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    <div className="skeleton" style={{ height: "clamp(140px, 42vw, 230px)" }} />
    <div className="px-4 pt-3.5 pb-4 flex flex-col gap-3">
      <div className="skeleton h-2.5 rounded-full w-1/3" />
      <div className="skeleton h-4 rounded-lg w-5/6" />
      <div className="skeleton h-3.5 rounded-lg w-2/3" />
      <div className="skeleton h-3 rounded-full w-1/4" />
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
      <div className="flex items-center justify-between mt-1">
        <div className="skeleton h-6 rounded-lg w-16" />
        <div className="skeleton h-8 rounded-full w-28" />
      </div>
    </div>
  </div>
);

function Home() {
  const dispatch      = useDispatch();
  const navigate      = useNavigate();
  const { products, loading } = useSelector((s) => s.products);
  const wishlistItems = useSelector((s) => s.wishlist?.wishlistItems || []);
  const wishlistIds   = useMemo(() => new Set(wishlistItems.map((w) => w.id)), [wishlistItems]);

  useEffect(() => { dispatch(getProducts()); }, [dispatch]);

  const featured = useMemo(() => products?.filter((p) => p.rating >= 4.5).slice(0, 8) ?? [], [products]);

  const handleAddToCart = useCallback((product) => {
    dispatch(addToCart(product));
    toast.success("Added to cart 🛒");
  }, [dispatch]);

  const handleToggleWishlist = useCallback((item) => {
    dispatch(toggleWishlist(item));
    const adding = !wishlistIds.has(item.id);
    toast[adding ? "success" : "info"](adding ? "Added to wishlist ❤️" : "Removed from wishlist");
  }, [dispatch, wishlistIds]);

  return (
    <div className="space-y-20">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden rounded-[24px] sm:rounded-[36px] min-h-[420px] sm:min-h-[580px] flex items-center px-5 sm:px-10 lg:px-16 py-10 sm:py-16"
        style={{ background: "linear-gradient(135deg,#0F0E0D 0%,#1a1815 40%,#2d2620 100%)" }}>
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(201,168,76,.2) 0%,transparent 70%)" }} />
        <div className="relative z-10 grid lg:grid-cols-2 items-center w-full gap-10">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-6"
              style={{ background: "rgba(201,168,76,.15)", color: "var(--gold)", border: "1px solid rgba(201,168,76,.3)" }}>
              ✦ Premium Collection 2026
            </span>
            <h1 className="font-display text-white leading-[1.05]"
              style={{ fontSize: "clamp(48px,7vw,80px)", fontWeight: 700 }}>
              Elevate<br /><em style={{ color: "var(--gold)" }}>Your Style.</em>
            </h1>
            <p className="mt-5 leading-8 max-w-[420px]"
              style={{ color: "rgba(255,255,255,.55)", fontSize: "16px" }}>
              Curated fashion, beauty, and lifestyle for the modern connoisseur.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/products"
                className="flex items-center gap-3 px-7 py-4 rounded-full font-semibold text-[14px] transition hover:scale-105 hover:shadow-xl"
                style={{ background: "var(--gold)", color: "var(--ink)" }}>
                Shop Now <FaArrowRight className="text-[12px]" />
              </Link>
              <Link to="/products"
                className="flex items-center gap-3 px-7 py-4 rounded-full font-medium text-[14px] transition hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,.2)", color: "white" }}>
                Explore Collection
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 sm:gap-10 mt-10 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,.1)" }}>
              {[["50K+","Happy Customers"],["1K+","Products"],["4.9★","Rating"]].map(([v,l]) => (
                <div key={l}>
                  <p className="font-bold" style={{ color: "var(--gold)", fontSize: "24px" }}>{v}</p>
                  <p className="text-[12px] mt-0.5 opacity-40 text-white">{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center relative">
            <div className="absolute inset-0 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background: "var(--gold)" }} />
            <motion.img
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              src="https://pngimg.com/d/lipstick_PNG76335.png"
              fetchPriority="high"
              alt="Featured"
              className="relative z-10 w-[340px] object-contain"
              style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))" }}
              onError={(e) => { e.target.src = "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/1.webp"; }}
            />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center text-center p-6 rounded-[22px] transition card-lift luxury-glass-card"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
              style={{ background: "rgba(201,168,76,.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
              <Icon style={{ color: "var(--gold)" }} className="text-[17px]" />
            </div>
            <h3 className="font-semibold text-[13px] mb-1 text-white">{title}</h3>
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>{desc}</p>
          </div>
        ))}
      </section>

      {/* ── CATEGORIES ── */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[12px] tracking-widest uppercase font-bold mb-2" style={{ color: "var(--gold)" }}>Browse</p>
            <h2 className="font-display font-semibold text-white" style={{ fontSize: "36px" }}>Shop By Category</h2>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-[13px] font-medium px-5 py-2 rounded-full hover:opacity-60 transition"
            style={{ border: "1px solid rgba(255,255,255,0.15)", color: "white" }}>
            View all <FaArrowRight className="text-[11px]" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(({ name, emoji, cat }) => (
            <Link key={name} to={`/products?category=${cat}`}>
              <div className="flex flex-col items-center rounded-[22px] p-5 text-center transition card-lift luxury-glass-card"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-[34px] mb-3 transition hover:scale-110 block">{emoji}</div>
                <h3 className="font-semibold text-[13px] text-white">{name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[12px] tracking-widest uppercase font-bold mb-2 flex items-center gap-2" style={{ color: "var(--gold)" }}>
              <FaFire /> Trending Now
            </p>
            <h2 className="font-display font-semibold text-white" style={{ fontSize: "36px" }}>Featured Products</h2>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-[13px] font-medium px-5 py-2 rounded-full hover:opacity-60 transition"
            style={{ border: "1px solid rgba(255,255,255,0.15)", color: "white" }}>
            View all <FaArrowRight className="text-[11px]" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((item) => (
              <FeaturedCard key={item.id} item={item}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlistIds.has(item.id)} />
            ))}
          </div>
        )}
      </section>

      {/* ── SALE BANNER ── */}
      <section className="rounded-[32px] overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1a1510,#2d2010)", border: "1px solid rgba(201,168,76,0.2)" }}>
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 p-6 sm:p-10 lg:p-14">
          <div className="flex-1">
            <span className="text-[11px] tracking-widest uppercase font-bold" style={{ color: "var(--gold)" }}>Limited Time</span>
            <h2 className="font-display mt-3 leading-tight text-white" style={{ fontSize: "clamp(30px,5vw,50px)", fontWeight: 600 }}>
              Summer Sale<br /><em style={{ color: "var(--gold)" }}>Up to 60% Off</em>
            </h2>
            <div className="flex flex-wrap gap-3 mt-5 mb-7">
              {[["SANVORA10","10% Off"],["SAVE20","20% Off"],["VIP30","30% Off"]].map(([code, label]) => (
                <div key={code} className="px-4 py-2 rounded-xl text-[12px] font-bold"
                  style={{ background: "rgba(201,168,76,.12)", border: "1px dashed var(--gold)", color: "white" }}>
                  {label}: <code style={{ color: "var(--gold)" }}>{code}</code>
                </div>
              ))}
            </div>
            <Link to="/products"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-full font-semibold text-[14px] transition hover:scale-105"
              style={{ background: "var(--gold)", color: "var(--ink)" }}>
              Shop the Sale <FaArrowRight className="text-[12px]" />
            </Link>
          </div>
          <img src="https://cdn.dummyjson.com/product-images/fragrances/dior-j-adore/1.webp"
            loading="lazy" decoding="async" alt="Sale"
            className="w-[200px] object-contain drop-shadow-2xl" />
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section>
        <div className="text-center mb-10">
          <p className="text-[12px] tracking-widest uppercase font-bold mb-2" style={{ color: "var(--gold)" }}>Reviews</p>
          <h2 className="font-display font-semibold text-white" style={{ fontSize: "36px" }}>What Customers Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, rating, text, avatar }) => (
            <div key={name} className="flex flex-col sm:flex-row gap-1 sm:gap-4 w-full p-6 sm:p-7 rounded-2xl luxury-glass-card !items-stretch sm:!items-center"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex gap-1 mb-4 sm:mb-0 sm:flex-shrink-0">
                {[...Array(rating)].map((_, j) => <FaStar key={j} style={{ color: "var(--gold)" }} className="text-[13px]" />)}
              </div>
              <p className="text-[14px] leading-7 flex-1" style={{ color: "rgba(255,255,255,0.6)" }}>"{text}"</p>
              <div className="flex items-center gap-3 mt-5 sm:mt-0 sm:flex-shrink-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                  style={{ background: "var(--gold)", color: "var(--ink)" }}>{avatar}</div>
                <p className="font-semibold text-[14px] text-white whitespace-nowrap">{name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="rounded-[32px] text-center py-10 sm:py-14 px-5 sm:px-6"
        style={{ background: "linear-gradient(135deg,#1a1510,#2d2010)", border: "1px solid rgba(201,168,76,0.2)" }}>
        <p className="text-[12px] tracking-widest uppercase font-bold mb-3" style={{ color: "var(--gold)" }}>Newsletter</p>
        <h2 className="font-display font-semibold text-white mb-4" style={{ fontSize: "clamp(24px,4vw,40px)" }}>Stay in the Loop</h2>
        <p className="text-[14px] mb-8 max-w-[400px] mx-auto" style={{ color: "rgba(255,255,255,.5)" }}>
          Exclusive offers and new arrivals delivered to your inbox.
        </p>
        <div className="flex max-w-[420px] mx-auto overflow-hidden rounded-full"
          style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)" }}>
          <input type="email" placeholder="Your email address"
            className="flex-1 min-w-0 bg-transparent px-4 sm:px-6 py-4 text-[14px] text-white outline-none placeholder-white/30" />
          <button onClick={() => toast.success("Subscribed! Welcome to SanVora ✨")}
            className="flex-shrink-0 px-4 sm:px-6 m-1.5 rounded-full font-semibold text-[12px] sm:text-[13px] transition hover:opacity-90"
            style={{ background: "var(--gold)", color: "var(--ink)" }}>
            Subscribe
          </button>
        </div>
      </section>

    </div>
  );
}

export default Home;

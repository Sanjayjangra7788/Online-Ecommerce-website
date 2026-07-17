import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getProducts } from "../../features/products/productSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { toggleWishlist } from "../../features/wishlist/wishlistSlice";
import { toast } from "react-toastify";
import { FaShoppingCart, FaHeart, FaStar, FaSearch, FaFilter, FaTimes, FaThLarge, FaList } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const SORT_OPTIONS = [
  { label: "Newest",             value: "newest"     },
  { label: "Price: Low → High",  value: "price_asc"  },
  { label: "Price: High → Low",  value: "price_desc" },
  { label: "Top Rated",          value: "rating"     },
  { label: "Biggest Discount",   value: "discount"   },
];

const CATEGORIES_FILTER = [
  "All","beauty","fragrances","furniture","groceries","home-decoration",
  "kitchen-accessories","laptops","mens-shirts","mens-shoes","mens-watches",
  "mobile-accessories","skin-care","smartphones","sports-accessories",
  "tablets","tops","womens-bags","womens-dresses","womens-jewellery",
  "womens-shoes","womens-watches",
];

// ── Memoised card ────────────────────────────────────────────────────────────
const ProductCard = memo(function ProductCard({ item, onAddToCart, onToggleWishlist, isWishlisted }) {
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
        {/* Discount badge */}
        {item.discountPercentage > 5 && (
          <div
            className="absolute left-3 top-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide text-white"
            style={{ background: "linear-gradient(135deg, #e05a4a, #c9392a)", boxShadow: "0 2px 8px rgba(217,79,61,0.45)" }}
          >
            -{Math.round(item.discountPercentage)}%
          </div>
        )}

        {/* Wishlist button */}
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

        {/* Product image */}
        <img
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain p-5"
          style={{ transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        />

        {/* Bottom image fade into card body */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to top, #141210, transparent)" }}
        />
      </Link>

      {/* ── CARD BODY ── */}
      <div className="flex flex-col flex-1 px-4 pt-3.5 pb-4" style={{ gap: "10px" }}>

        {/* Brand / Category */}
        <p
          className="text-[9px] uppercase tracking-[3px] font-bold truncate"
          style={{ color: "var(--gold)", letterSpacing: "0.18em" }}
        >
          {item.brand || item.category}
        </p>

        {/* Title */}
        <Link to={`/products/${item.id}`}>
          <h2
            className="font-semibold text-[13.5px] leading-snug line-clamp-2"
            style={{
              color: "rgba(255,255,255,0.88)",
              transition: "color 0.2s ease",
              minHeight: "36px",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.88)"; }}
          >
            {item.title}
          </h2>
        </Link>

        {/* Stars + rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className="text-[10px]"
                style={{ color: i < Math.floor(item.rating) ? "#f59e0b" : "rgba(255,255,255,0.12)" }}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
            {item.rating?.toFixed(1)}
          </span>
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            ({item.stock} in stock)
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-baseline gap-1.5 min-w-0 flex-shrink">
            <span className="font-bold text-[16px] sm:text-[19px] text-white leading-none whitespace-nowrap">
              ${item.price}
            </span>
            {item.discountPercentage > 0 && (
              <span className="text-[10px] sm:text-[11px] line-through whitespace-nowrap" style={{ color: "rgba(255,255,255,0.25)" }}>
                ${orig}
              </span>
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
            <FaShoppingCart className="text-[12px] sm:text-[10px]" />
            <span className="hidden sm:inline">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
});

// ── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div
    className="rounded-[20px] overflow-hidden flex flex-col"
    style={{
      background: "linear-gradient(160deg, #1c1a15 0%, #141210 60%, #0e0c09 100%)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    {/* image zone */}
    <div className="skeleton" style={{ height: "clamp(140px, 42vw, 230px)" }} />
    {/* body */}
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

// ── Main ──────────────────────────────────────────────────────────────────────
function Products() {
  const dispatch      = useDispatch();
  const navigate      = useNavigate();
  const [searchParams] = useSearchParams();

  const { products, loading } = useSelector((s) => s.products);
  const wishlistItems          = useSelector((s) => s.wishlist?.wishlistItems || []);

  const [search,     setSearch]     = useState(searchParams.get("q") || "");
  const [sort,       setSort]       = useState("newest");
  const [category,   setCategory]   = useState(searchParams.get("category") || "All");
  const [priceMax,   setPriceMax]   = useState(2000);
  const [filterOpen, setFilterOpen] = useState(false);
  const [listView,   setListView]   = useState(false);

  // Fetch only once thanks to caching inside productSlice
  useEffect(() => { dispatch(getProducts()); }, [dispatch]);

  // Sync URL params
  useEffect(() => {
    const cat = searchParams.get("category"); if (cat) setCategory(cat);
    const q   = searchParams.get("q");        if (q)   setSearch(q);
  }, [searchParams]);

  // Memoised wishlist id set — avoids rebuilding Set on every render
  const wishlistIds = useMemo(() => new Set(wishlistItems.map((w) => w.id)), [wishlistItems]);

  // Memoised filtered+sorted list — only recomputes when dependencies change
  const filtered = useMemo(() => {
    let list = products?.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || p.category === category) &&
      p.price <= priceMax
    ) ?? [];
    if (sort === "price_asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating")     list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "discount")   list = [...list].sort((a, b) => b.discountPercentage - a.discountPercentage);
    return list;
  }, [products, search, category, sort, priceMax]);

  // Stable callbacks so ProductCard never re-renders unnecessarily
  const handleAddToCart = useCallback((product) => {
    dispatch(addToCart(product));
    toast.success(`Added to cart 🛒`);
  }, [dispatch]);

  const handleToggleWishlist = useCallback((item) => {
    dispatch(toggleWishlist(item));
    const adding = !wishlistIds.has(item.id);
    toast[adding ? "success" : "info"](adding ? "Added to wishlist ❤️" : "Removed from wishlist");
  }, [dispatch, wishlistIds]);

  const resetFilters = () => { setSearch(""); setCategory("All"); setPriceMax(2000); setSort("newest"); navigate("/products"); };

  return (
    <div className="fade-up">
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-[12px] tracking-widest uppercase font-bold mb-2" style={{ color: "var(--gold)" }}>Catalogue</p>
        <h1 className="font-display font-semibold" style={{ fontSize: "clamp(36px,5vw,52px)", color: "var(--white)" }}>All Products</h1>
        <p className="mt-2 text-[14px]" style={{ color: "var(--muted)" }}>
          {loading ? "Loading…" : `${filtered.length} products`}
        </p>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        {/* Search */}
        <div className="flex items-center gap-3 flex-1 min-w-[200px] w-full sm:w-auto sm:max-w-[340px] px-5 h-[46px] rounded-full"
          style={{ background: "white", border: "1px solid var(--border)" }}>
          <FaSearch className="text-[13px]" style={{ color: "var(--muted)" }} />
          <input type="text" placeholder="Search products…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 bg-transparent text-[14px] outline-none" style={{ color: "var(--ink)" }} />
          {search && <button onClick={() => setSearch("")}><FaTimes className="text-[11px]" style={{ color: "var(--muted)" }} /></button>}
        </div>

        {/* Sort */}
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="h-[46px] px-5 rounded-full text-[13px] font-semibold cursor-pointer"
          style={{ background: "white", border: "1px solid var(--border)", color: "var(--ink)" }}>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Filters toggle */}
        <button onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 h-[46px] px-5 rounded-full text-[13px] font-semibold transition"
          style={{ background: filterOpen ? "var(--ink)" : "white", color: filterOpen ? "white" : "var(--ink)", border: "1px solid var(--border)" }}>
          <FaFilter className="text-[12px]" /> Filters
        </button>

        {/* Grid / List */}
        <div className="flex rounded-full overflow-hidden ml-auto" style={{ border: "1px solid var(--border)" }}>
          <button onClick={() => setListView(false)} className="w-11 h-[46px] flex items-center justify-center transition"
            style={{ background: !listView ? "var(--ink)" : "white", color: !listView ? "white" : "var(--muted)" }}>
            <FaThLarge className="text-[12px]" />
          </button>
          <button onClick={() => setListView(true)} className="w-11 h-[46px] flex items-center justify-center transition"
            style={{ background: listView ? "var(--ink)" : "white", color: listView ? "white" : "var(--muted)" }}>
            <FaList className="text-[12px]" />
          </button>
        </div>
      </div>

      {/* FILTER PANEL */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mb-8 p-6 rounded-2xl" style={{ background: "white", border: "1px solid var(--border)" }}>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="font-semibold text-[13px] mb-4" style={{ color: "var(--ink)" }}>Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES_FILTER.map((cat) => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className="px-4 py-1.5 rounded-full text-[12px] font-semibold transition capitalize"
                      style={{
                        background: category === cat ? "var(--ink)" : "var(--cream)",
                        color: category === cat ? "white" : "var(--muted)",
                        border: "1px solid var(--border)",
                      }}>
                      {cat === "All" ? "All" : cat.replace(/-/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold text-[13px] mb-4" style={{ color: "var(--ink)" }}>
                  Max Price: <span style={{ color: "var(--gold)" }}>${priceMax}</span>
                </p>
                <input type="range" min={10} max={2000} step={10} value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full cursor-pointer" style={{ accentColor: "var(--gold)" }} />
                <div className="flex justify-between mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                  <span>$10</span><span>$2,000</span>
                </div>
                <button onClick={resetFilters} className="mt-4 px-4 py-1.5 rounded-full text-[12px] font-semibold"
                  style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center rounded-2xl" style={{ background: "white", border: "1px solid var(--border)" }}>
          <div className="text-6xl mb-6">🔍</div>
          <h2 className="font-display font-semibold text-[32px] mb-2" style={{ color: "var(--ink)" }}>Nothing found</h2>
          <p style={{ color: "var(--muted)" }}>Try a different search or filter</p>
          <button onClick={resetFilters} className="mt-6 px-6 py-3 rounded-full font-semibold text-[14px]"
            style={{ background: "var(--ink)", color: "white" }}>Reset</button>
        </div>
      ) : listView ? (
        <div className="flex flex-col gap-3">
          {filtered.map((item) => {
            const orig = Math.round(item.price / (1 - item.discountPercentage / 100));
            return (
              <div
                key={item.id}
                className="flex flex-wrap sm:flex-nowrap gap-4 p-4 rounded-[18px]"
                style={{
                  background: "linear-gradient(160deg, #1c1a15 0%, #141210 60%, #0e0c09 100%)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.22)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Thumbnail */}
                <Link
                  to={`/products/${item.id}`}
                  className="flex-shrink-0 rounded-[14px] overflow-hidden flex items-center justify-center"
                  style={{ width: "96px", height: "96px", background: "linear-gradient(145deg, #1e1b14, #161310)" }}
                >
                  <img
                    src={item.thumbnail} alt={item.title}
                    loading="lazy" decoding="async"
                    className="w-full h-full object-contain p-2.5"
                    style={{ transition: "transform 0.4s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-[140px] flex flex-col justify-center gap-1.5">
                  <p className="text-[9px] uppercase tracking-[3px] font-bold" style={{ color: "var(--gold)" }}>
                    {item.brand || item.category}
                  </p>
                  <Link to={`/products/${item.id}`}>
                    <h2
                      className="font-semibold text-[14px] truncate"
                      style={{ color: "rgba(255,255,255,0.88)", transition: "color 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.88)"; }}
                    >
                      {item.title}
                    </h2>
                  </Link>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-[10px]"
                        style={{ color: i < Math.floor(item.rating) ? "#f59e0b" : "rgba(255,255,255,0.12)" }} />
                    ))}
                    <span className="text-[11px] ml-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {item.rating?.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Price + actions */}
                <div className="flex flex-col items-end justify-center gap-2.5 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-bold text-[18px] text-white leading-none">${item.price}</p>
                    {item.discountPercentage > 0 && (
                      <p className="text-[11px] line-through mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>${orig}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleWishlist(item)}
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: wishlistIds.has(item.id) ? "var(--red)" : "rgba(255,255,255,0.35)",
                        background: wishlistIds.has(item.id) ? "rgba(217,79,61,0.1)" : "transparent",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <FaHeart className="text-[11px]" />
                    </button>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11.5px] font-semibold"
                      style={{
                        background: "linear-gradient(135deg, #d4a843, #c9a84c, #b8922e)",
                        color: "#0f0e0d",
                        boxShadow: "0 3px 12px rgba(201,168,76,0.3)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(201,168,76,0.45)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 3px 12px rgba(201,168,76,0.3)";
                      }}
                    >
                      <FaShoppingCart className="text-[10px]" /> Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <ProductCard key={item.id} item={item}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlistIds.has(item.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;

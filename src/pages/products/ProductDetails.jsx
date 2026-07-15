import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getSingleProduct } from "../../features/products/productSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { toggleWishlist } from "../../features/wishlist/wishlistSlice";
import { toast } from "react-toastify";
import { FaStar, FaShoppingCart, FaHeart, FaShieldAlt, FaTruck, FaUndo, FaChevronRight, FaMinus, FaPlus } from "react-icons/fa";

function ProductDetails() {
  const dispatch  = useDispatch();
  const { id }    = useParams();
  const { singleProduct: product, singleLoading: loading } = useSelector((s) => s.products);
  const wishlistItems = useSelector((s) => s.wishlist?.wishlistItems || []);

  const [mainImage, setMainImage] = useState("");
  const [qty, setQty]             = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const isWishlisted = wishlistItems.some((w) => w.id === product?.id);

  // Reset qty, scroll to top on product change
  useEffect(() => { dispatch(getSingleProduct(id)); setQty(1); window.scrollTo({ top: 0 }); }, [id, dispatch]);
  useEffect(() => { if (product?.thumbnail) setMainImage(product.thumbnail); }, [product]);

  const handleAddToCart = useCallback(() => {
    for (let i = 0; i < qty; i++) dispatch(addToCart(product));
    toast.success(`${qty}x ${product.title.slice(0, 18)}… added 🛒`);
  }, [dispatch, product, qty]);

  const handleWishlist = useCallback(() => {
    dispatch(toggleWishlist(product));
    toast[isWishlisted ? "info" : "success"](isWishlisted ? "Removed from wishlist" : "Added to wishlist ❤️");
  }, [dispatch, product, isWishlisted]);

  if (loading || !product) {
    return (
      <div className="grid lg:grid-cols-2 gap-14 animate-pulse">
        <div className="skeleton rounded-3xl h-[500px]" />
        <div className="space-y-5 pt-4">
          {[120, 80, 200, 100, 160].map((w, i) => (
            <div key={i} className="skeleton h-5 rounded" style={{ width: w }} />
          ))}
        </div>
      </div>
    );
  }

  const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);
  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <div className="fade-up">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] mb-8" style={{ color: "var(--muted)" }}>
        <Link to="/" className="hover:opacity-60 transition">Home</Link>
        <FaChevronRight className="text-[9px]" />
        <Link to="/products" className="hover:opacity-60 transition">Products</Link>
        <FaChevronRight className="text-[9px]" />
        <span className="capitalize" style={{ color: "var(--ink)" }}>{product.category}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-14">
        {/* IMAGES */}
        <div>
          <div className="rounded-3xl overflow-hidden mb-4 img-zoom" style={{ height: "500px", background: "var(--cream)", border: "1px solid var(--border)" }}>
            {/* Main image: eager, high priority — it's above the fold */}
            <img src={mainImage} alt={product.title} fetchPriority="high"
              className="w-full h-full object-contain p-8" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button key={i} onClick={() => setMainImage(img)}
                className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden transition-all"
                style={{ border: mainImage === img ? "2px solid var(--gold)" : "1px solid var(--border)", background: "var(--cream)" }}>
                {/* Thumbnails: lazy */}
                <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-contain p-1" />
              </button>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div className="pt-2">
          <p className="text-[12px] uppercase tracking-widest font-bold mb-3" style={{ color: "var(--gold)" }}>
            {product.brand || product.category}
          </p>
          <h1 className="font-display font-semibold mb-4 leading-tight" style={{ fontSize: "clamp(26px,4vw,42px)", color: "var(--ink)" }}>
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-[14px]" style={{ color: i < Math.floor(product.rating) ? "#f59e0b" : "var(--border)" }} />
              ))}
            </div>
            <span className="font-semibold" style={{ color: "var(--ink)" }}>{product.rating}</span>
            <span className="text-[13px]" style={{ color: "var(--muted)" }}>({product.reviews?.length || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-black" style={{ fontSize: "42px", color: "var(--ink)" }}>${product.price}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-[18px] line-through" style={{ color: "var(--border)" }}>${originalPrice}</span>
                <span className="px-3 py-1 rounded-full text-[12px] font-bold text-white" style={{ background: "var(--red)" }}>
                  -{Math.round(product.discountPercentage)}%
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6 text-[13px]" style={{ color: product.stock > 0 ? "#22c55e" : "var(--red)" }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: product.stock > 0 ? "#22c55e" : "var(--red)" }} />
            {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left!` : "Out of Stock"}
          </div>

          {/* Qty + Cart */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-12 h-14 flex items-center justify-center hover:bg-black/5 transition text-lg" style={{ color: "var(--ink)" }}>
                <FaMinus className="text-[12px]" />
              </button>
              <span className="w-12 text-center font-bold text-[16px]" style={{ color: "var(--ink)" }}>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="w-12 h-14 flex items-center justify-center hover:bg-black/5 transition" style={{ color: "var(--ink)" }}>
                <FaPlus className="text-[12px]" />
              </button>
            </div>
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="flex-1 h-14 rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-3 transition hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--ink)", color: "white" }}>
              <FaShoppingCart className="text-[14px]" /> Add to Cart
            </button>
            <button onClick={handleWishlist}
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition hover:scale-110"
              style={{ border: "1px solid var(--border)", background: isWishlisted ? "#FFF0F0" : "white" }}>
              <FaHeart style={{ color: isWishlisted ? "var(--red)" : "var(--border)" }} />
            </button>
          </div>

          {/* Buy Now */}
          <Link to="/cart" onClick={handleAddToCart}
            className="w-full h-14 rounded-2xl flex items-center justify-center font-semibold text-[15px] mb-8 transition hover:opacity-90"
            style={{ background: "var(--gold)", color: "var(--ink)" }}>
            ⚡ Buy Now
          </Link>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-4">
            {[[FaTruck,"Free Shipping","Orders $100+"],[FaShieldAlt,"Secure Pay","SSL encrypted"],[FaUndo,"Easy Returns","30 days"]].map(([Icon,title,desc]) => (
              <div key={title} className="text-center p-4 rounded-2xl" style={{ background: "var(--cream)" }}>
                <Icon className="mx-auto mb-2 text-[18px]" style={{ color: "var(--gold)" }} />
                <p className="font-semibold text-[12px]" style={{ color: "var(--ink)" }}>{title}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mt-16">
        <div className="flex gap-2 mb-8" style={{ borderBottom: "1px solid var(--border)" }}>
          {["description","specifications","reviews"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="pb-4 px-6 text-[14px] font-semibold capitalize transition"
              style={{ color: activeTab === tab ? "var(--ink)" : "var(--muted)", borderBottom: activeTab === tab ? "2px solid var(--ink)" : "2px solid transparent", marginBottom: -1 }}>
              {tab}{tab === "reviews" ? ` (${product.reviews?.length || 0})` : ""}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <p className="text-[15px] leading-8 max-w-[700px]" style={{ color: "var(--muted)" }}>{product.description}</p>
        )}
        {activeTab === "specifications" && (
          <div className="max-w-[600px]">
            {[["Brand", product.brand || "—"],["Category", product.category],["Rating", `${product.rating}/5`],
              ["Stock", `${product.stock} units`],["Discount", `${product.discountPercentage?.toFixed(1)}%`],
              ["Return Policy", product.returnPolicy || "30-day return policy"],["Warranty", product.warrantyInformation || "N/A"]
            ].map(([k,v],i) => (
              <div key={k} className="flex justify-between py-3 px-4 rounded-xl text-[13px]" style={{ background: i%2===0 ? "var(--cream)" : "white" }}>
                <span style={{ color: "var(--muted)" }}>{k}</span>
                <span className="font-semibold capitalize" style={{ color: "var(--ink)" }}>{v}</span>
              </div>
            ))}
          </div>
        )}
        {activeTab === "reviews" && (
          <div className="max-w-[700px] space-y-4">
            {product.reviews?.length ? product.reviews.map((r, i) => (
              <div key={i} className="p-5 rounded-2xl" style={{ background: "white", border: "1px solid var(--border)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px]"
                    style={{ background: "var(--gold)", color: "var(--ink)" }}>
                    {(r.reviewerName || "A")[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-[13px]" style={{ color: "var(--ink)" }}>{r.reviewerName}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <FaStar key={j} className="text-[11px]" style={{ color: j < r.rating ? "#f59e0b" : "var(--border)" }} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[13px] leading-6" style={{ color: "var(--muted)" }}>{r.comment}</p>
              </div>
            )) : <p style={{ color: "var(--muted)" }}>No reviews yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;

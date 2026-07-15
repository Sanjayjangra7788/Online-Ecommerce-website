import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../../features/wishlist/wishlistSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { FaTrash, FaShoppingCart, FaHeart, FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function Wishlist() {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const moveToCart = (item) => {
    dispatch(addToCart(item));
    dispatch(toggleWishlist(item));
    toast.success("Moved to cart 🛒");
  };

  return (
    <div className="fade-up">
      <div className="mb-10">
        <p className="text-[12px] tracking-widest uppercase font-semibold mb-2" style={{ color: "var(--gold)" }}>Saved</p>
        <h1 className="font-display font-semibold" style={{ fontSize: "clamp(32px,4vw,48px)", color: "var(--ink)" }}>
          My Wishlist
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: "var(--muted)" }}>
          {wishlistItems.length === 0 ? "Nothing saved yet" : `${wishlistItems.length} items saved`}
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="py-24 text-center rounded-3xl" style={{ background: "white", border: "1px solid var(--border)" }}>
          <div className="text-7xl mb-6">🤍</div>
          <h2 className="font-display font-semibold text-[36px] mb-3" style={{ color: "var(--ink)" }}>Nothing saved yet</h2>
          <p className="mb-8" style={{ color: "var(--muted)" }}>Tap the heart on any product to save it here</p>
          <Link to="/products"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-[14px] transition hover:opacity-90"
            style={{ background: "var(--ink)", color: "white" }}>
            Discover Products <FaArrowRight className="text-[12px]" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlistItems.map((item) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl overflow-hidden card-lift" style={{ border: "1px solid var(--border)" }}>

                <Link to={`/products/${item.id}`} className="block relative" style={{ height: "220px", background: "var(--cream)" }}>
                  <img src={item.thumbnail} alt={item.title}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-110" />
                </Link>

                <div className="p-5">
                  <Link to={`/products/${item.id}`}>
                    <h2 className="font-semibold text-[14px] leading-snug line-clamp-2 mb-1 hover:opacity-70 transition"
                      style={{ color: "var(--ink)" }}>{item.title}</h2>
                  </Link>
                  <p className="text-[12px] mb-4 capitalize" style={{ color: "var(--muted)" }}>{item.category}</p>
                  <p className="font-bold text-[20px] mb-5" style={{ color: "var(--ink)" }}>${item.price}</p>

                  <div className="flex gap-2">
                    <button onClick={() => moveToCart(item)}
                      className="flex-1 flex items-center justify-center gap-2 h-10 rounded-full text-[12px] font-semibold transition hover:opacity-90"
                      style={{ background: "var(--ink)", color: "white" }}>
                      <FaShoppingCart className="text-[11px]" /> Add to Cart
                    </button>
                    <button onClick={() => { dispatch(toggleWishlist(item)); toast.info("Removed from wishlist"); }}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition hover:bg-red-50"
                      style={{ border: "1px solid var(--border)", color: "var(--red)" }}>
                      <FaTrash className="text-[12px]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default Wishlist;

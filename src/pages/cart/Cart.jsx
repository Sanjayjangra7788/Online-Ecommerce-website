import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, increaseQty, decreaseQty } from "../../features/cart/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowRight, FaShieldAlt, FaTag } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const [promoCode,    setPromoCode]    = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError,   setPromoError]   = useState("");
  const [discount,     setDiscount]     = useState(0);

  const PROMO_CODES = { SANVORA10: 0.10, SAVE20: 0.20, VIP30: 0.30 };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setDiscount(PROMO_CODES[code]);
      setPromoApplied(true);
      setPromoError("");
      toast.success(`Promo applied! ${PROMO_CODES[code] * 100}% off 🎉`);
    } else {
      setPromoError("Invalid promo code");
      setDiscount(0);
      setPromoApplied(false);
    }
  };

  const subtotal  = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping  = subtotal >= 100 ? 0 : 9.99;
  const tax       = subtotal * 0.08;
  const discountAmt = subtotal * discount;
  const total     = subtotal + shipping + tax - discountAmt;

  const handleRemove = (item) => {
    dispatch(removeFromCart(item.id));
    toast.info(`${item.title.slice(0, 18)}... removed`);
  };


  return (
    <div className="fade-up">
      <div className="mb-10">
        <p className="text-[12px] tracking-widest uppercase font-semibold mb-2" style={{ color: "var(--gold)" }}>Bag</p>
        <h1 className="font-display font-semibold" style={{ fontSize: "clamp(32px,4vw,48px)", color: "var(--ink)" }}>
          Shopping Cart
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: "var(--muted)" }}>
          {cartItems.length === 0 ? "Your cart is empty" : `${cartItems.reduce((a, i) => a + i.quantity, 0)} items in your cart`}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="py-24 text-center rounded-3xl" style={{ background: "white", border: "1px solid var(--border)" }}>
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="font-display font-semibold text-[36px] mb-3" style={{ color: "var(--ink)" }}>Your cart is empty</h2>
          <p className="mb-8" style={{ color: "var(--muted)" }}>Add something beautiful to get started</p>
          <Link to="/products"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-[14px] transition hover:opacity-90"
            style={{ background: "var(--ink)", color: "white" }}>
            Browse Products <FaArrowRight className="text-[12px]" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div key={item.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-5 p-5 rounded-2xl" style={{ background: "white", border: "1px solid var(--border)" }}>

                  <Link to={`/products/${item.id}`} className="flex-shrink-0">
                    <div className="w-[110px] h-[110px] rounded-xl overflow-hidden flex items-center justify-center"
                      style={{ background: "var(--cream)" }}>
                      <img src={item.thumbnail} alt={item.title} className="max-w-full max-h-full object-contain p-2" />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/products/${item.id}`}>
                          <h2 className="font-semibold text-[15px] leading-snug hover:opacity-70 transition truncate max-w-[280px]"
                            style={{ color: "var(--ink)" }}>{item.title}</h2>
                        </Link>
                        <p className="text-[12px] capitalize mt-0.5" style={{ color: "var(--muted)" }}>{item.category}</p>
                      </div>
                      <button onClick={() => handleRemove(item)}
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-red-50 transition"
                        style={{ color: "var(--muted)" }}>
                        <FaTrash className="text-[12px]" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center rounded-full h-[36px] overflow-hidden"
                        style={{ border: "1px solid var(--border)" }}>
                        <button onClick={() => dispatch(decreaseQty(item.id))}
                          className="w-9 h-full flex items-center justify-center hover:bg-black/5 transition">
                          <FaMinus className="text-[10px]" style={{ color: "var(--muted)" }} />
                        </button>
                        <span className="w-8 text-center text-[14px] font-semibold" style={{ color: "var(--ink)" }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => dispatch(increaseQty(item.id))}
                          className="w-9 h-full flex items-center justify-center hover:bg-black/5 transition">
                          <FaPlus className="text-[10px]" style={{ color: "var(--muted)" }} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-[17px]" style={{ color: "var(--ink)" }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-[12px]" style={{ color: "var(--muted)" }}>${item.price} each</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* SUMMARY */}
          <div className="space-y-4">
            {/* Promo */}
            <div className="p-5 rounded-2xl" style={{ background: "white", border: "1px solid var(--border)" }}>
              <p className="font-semibold text-[14px] mb-3" style={{ color: "var(--ink)" }}>Promo Code</p>
              <div className="flex gap-2">
                <input
                  placeholder="SANVORA10, SAVE20, VIP30"
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value); setPromoError(""); }}
                  className="flex-1 h-[42px] px-4 rounded-xl text-[13px] outline-none"
                  style={{ background: "var(--cream)", border: `1px solid ${promoError ? "var(--red)" : "var(--border)"}`, color: "var(--ink)" }}
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={promoApplied}
                  className="h-[42px] px-4 rounded-xl text-[13px] font-medium transition hover:opacity-90 disabled:opacity-60"
                  style={{ background: "var(--ink)", color: "white" }}>
                  {promoApplied ? "✓" : "Apply"}
                </button>
              </div>
              {promoError && <p className="text-[12px] mt-1.5" style={{ color: "var(--red)" }}>{promoError}</p>}
              {promoApplied && (
                <p className="text-[12px] mt-1.5" style={{ color: "#22c55e" }}>
                  {discount * 100}% discount applied!
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div className="p-6 rounded-2xl" style={{ background: "white", border: "1px solid var(--border)" }}>
              <h2 className="font-semibold text-[16px] mb-5" style={{ color: "var(--ink)" }}>Order Summary</h2>

              <div className="space-y-3 pb-5" style={{ borderBottom: "1px solid var(--border)" }}>
                {[
                  ["Subtotal", `$${subtotal.toFixed(2)}`],
                  ["Shipping", shipping === 0 ? <span style={{ color: "#22c55e" }}>Free</span> : `$${shipping.toFixed(2)}`],
                  ["Tax (8%)", `$${tax.toFixed(2)}`],
                  ...(discount > 0 ? [["Discount", <span style={{ color: "#22c55e" }}>-${discountAmt.toFixed(2)}</span>]] : []),
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-[13px]" style={{ color: "var(--muted)" }}>{label}</span>
                    <span className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="font-bold text-[15px]" style={{ color: "var(--ink)" }}>Total</span>
                <span className="font-bold text-[22px]" style={{ color: "var(--ink)" }}>${total.toFixed(2)}</span>
              </div>

              {shipping > 0 && (
                <p className="text-[12px] mb-4 px-3 py-2 rounded-lg" style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)" }}>
                  <FaTag className="inline mr-1" />
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}

              <button onClick={() => navigate("/shipping")}
                className="w-full h-[52px] rounded-full font-semibold text-[14px] flex items-center justify-center gap-3 transition hover:opacity-90 hover:shadow-lg"
                style={{ background: "var(--ink)", color: "white" }}>
                Proceed to Checkout <FaArrowRight className="text-[12px]" />
              </button>

              <div className="flex items-center justify-center gap-2 mt-4">
                <FaShieldAlt className="text-[11px]" style={{ color: "var(--muted)" }} />
                <span className="text-[12px]" style={{ color: "var(--muted)" }}>Secure SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;

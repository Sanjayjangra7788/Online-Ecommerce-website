import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod, addOrder } from "../../features/order/orderSlice";
import { clearCart } from "../../features/cart/cartSlice";
import { FaCreditCard, FaPaypal, FaArrowRight, FaLock, FaCheckCircle } from "react-icons/fa";

const STEPS = ["Shipping", "Payment", "Confirm"];

const PAYMENT_OPTIONS = [
  { id: "Stripe", label: "Credit / Debit Card", icon: FaCreditCard, desc: "Visa, Mastercard, Amex" },
  { id: "PayPal", label: "PayPal", icon: FaPaypal, desc: "Pay with your PayPal account" },
  { id: "COD", label: "Cash on Delivery", icon: FaCheckCircle, desc: "Pay when you receive" },
];

function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  const [loading, setLoading] = useState(false);

  const cartItems      = useSelector((s) => s.cart.cartItems);
  const shippingAddress = useSelector((s) => s.order.shippingAddress);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(savePaymentMethod(paymentMethod));

    // Build order object and save it
    const order = {
      id:           Date.now(),
      orderDate:    new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      status:       "Pending",
      paymentMethod,
      shippingAddress,
      orderItems:   cartItems,
      totalPrice:   total,
    };
    dispatch(addOrder(order));
    dispatch(clearCart());

    await new Promise((r) => setTimeout(r, 800));
    navigate("/order-success");
  };

  return (
    <div className="fade-up max-w-[640px] mx-auto">
      {/* Steps */}
      <div className="flex items-center justify-center gap-0 mb-10 sm:mb-12">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-[12px] sm:text-[13px] transition"
                style={{
                  background: i === 1 ? "var(--ink)" : i < 1 ? "var(--gold)" : "var(--border)",
                  color: i <= 1 ? "white" : "var(--muted)",
                }}>
                {i < 1 ? "✓" : i + 1}
              </div>
              <span className="text-[10px] sm:text-[11px] mt-1.5 font-medium whitespace-nowrap" style={{ color: i <= 1 ? "var(--ink)" : "var(--muted)" }}>{step}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-8 sm:w-20 h-[2px] mb-4" style={{ background: i < 1 ? "var(--gold)" : "var(--border)" }} />
            )}
          </div>
        ))}
      </div>

      <div className="p-5 sm:p-8 rounded-3xl" style={{ background: "white", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.1)" }}>
            <FaLock style={{ color: "var(--gold)" }} />
          </div>
          <div>
            <h1 className="font-semibold text-[18px]" style={{ color: "var(--ink)" }}>Payment Method</h1>
            <p className="text-[13px]" style={{ color: "var(--muted)" }}>Choose how you'd like to pay</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {PAYMENT_OPTIONS.map(({ id, label, icon: Icon, desc }) => (
            <label key={id} className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md"
              style={{
                border: paymentMethod === id ? "2px solid var(--ink)" : "1px solid var(--border)",
                background: paymentMethod === id ? "rgba(15,14,13,0.03)" : "white",
              }}>
              <input type="radio" name="payment" value={id} checked={paymentMethod === id}
                onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: paymentMethod === id ? "var(--ink)" : "var(--cream)" }}>
                <Icon className="text-[16px]" style={{ color: paymentMethod === id ? "white" : "var(--muted)" }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[14px]" style={{ color: "var(--ink)" }}>{label}</p>
                <p className="text-[12px]" style={{ color: "var(--muted)" }}>{desc}</p>
              </div>
              {paymentMethod === id && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--ink)" }}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </label>
          ))}

          {paymentMethod === "Stripe" && (
            <div className="p-5 rounded-2xl space-y-3" style={{ background: "var(--cream)", border: "1px solid var(--border)" }}>
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink)" }}>Card Number</label>
                <input placeholder="4242 4242 4242 4242"
                  className="w-full h-[44px] px-4 rounded-xl text-[14px]"
                  style={{ background: "white", border: "1px solid var(--border)", color: "var(--ink)" }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink)" }}>Expiry</label>
                  <input placeholder="MM / YY"
                    className="w-full h-[44px] px-4 rounded-xl text-[14px]"
                    style={{ background: "white", border: "1px solid var(--border)", color: "var(--ink)" }} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink)" }}>CVV</label>
                  <input placeholder="•••"
                    className="w-full h-[44px] px-4 rounded-xl text-[14px]"
                    style={{ background: "white", border: "1px solid var(--border)", color: "var(--ink)" }} />
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full h-[52px] rounded-full font-semibold text-[14px] flex items-center justify-center gap-3 mt-2 transition hover:opacity-90 disabled:opacity-70"
            style={{ background: "var(--ink)", color: "white" }}>
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><span>Place Order</span><FaArrowRight className="text-[12px]" /></>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-5">
          <FaLock className="text-[11px]" style={{ color: "var(--muted)" }} />
          <span className="text-[12px]" style={{ color: "var(--muted)" }}>Secured by 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
}

export default Payment;

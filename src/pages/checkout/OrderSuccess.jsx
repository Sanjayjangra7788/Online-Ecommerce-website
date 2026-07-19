import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaArrowRight, FaBox, FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";
import { motion } from "framer-motion";

function OrderSuccess() {
  const orders          = useSelector((s) => s.order?.orders || []);
  const latestOrder     = orders[0]; // addOrder uses unshift so index 0 is newest

  if (!latestOrder) {
    return (
      <div className="fade-up max-w-[640px] mx-auto text-center py-24">
        <div className="text-7xl mb-6">📦</div>
        <h1 className="font-display font-semibold text-[36px] mb-4" style={{ color: "var(--ink)" }}>
          No order found
        </h1>
        <Link to="/products"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-[14px] transition hover:opacity-90"
          style={{ background: "var(--ink)", color: "white" }}>
          Start Shopping <FaArrowRight className="text-[12px]" />
        </Link>
      </div>
    );
  }

  return (
    <div className="fade-up max-w-[640px] mx-auto">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center mb-10"
      >
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(34,197,94,0.12)" }}>
          <FaCheckCircle className="text-[40px]" style={{ color: "#22c55e" }} />
        </div>
        <h1 className="font-display font-semibold mb-2" style={{ fontSize: "clamp(28px,4vw,42px)", color: "var(--ink)" }}>
          Order Confirmed!
        </h1>
        <p className="text-[15px]" style={{ color: "var(--white)" }}>
          Thank you for your purchase. Your order is being processed.
        </p>
      </motion.div>

      {/* Order Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl overflow-hidden mb-6"
        style={{ background: "white", border: "1px solid var(--border)" }}
      >
        {/* Order ID + Date */}
        <div className="px-6 py-5 flex flex-wrap items-center justify-between gap-3"
          style={{ background: "var(--cream)", borderBottom: "1px solid var(--border)" }}>
          <div>
            <p className="text-[12px] uppercase tracking-widest font-bold mb-1" style={{ color: "var(--gold)" }}>
              Order ID
            </p>
            <p className="font-bold text-[16px]" style={{ color: "var(--ink)" }}>#{latestOrder.id}</p>
          </div>
          <div className="text-right">
            <p className="text-[12px]" style={{ color: "var(--muted)" }}>{latestOrder.orderDate}</p>
            <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-[11px] font-semibold"
              style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
              <FaBox className="text-[9px]" /> {latestOrder.status}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="divide-y px-6" style={{ borderColor: "var(--border)" }}>
          {latestOrder.orderItems?.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ background: "var(--cream)" }}>
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain p-1" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[14px] truncate" style={{ color: "var(--ink)" }}>{item.title}</p>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--muted)" }}>Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-[14px]" style={{ color: "var(--ink)" }}>
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-6 py-5 space-y-2" style={{ borderTop: "1px solid var(--border)", background: "var(--cream)" }}>
          <div className="flex justify-between text-[13px]">
            <span style={{ color: "var(--muted)" }}>Subtotal</span>
            <span style={{ color: "var(--ink)" }}>
              ${latestOrder.orderItems?.reduce((a, i) => a + i.price * i.quantity, 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span style={{ color: "var(--muted)" }}>Shipping</span>
            <span style={{ color: "#22c55e" }}>
              {latestOrder.totalPrice - latestOrder.orderItems?.reduce((a, i) => a + i.price * i.quantity, 0) < 10
                ? "Free"
                : `$9.99`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-[16px] pt-2" style={{ borderTop: "1px solid var(--border)" }}>
            <span style={{ color: "var(--ink)" }}>Total Paid</span>
            <span style={{ color: "var(--ink)" }}>${latestOrder.totalPrice?.toFixed(2)}</span>
          </div>
        </div>
      </motion.div>

      {/* Shipping + Payment Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid sm:grid-cols-2 gap-4 mb-8"
      >
        <div className="p-5 rounded-2xl" style={{ background: "white", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <FaMapMarkerAlt style={{ color: "var(--gold)" }} />
            <p className="font-semibold text-[13px]" style={{ color: "var(--ink)" }}>Shipping To</p>
          </div>
          <p className="text-[13px] leading-6" style={{ color: "var(--muted)" }}>
            {latestOrder.shippingAddress?.fullName}<br />
            {latestOrder.shippingAddress?.address}<br />
            {latestOrder.shippingAddress?.city}, {latestOrder.shippingAddress?.postalCode}<br />
            {latestOrder.shippingAddress?.country}
          </p>
        </div>
        <div className="p-5 rounded-2xl" style={{ background: "white", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <FaCreditCard style={{ color: "var(--gold)" }} />
            <p className="font-semibold text-[13px]" style={{ color: "var(--ink)" }}>Payment Method</p>
          </div>
          <p className="text-[13px]" style={{ color: "var(--muted)" }}>{latestOrder.paymentMethod}</p>
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Link to="/orders"
          className="flex-1 h-[52px] rounded-full font-semibold text-[14px] flex items-center justify-center gap-3 transition hover:opacity-90"
          style={{ background: "var(--ink)", color: "white" }}>
          View My Orders <FaArrowRight className="text-[12px]" />
        </Link>
        <Link to="/products"
          className="flex-1 h-[52px] rounded-full font-semibold text-[14px] flex items-center justify-center gap-3 transition hover:opacity-90"
          style={{ border: "1px solid var(--border)", color: "var(--ink)", background: "white" }}>
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
}

export default OrderSuccess;

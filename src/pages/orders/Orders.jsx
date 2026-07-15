import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaTruck,
} from "react-icons/fa";
import { motion } from "framer-motion";

const STATUS_CONFIG = {
  Pending: {
    color: "#F59E0B",
    bg: "#FFF9EB",
    icon: FaClock,
  },

  Processing: {
    color: "#3B82F6",
    bg: "#EFF6FF",
    icon: FaBox,
  },

  Shipped: {
    color: "#8B5CF6",
    bg: "#F5F3FF",
    icon: FaTruck,
  },

  Delivered: {
    color: "#22C55E",
    bg: "#F0FDF4",
    icon: FaCheckCircle,
  },
};

function Orders() {
  const { orders = [] } = useSelector(
    (state) => state.order || {}
  );

  return (
    <div className="fade-up">
      {/* Header */}
      <div className="mb-10">
        <p
          className="text-[12px] tracking-widest uppercase font-semibold mb-2"
          style={{ color: "var(--gold)" }}
        >
          Account
        </p>

        <h1
          className="font-display font-semibold"
          style={{
            fontSize: "clamp(32px,4vw,48px)",
            color: "var(--ink)",
          }}
        >
          My Orders
        </h1>

        <p
          className="mt-1 text-[14px]"
          style={{ color: "var(--muted)" }}
        >
          {orders.length === 0
            ? "No orders placed yet"
            : `${orders.length} orders placed`}
        </p>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-24 text-center rounded-3xl"
          style={{
            background: "white",
            border: "1px solid var(--border)",
          }}
        >
          <div className="text-7xl mb-6">📦</div>

          <h2
            className="font-display font-semibold text-[36px] mb-3"
            style={{ color: "var(--ink)" }}
          >
            No orders yet
          </h2>

          <p
            className="mb-8"
            style={{ color: "var(--muted)" }}
          >
            Your order history will appear here
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-[14px] transition hover:opacity-90"
            style={{
              background: "var(--ink)",
              color: "white",
            }}
          >
            Start Shopping
            <FaArrowRight className="text-[12px]" />
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => {
            const statusConf =
              STATUS_CONFIG[order.status] ||
              STATUS_CONFIG.Pending;

            const StatusIcon = statusConf.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "white",
                  border: "1px solid var(--border)",
                }}
              >
                {/* Order Header */}
                <div
                  className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: "var(--cream)",
                  }}
                >
                  <div>
                    <p
                      className="font-bold text-[15px]"
                      style={{ color: "var(--ink)" }}
                    >
                      Order #{order.id}
                    </p>

                    <p
                      className="text-[12px] mt-0.5"
                      style={{ color: "var(--muted)" }}
                    >
                      {order.orderDate}
                    </p>
                  </div>

                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold"
                    style={{
                      background: statusConf.bg,
                      color: statusConf.color,
                    }}
                  >
                    <StatusIcon className="text-[11px]" />
                    {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div
                  className="divide-y px-6"
                  style={{ borderColor: "var(--border)" }}
                >
                  {order.orderItems?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 py-4"
                    >
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{
                          background: "var(--cream)",
                        }}
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="font-medium text-[14px] truncate"
                          style={{ color: "var(--ink)" }}
                        >
                          {item.title}
                        </p>

                        <p
                          className="text-[12px] mt-0.5"
                          style={{ color: "var(--muted)" }}
                        >
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p
                        className="font-bold text-[15px]"
                        style={{ color: "var(--ink)" }}
                      >
                        $
                        {(
                          item.price * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-between px-6 py-5"
                  style={{
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <span
                      className="text-[13px]"
                      style={{ color: "var(--muted)" }}
                    >
                      Total Paid:
                    </span>

                    <span
                      className="font-bold text-[20px] ml-1"
                      style={{ color: "var(--ink)" }}
                    >
                      ${order.totalPrice?.toFixed(2)}
                    </span>
                  </div>

                  <Link
                    to="/products"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition hover:opacity-90"
                    style={{
                      background: "var(--ink)",
                      color: "white",
                    }}
                  >
                    Buy Again
                    <FaArrowRight className="text-[11px]" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;
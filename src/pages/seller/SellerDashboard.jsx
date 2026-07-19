// src/pages/seller/SellerDashboard.jsx
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaPlus, FaBoxOpen, FaTrash, FaStore, FaPen, FaReceipt } from "react-icons/fa";
import { toast } from "react-toastify";
import { deleteSellerProduct, getSalesForSeller } from "../../utils/sellerStore";
import { getProducts, removeLocalProduct } from "../../features/products/productSlice";

const TABS = ["My Products", "My Sales"];

function SellerDashboard() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const allProducts = useSelector((s) => s.products.products);
  const allOrders = useSelector((s) => s.order.orders);
  const [tab, setTab] = useState("My Products");

  useEffect(() => {
    dispatch(getProducts()); // no-op agar already loaded — cached
  }, [dispatch]);

  // Redux se live filter — edit/stock-decrement turant yahan bhi reflect hoga.
  const myProducts = useMemo(
    () => allProducts.filter((p) => p.sellerEmail === user?.email),
    [allProducts, user?.email]
  );

  const mySales = useMemo(
    () => getSalesForSeller(user?.email, allOrders),
    [allOrders, user?.email]
  );

  const handleDelete = (id) => {
    deleteSellerProduct(id);
    dispatch(removeLocalProduct(id));
    toast.success("Product removed");
  };

  const totalStock = myProducts.reduce((a, p) => a + (p.stock || 0), 0);
  const totalRevenue = mySales.reduce((a, s) => a + s.lineTotal, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-[28px] flex items-center gap-3" style={{ color: "var(--white)" }}>
            <FaStore style={{ color: "var(--gold)" }} /> Seller Dashboard
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--white)" }}>
            Welcome back, {user?.name || "Seller"}
          </p>
        </div>
        <Link
          to="/seller/add-product"
          className="inline-flex items-center gap-2 px-5 h-[46px] rounded-full font-semibold text-[13px] transition hover:opacity-90"
          style={{ background: "var(--gold)", color: "var(--ink)" }}
        >
          <FaPlus className="text-[12px]" /> Add Product
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-8 rounded-full p-1 w-fit" style={{ background: "rgba(255,255,255,0.06)" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 h-10 rounded-full text-[13px] font-semibold transition"
            style={{
              background: tab === t ? "var(--gold)" : "transparent",
              color: tab === t ? "var(--ink)" : "var(--white)",
            }}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        {[
          { label: "My Products", value: myProducts.length },
          { label: "Total Stock",  value: totalStock },
          {
            label: tab === "My Sales" ? "Total Revenue" : "Avg. Price",
            value: tab === "My Sales"
              ? `$${totalRevenue.toFixed(2)}`
              : (myProducts.length ? `$${(myProducts.reduce((a, p) => a + p.price, 0) / myProducts.length).toFixed(2)}` : "$0"),
          },
        ].map((s) => (
          <div key={s.label} className="p-6 rounded-2xl" style={{ background: "white", border: "1px solid var(--border)" }}>
            <p className="text-[12px] uppercase tracking-wide" style={{ color: "var(--muted)" }}>{s.label}</p>
            <p className="text-[26px] font-bold mt-1" style={{ color: "var(--ink)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {tab === "My Products" && (
        <>
          <h2 className="font-semibold text-[16px] mb-4" style={{ color: "var(--white)" }}>My Products</h2>

          {myProducts.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: "white", border: "1px solid var(--border)" }}>
              <FaBoxOpen className="mx-auto text-[32px] mb-3" style={{ color: "var(--muted)" }} />
              <p className="text-[14px]" style={{ color: "var(--muted)" }}>You haven't added any products yet.</p>
              <Link to="/seller/add-product" className="inline-block mt-4 text-[13px] font-semibold" style={{ color: "var(--gold)" }}>
                Add your first product →
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--border)" }}>
              {myProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-4 px-5 py-4"
                  style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>
                  <img src={p.thumbnail} alt={p.title} className="w-14 h-14 rounded-lg object-contain bg-[var(--cream)] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[14px] truncate" style={{ color: "var(--ink)" }}>{p.title}</p>
                    <p className="text-[12px] capitalize" style={{ color: "var(--muted)" }}>
                      {p.category} · {p.stock === 0 ? (
                        <span style={{ color: "var(--red)" }}>Out of stock</span>
                      ) : (
                        `${p.stock} in stock`
                      )}
                    </p>
                  </div>
                  <p className="font-semibold text-[14px] flex-shrink-0" style={{ color: "var(--ink)" }}>${p.price}</p>
                  <Link to={`/seller/edit-product/${p.id}`} aria-label="Edit"
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[var(--cream)] transition">
                    <FaPen className="text-[12px]" style={{ color: "var(--gold)" }} />
                  </Link>
                  <button onClick={() => handleDelete(p.id)} aria-label="Delete"
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-red-50 transition">
                    <FaTrash className="text-[12px]" style={{ color: "var(--red)" }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "My Sales" && (
        <>
          <h2 className="font-semibold text-[16px] mb-4" style={{ color: "var(--white)" }}>My Sales</h2>

          {mySales.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: "white", border: "1px solid var(--border)" }}>
              <FaReceipt className="mx-auto text-[32px] mb-3" style={{ color: "var(--muted)" }} />
              <p className="text-[14px]" style={{ color: "var(--muted)" }}>No sales yet. Once someone buys your product, it'll show up here.</p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--border)" }}>
              {mySales.map((s, i) => (
                <div key={`${s.orderId}-${s.productId}-${i}`} className="flex items-center gap-4 px-5 py-4"
                  style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>
                  <img src={s.thumbnail} alt={s.title} className="w-14 h-14 rounded-lg object-contain bg-[var(--cream)] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[14px] truncate" style={{ color: "var(--ink)" }}>{s.title}</p>
                    <p className="text-[12px]" style={{ color: "var(--muted)" }}>
                      Order #{s.orderId} · {s.orderDate} · Buyer: {s.buyerName}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
                    {s.status}
                  </span>
                  <p className="text-[12px] flex-shrink-0" style={{ color: "var(--muted)" }}>Qty: {s.quantity}</p>
                  <p className="font-semibold text-[14px] flex-shrink-0 w-16 text-right" style={{ color: "var(--ink)" }}>
                    ${s.lineTotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SellerDashboard;

// src/pages/admin/AdminDashboard.jsx
// ──────────────────────────────────────────────────────────────────
// Admin panel — saare products (dummy API + seller-added) dekhne aur
// seller products delete karne ki power. Sellers list bhi dikhti hai.
// ──────────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaBoxes, FaStore, FaTrash, FaCrown, FaTags } from "react-icons/fa";
import { toast } from "react-toastify";
import { getProducts, removeLocalProduct } from "../../features/products/productSlice";
import { getAllSellers, deleteSellerProduct, SELLER_ID_BASE } from "../../utils/sellerStore";

const TABS = ["Overview", "Products", "Sellers"];

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="p-6 rounded-2xl flex items-center gap-4" style={{ background: "white", border: "1px solid var(--border)" }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--cream)" }}>
        <Icon style={{ color: "var(--gold)" }} />
      </div>
      <div>
        <p className="text-[12px] uppercase tracking-wide" style={{ color: "var(--muted)" }}>{label}</p>
        <p className="text-[24px] font-bold" style={{ color: "var(--ink)" }}>{value}</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((s) => s.products);
  const [tab, setTab] = useState("Overview");
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    dispatch(getProducts());
    setSellers(getAllSellers());
  }, [dispatch]);

  const sellerProducts = useMemo(() => products.filter((p) => p.id >= SELLER_ID_BASE), [products]);
  const apiProducts     = useMemo(() => products.filter((p) => p.id < SELLER_ID_BASE), [products]);

  const handleDelete = (id) => {
    deleteSellerProduct(id);
    dispatch(removeLocalProduct(id));
    toast.success("Product removed");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-[28px] flex items-center gap-3" style={{ color: "var(--white)" }}>
          <FaCrown style={{ color: "var(--gold)" }} /> Admin Dashboard
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--white)" }}>Manage products and sellers across SanVora</p>
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

      {tab === "Overview" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Products" value={loading ? "…" : products.length} icon={FaBoxes} />
          <StatCard label="Seller Products" value={loading ? "…" : sellerProducts.length} icon={FaTags} />
          <StatCard label="Catalog (API)" value={loading ? "…" : apiProducts.length} icon={FaBoxes} />
          <StatCard label="Registered Sellers" value={sellers.length} icon={FaStore} />
        </div>
      )}

      {tab === "Products" && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--border)" }}>
          {loading ? (
            <p className="text-center py-16 text-[13px]" style={{ color: "var(--muted)" }}>Loading products…</p>
          ) : (
            products.map((p, i) => {
              const isSeller = p.id >= SELLER_ID_BASE;
              return (
                <div key={p.id} className="flex items-center gap-4 px-5 py-4"
                  style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>
                  <img src={p.thumbnail} alt={p.title} className="w-12 h-12 rounded-lg object-contain bg-[var(--cream)] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[14px] truncate" style={{ color: "var(--ink)" }}>{p.title}</p>
                    <p className="text-[12px]" style={{ color: "var(--muted)" }}>
                      {isSeller ? `Seller: ${p.sellerName || p.sellerEmail}` : "Catalog product"}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background: isSeller ? "var(--cream)" : "rgba(0,0,0,0.05)", color: isSeller ? "var(--gold)" : "var(--muted)" }}>
                    {isSeller ? "Seller" : "Catalog"}
                  </span>
                  <p className="font-semibold text-[14px] flex-shrink-0 w-16 text-right" style={{ color: "var(--ink)" }}>${p.price}</p>
                  {isSeller ? (
                    <button onClick={() => handleDelete(p.id)} aria-label="Delete"
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-red-50 transition">
                      <FaTrash className="text-[12px]" style={{ color: "var(--red)" }} />
                    </button>
                  ) : (
                    <div className="w-9 h-9 flex-shrink-0" /> /* catalog products aren't deletable — they come from the dummy API */
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "Sellers" && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--border)" }}>
          {sellers.length === 0 ? (
            <p className="text-center py-16 text-[13px]" style={{ color: "var(--muted)" }}>No sellers registered yet.</p>
          ) : (
            sellers.map((s, i) => {
              const count = products.filter((p) => p.sellerEmail === s.email).length;
              return (
                <div key={s.email} className="flex items-center gap-4 px-5 py-4"
                  style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] flex-shrink-0"
                    style={{ background: "var(--gold)", color: "var(--ink)" }}>
                    {(s.name || s.email)[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[14px] truncate" style={{ color: "var(--ink)" }}>{s.name || "Unnamed Seller"}</p>
                    <p className="text-[12px] truncate" style={{ color: "var(--muted)" }}>{s.email}</p>
                  </div>
                  <p className="text-[13px] flex-shrink-0" style={{ color: "var(--muted)" }}>{count} products</p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaCheckCircle, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { getSellerProductById, updateSellerProduct } from "../../utils/sellerStore";
import { updateLocalProduct } from "../../features/products/productSlice";

const CATEGORIES = [
  "beauty", "fragrances", "furniture", "groceries", "home-decoration",
  "kitchen-accessories", "laptops", "mens-shirts", "mens-shoes", "mens-watches",
  "mobile-accessories", "skin-care", "smartphones", "sports-accessories",
  "tablets", "tops", "womens-bags", "womens-dresses", "womens-jewellery",
  "womens-shoes", "womens-watches",
];

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold mb-2" style={{ color: "var(--ink)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  background: "var(--cream)",
  border: "1px solid var(--border)",
  color: "var(--ink)",
};

function EditProduct() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const user = useSelector((s) => s.auth.user);

  // Product sirf mount pe (ya jab id badle) ek baar dhoonda jaata hai —
  // koi effect nahi chahiye, seedha render ke dauraan compute ho jaata hai.
  const product = useMemo(() => getSellerProductById(id), [id]);
  const notFound = !product || (user?.role !== "admin" && product.sellerEmail !== user?.email);

  const [form, setForm] = useState(() =>
    product
      ? {
          title: product.title || "",
          brand: product.brand || "",
          category: product.category || CATEGORIES[0],
          description: product.description || "",
          price: product.price ?? "",
          discountPercentage: product.discountPercentage ?? "",
          stock: product.stock ?? "",
          thumbnail: product.thumbnail || "",
          images: (product.images || []).join(", "),
        }
      : null
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim() || !form.thumbnail.trim()) {
      setError("Title, description aur image URL zaroori hain.");
      return;
    }
    const price = parseFloat(form.price);
    const stock = parseInt(form.stock, 10);
    if (!price || price <= 0) {
      setError("Valid price daalo.");
      return;
    }
    if (Number.isNaN(stock) || stock < 0) {
      setError("Valid stock quantity daalo.");
      return;
    }

    setSubmitting(true);

    const imagesArr = form.images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const patch = {
      title: form.title.trim(),
      brand: form.brand.trim() || undefined,
      category: form.category,
      description: form.description.trim(),
      price,
      discountPercentage: parseFloat(form.discountPercentage) || 0,
      stock,
      thumbnail: form.thumbnail.trim(),
      images: imagesArr.length ? imagesArr : [form.thumbnail.trim()],
    };

    const updated = updateSellerProduct(Number(id), patch);
    if (updated) {
      dispatch(updateLocalProduct({ id: Number(id), patch }));
      setSubmitting(false);
      setSuccess(true);
    } else {
      setSubmitting(false);
      toast.error("Product update nahi ho paya. Try again.");
    }
  };

  if (notFound || !form) {
    return (
      <div className="max-w-[720px] mx-auto text-center py-24">
        <h1 className="font-display font-bold text-[24px] mb-3" style={{ color: "var(--white)" }}>
          Product nahi mila
        </h1>
        <p className="text-[13px] mb-6" style={{ color: "var(--white)" }}>
          Ya to ye product exist nahi karta, ya ye aapka nahi hai.
        </p>
        <Link to="/seller/dashboard" className="inline-flex items-center gap-2 text-[13px] font-semibold"
          style={{ color: "var(--gold)" }}>
          <FaArrowLeft className="text-[11px]" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto">
      <Link
        to="/seller/dashboard"
        className="inline-flex items-center gap-2 text-[13px] font-medium mb-6 hover:opacity-60 transition"
        style={{ color: "var(--white)" }}
      >
        <FaArrowLeft className="text-[11px]" /> Back to Dashboard
      </Link>

      <h1 className="font-display font-bold text-[28px] mb-2" style={{ color: "var(--white)" }}>
        Edit Product
      </h1>
      <p className="text-[13px] mb-8" style={{ color: "var(--white)" }}>
        Update the details below. Changes go live as soon as you save.
      </p>

      <div className="p-8 rounded-3xl shadow-xl" style={{ background: "white", border: "1px solid var(--border)" }}>
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <FaCheckCircle className="mx-auto mb-4 text-[40px]" style={{ color: "var(--gold)" }} />
              <h3 className="font-semibold text-[16px] mb-2" style={{ color: "var(--ink)" }}>
                Product updated!
              </h3>
              <p className="text-[13px] mb-6" style={{ color: "var(--muted)" }}>
                Your changes are now live on the Products page.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  to="/seller/dashboard"
                  className="px-5 h-11 flex items-center rounded-full text-[13px] font-semibold text-white"
                  style={{ background: "var(--ink)" }}
                >
                  Back to Dashboard
                </Link>
                <Link
                  to="/products"
                  className="px-5 h-11 flex items-center rounded-full text-[13px] font-semibold"
                  style={{ background: "var(--cream)", color: "var(--ink)", border: "1px solid var(--border)" }}
                >
                  View on Products Page
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-5">
              <Field label="Product Title *">
                <input type="text" value={form.title} onChange={update("title")} placeholder="e.g. Classic Leather Tote"
                  className="w-full h-[48px] px-4 rounded-xl text-[14px]" style={inputStyle} />
              </Field>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Brand">
                  <input type="text" value={form.brand} onChange={update("brand")} placeholder="e.g. SanVora Studio"
                    className="w-full h-[48px] px-4 rounded-xl text-[14px]" style={inputStyle} />
                </Field>
                <Field label="Category *">
                  <select value={form.category} onChange={update("category")}
                    className="w-full h-[48px] px-4 rounded-xl text-[14px] capitalize" style={inputStyle}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/-/g, " ")}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Description *">
                <textarea value={form.description} onChange={update("description")} rows={4}
                  placeholder="Describe the product…"
                  className="w-full px-4 py-3 rounded-xl text-[14px] resize-none" style={inputStyle} />
              </Field>

              <div className="grid sm:grid-cols-3 gap-5">
                <Field label="Price (USD) *">
                  <input type="number" min="0" step="0.01" value={form.price} onChange={update("price")} placeholder="49.99"
                    className="w-full h-[48px] px-4 rounded-xl text-[14px]" style={inputStyle} />
                </Field>
                <Field label="Discount %">
                  <input type="number" min="0" max="90" value={form.discountPercentage} onChange={update("discountPercentage")} placeholder="0"
                    className="w-full h-[48px] px-4 rounded-xl text-[14px]" style={inputStyle} />
                </Field>
                <Field label="Stock Qty *">
                  <input type="number" min="0" value={form.stock} onChange={update("stock")} placeholder="25"
                    className="w-full h-[48px] px-4 rounded-xl text-[14px]" style={inputStyle} />
                </Field>
              </div>

              <Field label="Main Image URL *">
                <input type="url" value={form.thumbnail} onChange={update("thumbnail")} placeholder="https://…"
                  className="w-full h-[48px] px-4 rounded-xl text-[14px]" style={inputStyle} />
              </Field>

              <Field label="Additional Image URLs (comma-separated, optional)">
                <input type="text" value={form.images} onChange={update("images")} placeholder="https://…, https://…"
                  className="w-full h-[48px] px-4 rounded-xl text-[14px]" style={inputStyle} />
              </Field>

              {form.thumbnail && (
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--cream)" }}>
                  <img src={form.thumbnail} alt="preview" className="w-14 h-14 object-contain rounded-lg bg-white" />
                  <span className="text-[12px]" style={{ color: "var(--muted)" }}>Image preview</span>
                </div>
              )}

              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[13px] px-4 py-3 rounded-xl" style={{ background: "#FFF0F0", color: "var(--red)" }}>
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button type="submit" disabled={submitting}
                className="w-full h-[52px] rounded-full font-semibold text-[14px] flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--ink)", color: "white" }}>
                <FaSave className="text-[13px]" />
                {submitting ? "Saving…" : "Save Changes"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default EditProduct;

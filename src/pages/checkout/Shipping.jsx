import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../../features/order/orderSlice";
import { FaMapMarkerAlt, FaArrowRight, FaLock } from "react-icons/fa";

const STEPS = ["Shipping", "Payment", "Confirm"];

function Shipping() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingAddress } = useSelector((state) => state.order);

  const [formData, setFormData] = useState({
    fullName: shippingAddress.fullName || "",
    address: shippingAddress.address || "",
    city: shippingAddress.city || "",
    postalCode: shippingAddress.postalCode || "",
    country: shippingAddress.country || "",
    phone: shippingAddress.phone || "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress(formData));
    navigate("/payment");
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
                  background: i === 0 ? "var(--ink)" : "var(--border)",
                  color: i === 0 ? "white" : "var(--muted)",
                }}>
                {i + 1}
              </div>
              <span className="text-[10px] sm:text-[11px] mt-1.5 font-medium whitespace-nowrap" style={{ color: i === 0 ? "var(--ink)" : "var(--muted)" }}>{step}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-8 sm:w-20 h-[2px] mb-4" style={{ background: "var(--border)" }} />
            )}
          </div>
        ))}
      </div>

      <div className="p-5 sm:p-8 rounded-3xl" style={{ background: "white", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(201,168,76,0.1)" }}>
            <FaMapMarkerAlt style={{ color: "var(--gold)" }} />
          </div>
          <div>
            <h1 className="font-semibold text-[18px]" style={{ color: "var(--ink)" }}>Shipping Address</h1>
            <p className="text-[13px]" style={{ color: "var(--muted)" }}>Where should we deliver?</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink)" }}>Full Name</label>
              <input name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} required
                className="w-full h-[48px] px-4 rounded-xl text-[14px]"
                style={{ background: "var(--cream)", border: "1px solid var(--border)", color: "var(--ink)" }} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink)" }}>Street Address</label>
              <input name="address" placeholder="123 Main Street, Apt 4B" value={formData.address} onChange={handleChange} required
                className="w-full h-[48px] px-4 rounded-xl text-[14px]"
                style={{ background: "var(--cream)", border: "1px solid var(--border)", color: "var(--ink)" }} />
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink)" }}>City</label>
              <input name="city" placeholder="New York" value={formData.city} onChange={handleChange} required
                className="w-full h-[48px] px-4 rounded-xl text-[14px]"
                style={{ background: "var(--cream)", border: "1px solid var(--border)", color: "var(--ink)" }} />
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink)" }}>Postal Code</label>
              <input name="postalCode" placeholder="10001" value={formData.postalCode} onChange={handleChange} required
                className="w-full h-[48px] px-4 rounded-xl text-[14px]"
                style={{ background: "var(--cream)", border: "1px solid var(--border)", color: "var(--ink)" }} />
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink)" }}>Country</label>
              <input name="country" placeholder="United States" value={formData.country} onChange={handleChange} required
                className="w-full h-[48px] px-4 rounded-xl text-[14px]"
                style={{ background: "var(--cream)", border: "1px solid var(--border)", color: "var(--ink)" }} />
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink)" }}>Phone</label>
              <input name="phone" placeholder="+1 555 0000" value={formData.phone} onChange={handleChange}
                className="w-full h-[48px] px-4 rounded-xl text-[14px]"
                style={{ background: "var(--cream)", border: "1px solid var(--border)", color: "var(--ink)" }} />
            </div>
          </div>

          <button type="submit"
            className="w-full h-[52px] rounded-full font-semibold text-[14px] flex items-center justify-center gap-3 mt-4 transition hover:opacity-90"
            style={{ background: "var(--ink)", color: "white" }}>
            Continue to Payment <FaArrowRight className="text-[12px]" />
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-5">
          <FaLock className="text-[11px]" style={{ color: "var(--muted)" }} />
          <span className="text-[12px]" style={{ color: "var(--muted)" }}>Your information is protected</span>
        </div>
      </div>
    </div>
  );
}

export default Shipping;

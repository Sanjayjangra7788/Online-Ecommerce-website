
export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-black mb-10">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6">
        {["Revenue", "Orders", "Users", "Products"].map((item, i) => (
          <div key={i} className="glass p-8 rounded-3xl">
            <h2 className="text-slate-400">{item}</h2>
            <p className="text-4xl font-black mt-4">1,245</p>
          </div>
        ))}
      </div>
    </div>
  );
}

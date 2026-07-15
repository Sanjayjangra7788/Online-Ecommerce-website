
export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse grid md:grid-cols-3 gap-6">
      {[1,2,3].map((item)=>(
        <div key={item} className="bg-slate-800 h-80 rounded-3xl"></div>
      ))}
    </div>
  );
}

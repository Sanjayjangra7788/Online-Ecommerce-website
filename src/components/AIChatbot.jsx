
import { MessageCircle } from "lucide-react";

export default function AIChatbot() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button className="gradient-bg p-5 rounded-full shadow-2xl animate-bounce">
        <MessageCircle />
      </button>
    </div>
  );
}

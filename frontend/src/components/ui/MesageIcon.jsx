import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function MessagesIcon() {
    return (
        <div className="fixed bottom-10 right-8 z-50">
        <Link 
          to="/messages" 
          className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-xl border border-gray-100 hover:scale-105 transition-all text-[#1a1a3c] font-semibold text-sm cursor-pointer"
        >
          <MessageSquare size={18} className="text-gray-500" /> Messages
        </Link>
      </div>
    );
}
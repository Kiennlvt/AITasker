// src/components/ui/SearchBar.jsx
import { Search } from "lucide-react"; 

export default function SearchBar({ placeholder = "Search tasks or experts...", ...props }) {
  return (
    // Thêm h-fit (height fit-content) để khung không bị méo
    <div className="relative w-full max-w-[380px] flex items-center h-fit">
      
      {/* Thêm z-10 để ép icon luôn luôn nổi lên trên cùng, không bị ô input đè mất */}
      <Search 
        size={18} 
        className="absolute left-4 text-gray-400 pointer-events-none z-10" 
      />
      
      {/* Giữ nguyên input với pl-11 để chừa chỗ cho icon */}
      <input
        type="text"
        placeholder={placeholder}
        {...props}
        className="w-full pl-11 pr-5 py-2.5 rounded-full bg-gray-50 border border-gray-100 text-sm outline-none focus:border-orange-400 focus:bg-white transition-all text-[#1a1a3c]"
      />
    </div>
  );
}
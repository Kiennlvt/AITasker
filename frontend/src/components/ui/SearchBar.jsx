import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      const trimmed = inputValue.trim();
      
      if (trimmed) {
        newParams.set("search", trimmed);
      } else {
        newParams.delete("search");
      }
      
      setSearchParams(newParams);
    }, 400);

    return () => clearTimeout(handler);
  }, [inputValue, setSearchParams]);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (currentSearch !== inputValue) {
      setInputValue(currentSearch);
    }
  }, [searchParams]);

  return (
    <div className="flex w-[350px] md:w-[400px] items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 transition-all focus-within:border-orange-400 focus-within:bg-white focus-within:shadow-sm">
      <Search className="text-gray-400 flex-shrink-0" size={18} />
      <input
        type="text"
        placeholder="Search by title or categories . . ."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        /* 🌟 ĐÃ KHỬ VIỀN VUÔNG: outline-none border-none p-0 focus:ring-0 triệt tiêu hoàn toàn khung vuông thô mặc định */
        className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none border-none p-0 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
      />
    </div>
  );
}
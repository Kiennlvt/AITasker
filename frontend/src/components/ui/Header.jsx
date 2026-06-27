import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, User, LogOut, ChevronDown, Plus } from "lucide-react";
import useAuthStore from "../../store/authStore";
import SearchBar from "./SearchBar"; // 🌟 Nhớ import SearchBar xịn vào đây

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profilePath = user?.role === "CLIENT" ? "/client-profile" : "/expert-profile";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-[90px] bg-white border-b border-gray-200 px-10 flex items-center justify-between sticky top-0 z-50">
      {/* SEARCH */}
      <div className="flex items-center">
        {/* 🌟 THAY THẾ {children} THÀNH SearchBar XỊN CỐ ĐỊNH Ở ĐÂY */}
        <SearchBar /> 
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        {user?.role === "CLIENT" && (
          <button
            onClick={() => navigate("/post-job/step-1")}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors"
          >
            <Plus size={16} />
            Post Job
          </button>
        )}
        {user?.role === "EXPERT" && (
          <button
            onClick={() => navigate("/post-service")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors"
          >
            <Plus size={16} />
            Post Service
          </button>
        )}
        <button className="text-[#1a1a3c] hover:opacity-80 transition-opacity">
          <Bell size={22} />
        </button>

        <button className="text-[#1a1a3c] hover:opacity-80 transition-opacity">
          <Settings size={22} />
        </button>

        <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>

        {/* AVATAR */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-2xl transition-all outline-none"
          >
            <div className="text-right hidden sm:block">
              <h4 className="font-bold text-sm text-[#15153d]">{user?.fullName || "User"}</h4>
              <span className="text-xs text-gray-400 font-medium">{user?.role === "CLIENT" ? "Enterprise Client" : "Expert"}</span>
</div>
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-10 h-10 rounded-xl object-cover border border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center border border-gray-200">
                <User size={20} className="text-gray-500" />
              </div>
            )}
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn min-w-[200px]">
              <div className="px-4 py-2 border-b border-gray-50 sm:hidden">
                <p className="font-bold text-sm text-[#15153d]">{user?.fullName || "User"}</p>
                <p className="text-xs text-gray-400">{user?.role === "CLIENT" ? "Enterprise Client" : "Expert"}</p>
              </div>

              <button
                onClick={() => { navigate(profilePath); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#15153d] transition-all text-left"
              >
                <User size={18} className="text-gray-400" />
                View Profile
              </button>

              <div className="h-[1px] bg-gray-100 my-1"></div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all text-left"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
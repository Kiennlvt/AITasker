import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
// Gom hết icon về nhóm Md (Material Design) và Io5 để tránh hoàn toàn lỗi import nhầm hi/hi2 ban nãy
import { MdDashboard, MdManageAccounts, MdWork, MdLogout } from "react-icons/md";
import { IoStatsChart, IoSparkles } from "react-icons/io5";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

// Gọi logo trực tiếp từ public để mang sang máy nào trong nhóm cũng hiển thị chuẩn
const logoAdmin = "/logo-admin.png";

export default function AdminLayout() {
  // Đồng bộ hàm logout gốc clearAuth của nhóm ông
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Danh sách các trang con trong cụm Admin
  const menuItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: <MdDashboard className="text-xl" /> },
    { path: "/admin/users", name: "Manage Users", icon: <MdManageAccounts className="text-xl" /> },
    { path: "/admin/jobs", name: "Manage Jobs", icon: <MdWork className="text-xl" /> },
    { path: "/admin/statistics", name: "Statistics", icon: <IoStatsChart className="text-xl" /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar bên trái */}
      <aside className="w-64 border-r border-slate-200 bg-white px-4 py-6 flex flex-col justify-between">
        <div>
          {/* Cụm Logo & Tên thương hiệu */}
          <div className="mb-8 px-2 flex items-center gap-3">
            <img 
              src={logoAdmin} 
              alt="AI-Tasker" 
              className="h-9 w-9 object-contain rounded-full"
              onError={(e) => {
                // Nếu file ảnh bị lỗi đường dẫn ngầm, tự động chuyển sang icon lấp lánh màu cam dự phòng
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
              }}
            />
            <IoSparkles className="hidden text-[24px] text-[#f97316]" />
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-800 tracking-tight">AI-Tasker</span>
              <span className="text-[11px] font-bold text-[#f97316] tracking-wider uppercase">Enterprise Admin</span>
            </div>
          </div>

          {/* Menu điều hướng Link trang con */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white shadow-md shadow-orange-500/20"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Cụm nút Logout dưới đáy Sidebar - Đã chuẩn hóa cấu trúc JSX */}
        <div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 rounded-xl hover:bg-rose-50 transition-colors duration-200 w-full"
          >
            <MdLogout className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Vùng nội dung hiển thị các trang con bên phải */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Navbar Header */}
        <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between shadow-xs">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Admin Panel
          </div>
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500">System Normal</span>
          </div>
        </header>

        {/* Ruột thay đổi động khi click chuyển trang */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { MdDashboard, MdManageAccounts, MdWork, MdLogout } from "react-icons/md";
import { IoStatsChart, IoSparkles } from "react-icons/io5";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

const logoAdmin = "/logo-admin.png";

export default function AdminLayout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const menuItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: MdDashboard },
    { path: "/admin/users", name: "Manage Users", icon: MdManageAccounts },
    { path: "/admin/jobs", name: "Manage Jobs", icon: MdWork },
    { path: "/admin/statistics", name: "Statistics", icon: IoStatsChart },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar bên trái */}
      <aside className="w-64 border-r border-slate-100 bg-white px-4 py-6 flex flex-col justify-between select-none">
        <div>
          {/* Cụm Logo & Tên thương hiệu */}
          <div className="mb-8 px-2 flex items-center gap-3">
            <img 
              src={logoAdmin} 
              alt="AI-Tasker" 
              className="h-9 w-9 object-contain rounded-full"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
              }}
            />
            <IoSparkles className="hidden text-[24px] text-[#f97316]" />
            <div className="flex flex-col">
              <span className="text-lg font-black text-[#15153d] tracking-tight">AI-Tasker</span>
              <span className="text-[11px] font-bold text-[#f97316] tracking-wider uppercase">Enterprise Admin</span>
            </div>
          </div>

          {/* Menu điều hướng */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-150 group ${
                    isActive
                      ? "bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white shadow-md shadow-orange-500/20"
                      : "text-[#15153d]/80 hover:bg-gradient-to-r hover:from-[#f97316] hover:to-[#fb923c] hover:text-white hover:shadow-md hover:shadow-orange-500/20"
                  }`}
                >
                  <span className={`text-xl transition-colors ${
                    isActive ? "text-white" : "text-[#15153d]/60 group-hover:text-white"
                  }`}>
                    <IconComponent />
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Nút Logout dưới đáy */}
        <div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 rounded-xl hover:bg-rose-50 transition-colors duration-200 w-full cursor-pointer"
          >
            <MdLogout className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Vùng nội dung hiển thị các trang con bên phải */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Navbar Header */}
        <header className="h-16 border-b border-slate-100 bg-white px-8 flex items-center justify-between">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Admin Panel
          </div>
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500">System Normal</span>
          </div>
        </header>

        {/* Ruột thay đổi động khi click chuyển trang */}
        <div className="flex-1 p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
import { CircleHelp, LogOut } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo01.png";
import useAuthStore from "../../store/authStore";

const THEME_STYLES = {
  orange: {
    sidebarBg: "bg-[#eef1f7]",
    logoBg: "bg-orange-500",
    activeLink: "bg-orange-500 text-white shadow-md",
    hoverLink: "hover:text-white hover:bg-orange-500",
  },
  blue: {
    logoBg: "bg-blue-500",
    activeLink: "bg-orange-500 text-white shadow-md",
    hoverLink: "hover:text-white hover:bg-orange-500",
  },
};

export default function Sidebar({
  menuItems = [],
  theme = "orange",
  portalName = "Portal",
}) {
  const activeTheme = THEME_STYLES[theme] || THEME_STYLES.orange;
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`w-[250px] border-r border-gray-200 flex flex-col justify-between h-screen sticky top-0 transition-colors duration-300`}>
      <div>
        {/* LOGO */}
        <div className="px-6 py-8 flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-12 w-auto rounded-full" />
          <div>
            <h1 className="font-bold text-[20px] text-[#1a1a3c]">
              {portalName}
            </h1>
          </div>
        </div>

        {/* MENU ROWS */}
        <div className="px-4 mt-6 space-y-2">
          {menuItems.map((item) => {
            // 1. Mặc định kiểm tra xem URL hiện tại có khớp chính xác với item.path không
            let isItemActive = location.pathname === item.path;

            // 2. Nếu trong mảng cấu hình có định nghĩa `subPaths`, ta kiểm tra thêm đường dẫn con
            if (item.subPaths && Array.isArray(item.subPaths)) {
              isItemActive =
                isItemActive ||
                item.subPaths.some((subPath) =>
                  location.pathname.startsWith(subPath),
                );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-medium transition-all ${isItemActive
                    ? activeTheme.activeLink
                    : `text-[#2f2f4f] ${activeTheme.hoverLink}`
                  }`}
              >
                {item.icon}
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="px-4 pb-6 space-y-2">
        <button
          className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-[#2f2f4f] transition-all ${activeTheme.hoverLink}`}
        >
          <CircleHelp size={20} /> Support
        </button>

        
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-[#2f2f4f] transition-all ${activeTheme.hoverLink}`}
          >
            <LogOut size={20} /> Sign Out
          </button>
        

      </div>
    </aside>
  );
}

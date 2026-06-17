import {
  CircleHelp,
  LogOut,
  BriefcaseBusiness,
  Layers3,
  Star,
  UserCircle2,
  ShoppingBag,
} from "lucide-react";
import { NavLink, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo01.png";
import useAuthStore from "../../store/authStore";

const THEME_STYLES = {
  orange: {
    activeLink: "bg-orange-500 text-white shadow-md",
    hoverLink: "hover:bg-orange-500 hover:text-white",
  },
};

const DEFAULT_MENU_ITEMS = [
  { name: "Marketplace", icon: <Layers3 size={20} />, path: "/marketplace" },
  { name: "Services",     icon: <ShoppingBag size={20} />, path: "/services" },
  { name: "Dashboard",   icon: <BriefcaseBusiness size={20} />, path: "/dashboard" },
];

const CATEGORIES = [
  "NLP & LLMs",
  "Computer Vision",
  "Data Engineering",
  "AI Chatbot",
  "Other",
];

const MAX_PRICE = 10000;

export default function SidebarMarketplace({
  theme = "orange",
  portalName = "AI Marketplace",
  menuItems,
}) {
  const activeTheme = THEME_STYLES[theme] || THEME_STYLES.orange;
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const items = menuItems || DEFAULT_MENU_ITEMS;

  const selectedCategories = searchParams.getAll("category");
  const maxPrice = Number(searchParams.get("maxPrice") || MAX_PRICE);
  
  // 🌟 ĐÃ ĐỔI: Đọc trường 'rating' từ URL thay vì 'minRating' cũ
  const ratingType = searchParams.get("rating") || "";
  const isServicesPage = pathname.startsWith("/services");

  function updateParams(updater) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("page");
      updater(next);
      return next;
    });
  }

  function toggleCategory(cat) {
    updateParams((p) => {
      const current = p.getAll("category");
      p.delete("category");
      if (current.includes(cat)) {
        current.filter((c) => c !== cat).forEach((c) => p.append("category", c));
      } else {
        // Sửa lỗi cú pháp nhỏ gộp mảng cũ
        [...current, cat].forEach((c) => p.append("category", c));
      }
    });
  }

  function handlePriceChange(e) {
    updateParams((p) => {
      const val = Number(e.target.value);
      if (val >= MAX_PRICE) p.delete("maxPrice");
      else p.set("maxPrice", val);
    });
  }

  // 🌟 ĐÃ ĐỔI: Hàm cập nhật đẩy đúng từ khóa 'rating' lên URL tương thích với Services.jsx
  function handleRatingChange(val) {
    updateParams((p) => {
      if (val) p.set("rating", val);
      else p.delete("rating");
    });
  }

  function handleSignOut() {
    logout();
    navigate("/login");
  }

  const priceLabel = maxPrice >= MAX_PRICE ? "$10k+" : `$${maxPrice.toLocaleString()}`;

  return (
    <aside className="w-[250px] border-r border-gray-200 bg-white flex flex-col h-screen sticky top-0 overflow-hidden">
      {/* TOP — scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* LOGO */}
        <div className="px-6 py-8 flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-12 w-auto rounded-full" />
          <div>
            <h1 className="font-bold text-[20px] text-[#1a1a3c]">{portalName}</h1>
            <p className="text-xs text-slate-400">Enterprise AI Solutions</p>
          </div>
        </div>

        {/* MENU */}
        <div className="px-4 space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-4 rounded-2xl font-medium transition-all ${
                  isActive
                    ? activeTheme.activeLink
                    : `text-[#2f2f4f] ${activeTheme.hoverLink}`
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* CATEGORIES */}
        <div className="px-6 mt-8">
          <h4 className="mb-4 text-xs font-black text-slate-800 uppercase tracking-wide">
            Categories
          </h4>
          <div className="space-y-3">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-3 text-sm text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-orange-500"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* PRICE RANGE */}
        <div className="px-6 mt-8">
          <h4 className="mb-4 text-xs font-black text-slate-800 uppercase tracking-wide">
            Price Range
          </h4>
          <input
            type="range"
            min={100}
            max={MAX_PRICE}
            step={100}
            value={maxPrice}
            onChange={handlePriceChange}
            className="w-full accent-orange-500"
          />
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>$100</span>
            <span className="font-semibold text-slate-600">{priceLabel}</span>
          </div>
        </div>

        {/* 🌟 RATING SECTION — ĐÃ LÀM MỚI THEO KHOẢNG ĐIỂM YÊU CẦU */}
        {isServicesPage && (
          <div className="px-6 mt-8 mb-4">
            <h4 className="mb-4 text-xs font-black text-slate-800 uppercase tracking-wide">
              Rating
            </h4>
            <div className="space-y-3">
              {[
                { label: "4.5 - 5.0", value: "4.5-5.0" },
                { label: "4.0",       value: "4.0"     },
              ].map(({ label, value }) => (
                <label key={value} className="flex items-center gap-3 text-sm text-slate-500 cursor-pointer">
                  <input
                    type="radio"
                    name="rating-filter"
                    className="accent-orange-500"
                    checked={ratingType === value}
                    onChange={() => handleRatingChange(value)}
                  />
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-orange-400 text-orange-400" />
                    {label}
                  </div>
                </label>
              ))}

              {/* Nút All Ratings để xoá bộ lọc số sao khi cần */}
              <label className="flex items-center gap-3 text-sm text-slate-500 cursor-pointer">
                <input
                  type="radio"
                  name="rating-filter"
                  className="accent-orange-500"
                  checked={ratingType === ""}
                  onChange={() => handleRatingChange("")}
                />
                <div className="text-slate-400 italic">All Ratings</div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM — cố định */}
      <div className="px-4 pb-6">
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
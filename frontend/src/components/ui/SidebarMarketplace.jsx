import {
  CircleHelp,
  LogOut,
  BriefcaseBusiness,
  Layers3,
  Star,
  UserCircle2,
  ShoppingBag,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo01.png";
import Button from "./Button";

const THEME_STYLES = {
  orange: {
    activeLink: "bg-orange-500 text-white shadow-md",
    hoverLink: "hover:bg-orange-500 hover:text-white",
  },
};

export default function SidebarMarketplace({
  theme = "orange",
  portalName = "AI Marketplace",
}) {
  const activeTheme = THEME_STYLES[theme] || THEME_STYLES.orange;

  const menuItems = [
    {
      name: "Marketplace",
      icon: <Layers3 size={20} />,
      path: "/marketplace",
    },
    {
      name: "Services",
      icon: <ShoppingBag size={20} />,
      path: "/services",
    },
    {
      name: "Dashboard",
      icon: <BriefcaseBusiness size={20} />,
      path: "/dashboard",
    },
  ];

  return (
    <aside className="w-[250px] border-r border-gray-200 bg-white flex flex-col justify-between h-screen sticky top-0">
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="px-6 py-8 flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-12 w-auto rounded-full" />

          <div>
            <h1 className="font-bold text-[20px] text-[#1a1a3c]">
              {portalName}
            </h1>

            <p className="text-xs text-slate-400">
              Enterprise AI Solutions
            </p>
          </div>
        </div>

        {/* MENU */}
        <div className="px-4 mt-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-4 rounded-2xl font-medium transition-all ${isActive
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
            {[
              "NLP & LLMs",
              "Computer Vision",
              "Data Engineering",
              "Reinforcement Learning",
            ].map((item) => (
              <label
                key={item}
                className="flex items-center gap-3 text-sm text-slate-500"
              >
                <input type="checkbox" className="accent-orange-500" />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* PRICE */}
        <div className="px-6 mt-8">
          <h4 className="mb-4 text-xs font-black text-slate-800 uppercase tracking-wide">
            Price Range
          </h4>

          <input type="range" className="w-full accent-orange-500" />

          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>$100</span>
            <span>$10k+</span>
          </div>
        </div>

        {/* RATING */}
        <div className="px-6 mt-8">
          <h4 className="mb-4 text-xs font-black text-slate-800 uppercase tracking-wide">
            Min. Rating
          </h4>

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-slate-500">
              <input
                type="radio"
                name="rating"
                className="accent-orange-500"
              />
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-orange-400 text-orange-400" />
                4.5 & up
              </div>
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-500">
              <input
                type="radio"
                name="rating"
                className="accent-orange-500"
              />
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-orange-400 text-orange-400" />
                4.0 & up
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="px-4 pb-6 space-y-2">

        <Link to="/login" className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-[#2f2f4f] transition-all ${activeTheme.hoverLink}`}>
          <LogOut size={20} /> Sign Out
        </Link>

      </div>
    </aside>
  );
}
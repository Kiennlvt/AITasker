import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, LogOut, ChevronDown, Plus, Bell, Settings, Circle, Check } from "lucide-react";
import useAuthStore from "../../store/authStore";
import SearchBar from "./SearchBar"; // 🌟 Nhớ import SearchBar xịn vào đây
import { getMyNotifications, getUnreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead } from "../../api/notifications";
import { timeAgo } from "../../utils/timeAgo";
import toast from "react-hot-toast";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const list = await getMyNotifications();
      const count = await getUnreadNotificationsCount();
      setNotifications(list);
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setIsNotifOpen(false);
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

  const handleNotifClick = async (notif) => {
    setIsNotifOpen(false);
    try {
      if (!notif.isRead) {
        await markNotificationAsRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Redirect based on type
      if (notif.type === "PROPOSAL") {
        if (user?.role === "CLIENT") {
          navigate("/manage-proposals");
        } else {
          navigate("/my-proposals");
        }
      } else if (notif.type === "MILESTONE" || notif.type === "PROJECT") {
        if (user?.role === "CLIENT") {
          navigate(`/projects/${notif.relatedId || ""}`);
        } else {
          navigate("/my-tasks");
        }
      } else if (notif.type === "MESSAGE") {
        navigate(`/messages?conversationId=${notif.relatedId || ""}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
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

        {/* NOTIFICATION BELL */}
        <div className="relative" ref={notifDropdownRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="text-[#1a1a3c] hover:opacity-80 transition-opacity relative p-2 rounded-full hover:bg-gray-50 outline-none"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 z-50 animate-fadeIn min-w-[320px]">
              <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span className="font-bold text-sm text-[#15153d]">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-xs font-semibold text-orange-500 hover:text-orange-600 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map(n => (
                    <button
                      key={n.id}
                      onClick={() => handleNotifClick(n)}
                      className={`w-full px-4 py-3 flex gap-3 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.isRead ? "bg-orange-50/20" : ""}`}
                    >
                      <div className="mt-1 shrink-0">
                        {!n.isRead ? (
                          <Circle size={10} className="fill-orange-500 text-orange-500" />
                        ) : (
                          <Check size={12} className="text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-bold text-[#15153d] ${!n.isRead ? "font-black text-orange-600" : ""}`}>{n.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-2">{n.content}</p>
                        <span className="text-[9px] text-gray-400 mt-1 block">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* SETTINGS BUTTON */}
        <button 
          onClick={() => navigate("/settings")}
          className="text-[#1a1a3c] hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-gray-50 outline-none"
        >
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
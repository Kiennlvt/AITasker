import {
  LayoutDashboard,
  Store,
  ClipboardList,
  MessageSquare,
  BriefcaseBusiness,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import Header from "../ui/Header";
import Sidebar from "../ui/Siderbar";
import SearchBar from "../ui/Searchbar";
export default function ExpertLayout() {
const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard-expert",
    },
    {
      name: "Marketplace",
      icon: <Store size={20} />,
      path: "/marketplace",
    },
    {
      name: "My Tasks",
      icon: <ClipboardList size={20} />,
      path: "/my-tasks",
    },
    {
      name: "Profile",
      icon: <BriefcaseBusiness size={20} />,
      path: "/expert-profile",
    },
    {
      name: "Messages",
      icon: <MessageSquare size={20} />,
      path: "/messages",
    },
  ];

  return (
    <div className="flex h-screen bg-[#f7f8fc]">
      {/* SIDEBAR */}
      <Sidebar
        menuItems={menuItems}
        theme="blue"
        portalName="Expert Portal"
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <Header />
        {/* BODY */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

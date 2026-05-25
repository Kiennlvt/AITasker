// Layout.jsx
import {
  LayoutDashboard,
  Store,
  ClipboardList,
  MessageSquare,
  BriefcaseBusiness,
  BadgeRussianRubleIcon,

} from "lucide-react";
import { Outlet, NavLink } from "react-router-dom";
import Header from "../ui/Header";
import Sidebar from "../ui/Siderbar";
import SearchBar from "../ui/Searchbar";

export default function PostJobLayout() {
   const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    {
      name: "Marketplace",
      icon: <Store size={20} />,
      path: "/marketplace",
    },
    {
      name: "Projects",
      icon: <ClipboardList size={20} />,
      path: "/projects",
    },
    {
      name: "Post Job",
      icon: <BriefcaseBusiness size={20} />,
      path: "/post-job/step-1",
      subPaths: ["/post-job"],
    },
        {
      name: "Manage Proposals",
      icon: <BadgeRussianRubleIcon size={20} />,
      path: "/manage-proposals",
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
        theme="orange"
        portalName="Enterprise Portal"
      />
      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <Header/>
    

        {/* BODY */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

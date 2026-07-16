import {
  LayoutDashboard,
  Store,
  ClipboardList,
  MessageSquare,
  BriefcaseBusiness,
  BadgeRussianRubleIcon,
  UserCircle,
  Bookmark,
  Wallet,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import Header from "../ui/Header";
import Sidebar from "../ui/Siderbar";
import SearchBar from "../ui/Searchbar";
export default function ClientLayout() {
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
    {
      name: "Saved Services",
      icon: <Bookmark size={20} />,
      path: "/saved-services",
    },
    {
      name: "Wallet",
      icon: <Wallet size={20} />,
      path: "/wallet",
    },
    {
      name: "Profile",
      icon: <UserCircle size={20} />,
      path: "/client-profile",
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <Header>
          <SearchBar placeholder="Search expert or project "/>
        </Header>
        {/* BODY */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
import React from "react";
import SidebarMarketplace from "../ui/SidebarMarketplace";
import Header from "../ui/Header";
import SearchBar from "../ui/Searchbar";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, Store, ShoppingBag } from "lucide-react";

export default function PublicLayout() {
  const menuItems = [
    {
      name: "Marketplace",
      icon: <Store size={20} />,
      path: "/marketplace",
    },
    {
      name: "Services",
      icon: <ShoppingBag size={20} />,
      path: "/services",
    },
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
  ];
  return (
    <div className="flex h-screen bg-[#f7f8fc]">
      {/* SIDEBAR */}
      <SidebarMarketplace
        menuItems={menuItems}
        theme="orange"
        portalName="Enterprise Portal"
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <Header>
          <SearchBar placeholder="Search for AI services..."/>
        </Header>
        {/* BODY */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

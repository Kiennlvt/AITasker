import React from "react";
import Button from "../ui/Button";
import SidebarMarketplace from "../ui/SidebarMarketplace";
import Header from "../ui/Header";
import SearchBar from "../ui/Searchbar";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, Store } from "lucide-react";

export default function PublicLayout() {
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

import React from "react";
import { Outlet } from "react-router-dom";
import { MdDashboard, MdManageAccounts, MdWork, MdCategory } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import Sidebar from "../ui/Siderbar";
import Header from "../ui/Header";

export default function AdminLayout() {
  const menuItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: <MdDashboard className="text-xl" /> },
    { path: "/admin/users", name: "Manage Users", icon: <MdManageAccounts className="text-xl" /> },
    { path: "/admin/jobs", name: "Manage Jobs", icon: <MdWork className="text-xl" /> },
    { path: "/admin/categories", name: "Categories", icon: <MdCategory className="text-xl" /> },
    { path: "/admin/statistics", name: "Statistics", icon: <IoStatsChart className="text-xl" /> },
  ];

  return (
    <div className="flex h-screen bg-[#f7f8fc]">
      <Sidebar
        menuItems={menuItems}
        theme="orange"
        portalName="Enterprise Portal"
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

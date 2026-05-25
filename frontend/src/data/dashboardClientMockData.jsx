// src/data/dashboardMockData.js
import { Briefcase, ClipboardCheck, DollarSign } from "lucide-react";

// 1. Data mẫu cho bảng danh sách dự án
export const jobStreamsData = [
  {
    name: "Neural Arch v2.4",
    desc: "Infrastructure Optimization",
    expert: "Jordan D.",
    avatarBg: "bg-orange-500",
    avatarText: "JD",
    status: "In Progress",
    budget: "$4,500",
  },
  {
    name: "Data Cleansing AI",
    desc: "Large Language Model Training",
    expert: "Maria S.",
    avatarBg: "bg-blue-500",
    avatarText: "MS",
    status: "Reviewing",
    budget: "$1,200",
  },
  {
    name: "Quantum Scripting",
    desc: "Advanced Logic Processing",
    expert: "Auto-Assigned",
    avatarBg: "bg-slate-300",
    avatarText: "AI",
    status: "Queueing",
    budget: "$8,900",
  },
];

// 2. Data mẫu cho danh sách chuyên gia
export const topExpertsData = [
  {
    name: "Sarah Connor",
    role: "Cloud Architect",
    rating: "4.9/5",
    tasks: "12 Tasks",
    img: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "David Chen",
    role: "ML Ops Lead",
    rating: "5.0/5",
    tasks: "8 Tasks",
    img: "https://i.pravatar.cc/150?img=11",
  },
  {
    name: "Elena Rodriguez",
    role: "Security Auditor",
    rating: "4.8/5",
    tasks: "24 Tasks",
    img: "https://i.pravatar.cc/150?img=47",
  },
];

// 3. Data mẫu cho các thẻ thống kê đầu trang
export const statsData = [
  {
    id: "stat-active-jobs",
    label: "Active Jobs",
    value: "12",
    icon: Briefcase,
    iconBgColor: "bg-orange-50",
    iconTextColor: "text-orange-600",
    subtext: (
      <div className="flex items-center gap-1 text-xs">
        <span className="text-orange-500 font-medium">↗ +2</span>
        <span className="text-gray-400">since last week</span>
      </div>
    ),
  },
  {
    id: "stat-pending-review",
    label: "Pending Review",
    value: "04",
    icon: ClipboardCheck,
    iconBgColor: "bg-gray-50",
    iconTextColor: "text-gray-600",
    subtext: <p className="text-xs text-gray-400">Requires your attention</p>,
  },
  {
    id: "stat-total-spend",
    label: "Total Spend",
    value: "$14,250",
    icon: DollarSign,
    iconBgColor: "bg-orange-50",
    iconTextColor: "text-orange-600",
    subtext: (
      <div className="flex items-center gap-1 text-xs">
        <span className="text-orange-500 font-medium">↗ 15.4%</span>
        <span className="text-gray-400">efficiency increase</span>
      </div>
    ),
  },
];
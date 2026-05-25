import {
  Briefcase,
  FileText,
  Wallet,
  TrendingUp,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  CheckCircle,
  Star,
  ClipboardCheck,
  DollarSign,
} from "lucide-react";

// 1. GIẢ LẬP DATA CHO BIỂU ĐỒ DOANH THU (EARNINGS OVERVIEW)
export const earningsData = [
  { name: "Jan", earnings: 1900 },
  { name: "Feb", earnings: 2100 },
  { name: "Mar", earnings: 1800 },
  { name: "Apr", earnings: 4800 }, // Điểm đỉnh giống trong ảnh
  { name: "May", earnings: 2200 },
  { name: "Jun", earnings: 2900 },
];

// 2. GIẢ LẬP DATA CHO DANH SÁCH PROPOSALS BÊN PHẢI
export const recentProposals = [
  {
    id: 1,
    title: "Neural Architecture Optimization",
    time: "Submitted 2 days ago",
    status: "ACCEPTED",
    statusColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    id: 2,
    title: "Data Pipeline Automation",
    time: "Submitted 4 days ago",
    status: "UNDER REVIEW",
    statusColor: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    id: 3,
    title: "Conversational Agent R&D",
    time: "Submitted 1 week ago",
    status: "UNDER REVIEW",
    statusColor: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    id: 4,
    title: "MLOps Pipeline Audit",
    time: "Submitted 2 weeks ago",
    status: "CLOSED",
    statusColor: "bg-rose-50 text-rose-600 border-rose-200",
  },
];

// 3. GIẢ LẬP DATA BẢNG ACTIVE PROJECTS PHÍA DƯỚI
export const activeProjects = [
  {
    id: 1,
    name: "LLM Fine-tuning for LegalTech",
    client: "Lexington Solutions",
    date: "Oct 24, 2023",
    progress: 75,
    barColor: "bg-orange-500",
  },
  {
    id: 2,
    name: "Recommendation Engine v2.1",
    client: "Global Retail Corp",
    date: "Oct 28, 2023",
    progress: 40,
    barColor: "bg-orange-500",
  },
  {
    id: 3,
    name: "Computer Vision Security Suite",
    client: "Infrascan Systems",
    date: "Nov 02, 2023",
    progress: 15,
    barColor: "bg-orange-500",
  },
  {
    id: 4,
    name: "Predictive Maintenance Model",
    client: "HeavyBuild Industries",
    date: "Nov 15, 2023",
    progress: 90,
    barColor: "bg-orange-500",
  },
];

export const statsData = [
    {
      id: "stat-1",
      label: "Total Earnings",
      value: "$12,450",
      icon: TrendingUp,
      iconBgColor: "bg-green-50",
      iconTextColor: "text-green-600",
      // Nhét hẳn JSX vào mảng để xử lý cái subtext phức tạp của Card 1
      subtext: (
        <div className="flex items-center gap-1">
          <span className="text-green-500 font-semibold">+3.5%</span>
          <span className="text-xs text-gray-400">from last month</span>
        </div>
      ),
    },
    {
      id: "stat-2",
      label: "Active Projects",
      value: "4",
      icon: Briefcase,
      iconBgColor: "bg-blue-50",
      iconTextColor: "text-blue-500",
      subtext: <p className="text-xs text-gray-400">Active now</p>,
    },
    {
      id: "stat-3",
      label: "Complete jobs",
      value: "32",
      icon: CheckCircle,
      iconBgColor: "bg-purple-50",
      iconTextColor: "text-purple-500",
      subtext: <p className="text-xs text-gray-400">Lifetime</p>,
    },
    {
      id: "stat-4",
      label: "Average Rating",
      value: "4.9/5.0",
      icon: Star,
      iconBgColor: "bg-amber-50",
      iconTextColor: "text-amber-500",
      subtext: <p className="text-xs text-gray-400">Excellent</p>,
    },
  ];

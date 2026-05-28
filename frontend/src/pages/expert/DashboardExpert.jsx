import { useEffect, useState } from "react";
import { TrendingUp, Briefcase, CheckCircle, Star } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import StatCard from "../../components/ui/StatCard";
import DataTable from "../../components/ui/DataTable";
import { expertTable } from "../../data/expertTable";
import { earningsData } from "../../data/dashboardExpertMockData";
import { getExpertDashboard } from "../../api/dashboard";
import { getMyProposals } from "../../api/proposals";
import useAuthStore from "../../store/authStore";

export default function DashboardExpert() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState({ activeProjects: 0, pendingProposals: 0, totalEarnings: 0 });
  const [proposals, setProposals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getExpertDashboard(), getMyProposals()])
      .then(([dash, props]) => {
        setStats({
          activeProjects: dash.activeProjects ?? 0,
          pendingProposals: dash.pendingProposals ?? 0,
          totalEarnings: dash.totalEarnings ?? 0,
        });
        setProposals(
          props.slice(0, 4).map((p) => ({
            id: p.id,
            title: p.jobTitle,
            time: `Submitted ${new Date(p.createdAt).toLocaleDateString()}`,
            status:
              p.status === "ACCEPTED"
                ? "ACCEPTED"
                : p.status === "REJECTED"
                ? "CLOSED"
                : "UNDER REVIEW",
            statusColor:
              p.status === "ACCEPTED"
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : p.status === "REJECTED"
                ? "bg-rose-50 text-rose-600 border-rose-200"
                : "bg-blue-50 text-blue-600 border-blue-200",
          }))
        );
        setProjects(
          (dash.recentProjects ?? []).map((p) => ({
            id: p.id,
            name: p.jobTitle,
            desc: `${p.progress}% complete`,
            client: p.clientName,
            avatarBg: "bg-orange-500",
            avatarText: p.clientName?.slice(0, 2).toUpperCase() || "??",
            status:
              p.status === "ACTIVE"
                ? "In Progress"
                : p.status === "COMPLETED"
                ? "Completed"
                : p.status,
            progress: p.progress,
          }))
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statsData = [
    {
      id: "stat-1",
      label: "Total Earnings",
      value: loading ? "..." : `$${Number(stats.totalEarnings).toLocaleString()}`,
      icon: TrendingUp,
      iconBgColor: "bg-green-50",
      iconTextColor: "text-green-600",
      subtext: <p className="text-xs text-gray-400">Lifetime</p>,
    },
    {
      id: "stat-2",
      label: "Active Projects",
      value: loading ? "..." : String(stats.activeProjects),
      icon: Briefcase,
      iconBgColor: "bg-blue-50",
      iconTextColor: "text-blue-500",
      subtext: <p className="text-xs text-gray-400">Active now</p>,
    },
    {
      id: "stat-3",
      label: "Pending Proposals",
      value: loading ? "..." : String(stats.pendingProposals),
      icon: CheckCircle,
      iconBgColor: "bg-purple-50",
      iconTextColor: "text-purple-500",
      subtext: <p className="text-xs text-gray-400">Awaiting response</p>,
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

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expert Dashboard</span>
          <h1 className="text-3xl font-bold text-[#15153d] mt-1">
            Welcome back, {user?.fullName?.split(" ")[0] ?? "Expert"}.
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's what's happening with your projects today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            iconTextColor={stat.iconTextColor}
            subtext={stat.subtext}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col justify-between min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-[#15153d]">Earnings Overview</h3>
            <select className="h-9 px-8 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-500 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="earnings" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[400px]">
          <div>
            <h3 className="font-bold text-lg text-[#15153d] mb-4">Recent Proposals</h3>
            <div className="space-y-4">
              {loading && <p className="text-sm text-gray-400">Loading...</p>}
              {!loading && proposals.length === 0 && (
                <p className="text-sm text-gray-400">No proposals yet.</p>
              )}
              {proposals.map((prop) => (
                <div
                  key={prop.id}
                  className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <h4 className="font-bold text-sm text-[#15153d] truncate">{prop.title}</h4>
                    <span className="text-xs text-gray-400 mt-0.5 block">{prop.time}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border tracking-wider shrink-0 ${prop.statusColor}`}>
                    {prop.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full h-12 border border-orange-200 hover:border-orange-500 text-orange-500 font-semibold text-sm rounded-xl mt-4 transition-all hover:bg-orange-50/30">
            View All Proposals
          </button>
        </div>
      </div>

      <div>
        <DataTable title="Your Active Job Streams" data={projects} columns={expertTable()} />
      </div>
    </div>
  );
}
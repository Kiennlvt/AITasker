import {
  Briefcase,
  ClipboardCheck,
  DollarSign,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MessagesIcon from "../../components/ui/MesageIcon";
import Button from "../../components/ui/Button";
import StatCard from "../../components/ui/StatCard";
import DataTable from "../../components/ui/DataTable";
import { clientTable } from "../../data/clientTable";
import { topExpertsData } from "../../data/dashboardClientMockData";
import { getClientDashboard, getMyProjects } from "../../api/dashboard";
import useAuthStore from "../../store/authStore";

export default function DashboardClient() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState({ activeJobs: 0, pendingReview: 0, totalSpend: 0 });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getClientDashboard(), getMyProjects()])
      .then(([dash, projs]) => {
        setStats({
          activeJobs: dash.activeJobs ?? 0,
          pendingReview: dash.pendingProposals ?? 0,
          totalSpend: dash.totalSpend ?? 0,
        });
        // Map API projects to table format
        setProjects(
          projs.map((p) => ({
            id: p.id,
            name: p.jobTitle,
            desc: `${p.progress}% complete`,
            expert: p.expertName,
            avatarBg: "bg-orange-500",
            avatarText: p.expertName?.slice(0, 2).toUpperCase() || "??",
            status: p.status === "ACTIVE" ? "In Progress" : p.status === "COMPLETED" ? "Completed" : p.status,
            budget: `$${p.totalBudget?.toLocaleString() ?? 0}`,
            progress: p.progress,
            client: user?.fullName,
          }))
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const statsData = [
    {
      id: "stat-active-jobs",
      label: "Active Jobs",
      value: loading ? "..." : String(stats.activeJobs),
      icon: Briefcase,
      iconBgColor: "bg-orange-50",
      iconTextColor: "text-orange-600",
      subtext: <p className="text-xs text-gray-400">Currently in progress</p>,
    },
    {
      id: "stat-pending-review",
      label: "Pending Review",
      value: loading ? "..." : String(stats.pendingReview),
      icon: ClipboardCheck,
      iconBgColor: "bg-gray-50",
      iconTextColor: "text-gray-600",
      subtext: <p className="text-xs text-gray-400">Requires your attention</p>,
    },
    {
      id: "stat-total-spend",
      label: "Total Spend",
      value: loading ? "..." : `$${Number(stats.totalSpend).toLocaleString()}`,
      icon: DollarSign,
      iconBgColor: "bg-orange-50",
      iconTextColor: "text-orange-600",
      subtext: <p className="text-xs text-gray-400">Total project budget</p>,
    },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a3c]">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-orange-500">{user?.fullName}</span>!
          </p>
        </div>
        <Link to="/post-job/step-1">
          <Button className="flex gap-2 px-6" variant="primary" leftIcon={<Sparkles size={16} />}>
            New Project
          </Button>
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((card) => (
          <StatCard
            key={card.id}
            label={card.label}
            value={card.value}
            icon={card.icon}
            iconBgColor={card.iconBgColor}
            iconTextColor={card.iconTextColor}
            subtext={card.subtext}
          />
        ))}
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects Table */}
        <div className="lg:col-span-2 space-y-8 bg-white rounded-2xl border border-gray-100 shadow-sm max-h-fit">
          <div className="overflow-x-auto">
            <DataTable
              title="Active Job Streams"
              data={projects}
              columns={clientTable()}
              extraHeader={
                <Link
                  to="/projects"
                  className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-orange-500 transition-colors"
                >
                  View All <ArrowRight size={16} />
                </Link>
              }
            />
          </div>
        </div>

        {/* Top Experts (still mock — no ratings API yet) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#1a1a3c] uppercase tracking-wider text-xs mb-6">
              Top Performing Experts
            </h3>
            <div className="space-y-6">
              {topExpertsData.map((expert, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={expert.img} alt={expert.name} className="w-11 h-11 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-[#1a1a3c] text-sm">{expert.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{expert.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-500 text-sm">★ {expert.rating}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{expert.tasks}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl mt-8 text-sm hover:bg-gray-50 transition-all shadow-sm">
            Browse Network
          </button>
        </div>
      </div>

      <MessagesIcon />
    </div>
  );
}

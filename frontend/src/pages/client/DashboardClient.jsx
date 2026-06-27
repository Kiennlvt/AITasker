import {
  Briefcase,
  ClipboardCheck,
  DollarSign,
  ArrowRight,
  FileEdit,
  Send,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MessagesIcon from "../../components/ui/MesageIcon";
import Button from "../../components/ui/Button";
import StatCard from "../../components/ui/StatCard";
import DataTable from "../../components/ui/DataTable";
import { clientTable } from "../../data/clientTable";
import { topExpertsData } from "../../data/dashboardClientMockData";
import { getClientDashboard, getMyProjects } from "../../api/dashboard";
import { getMyDrafts, publishDraft, deleteJob } from "../../api/jobs";
import useAuthStore from "../../store/authStore";
import usePostJobStore from "../../store/postJobStore";

export default function DashboardClient() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState({ activeJobs: 0, pendingReview: 0, totalSpend: 0 });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState([]);
  const [draftsLoading, setDraftsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

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

  useEffect(() => {
    getMyDrafts()
      .then(setDrafts)
      .catch(() => {})
      .finally(() => setDraftsLoading(false));
  }, []);

  const handlePublishDraft = async (id) => {
    setActionLoading(id + "-publish");
    try {
      await publishDraft(id);
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      toast.success("Job published successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to publish draft");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteDraft = async (id) => {
    setActionLoading(id + "-delete");
    try {
      await deleteJob(id);
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      toast.success("Draft deleted");
    } catch {
      toast.error("Failed to delete draft");
    } finally {
      setActionLoading(null);
    }
  };

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

      {/* DRAFTS SECTION */}
      {!draftsLoading && drafts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileEdit size={18} className="text-orange-500" />
              <h3 className="font-bold text-[#1a1a3c] uppercase tracking-wider text-xs">
                My Drafts ({drafts.length})
              </h3>
            </div>
          </div>
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <h4 className="font-semibold text-[#1a1a3c] text-sm truncate">{draft.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">
                      {draft.skills?.join(", ") || "No skills"}
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-400">
                      ${draft.budget?.toLocaleString() ?? 0}
                    </span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      Draft
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      usePostJobStore.getState().loadDraft(draft);
                      navigate("/post-job/step-3");
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <FileEdit size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => handlePublishDraft(draft.id)}
                    disabled={actionLoading === draft.id + "-publish"}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#15153d] hover:bg-[#1f1f5a] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Send size={12} />
                    {actionLoading === draft.id + "-publish" ? "Publishing..." : "Publish"}
                  </button>
                  <button
                    onClick={() => handleDeleteDraft(draft.id)}
                    disabled={actionLoading === draft.id + "-delete"}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    {actionLoading === draft.id + "-delete" ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

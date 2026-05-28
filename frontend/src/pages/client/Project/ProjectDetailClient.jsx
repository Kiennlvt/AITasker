import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Share2, CheckCircle2, Terminal, ArrowLeft } from "lucide-react";
import MessagesIcon from "../../../components/ui/MesageIcon";
import { getProjectById, getMilestones, approveMilestone, requestRevision } from "../../../api/projects";
import toast from "react-hot-toast";

function milestoneUi(status) {
  switch (status) {
    case "APPROVED":
      return "completed";
    case "SUBMITTED":
      return "active";
    case "REVISION_REQUESTED":
      return "active";
    default:
      return "pending";
  }
}

function projectStatusStyle(status) {
  switch (status) {
    case "ACTIVE":
      return { label: "In Progress", bg: "bg-blue-50 text-blue-600 border-blue-100", dot: "bg-blue-500" };
    case "COMPLETED":
      return { label: "Completed", bg: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500" };
    case "CANCELLED":
      return { label: "Cancelled", bg: "bg-gray-50 text-gray-500 border-gray-100", dot: "bg-gray-400" };
    default:
      return { label: status ?? "Unknown", bg: "bg-amber-50 text-amber-600 border-amber-100", dot: "bg-amber-400" };
  }
}

export default function ProjectDetailClient() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    Promise.all([getProjectById(id), getMilestones(id)])
      .then(([proj, miles]) => {
        setProject(proj);
        setMilestones(miles);
      })
      .catch(() => toast.error("Failed to load project"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApprove = async (milestoneId) => {
    setActionLoading(milestoneId + "-approve");
    try {
      await approveMilestone(milestoneId);
      setMilestones((prev) =>
        prev.map((m) => (m.id === milestoneId ? { ...m, status: "APPROVED" } : m))
      );
      toast.success("Milestone approved!");
    } catch {
      toast.error("Failed to approve milestone");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevision = async (milestoneId) => {
    setActionLoading(milestoneId + "-revision");
    try {
      await requestRevision(milestoneId);
      setMilestones((prev) =>
        prev.map((m) => (m.id === milestoneId ? { ...m, status: "REVISION_REQUESTED" } : m))
      );
      toast.success("Revision requested.");
    } catch {
      toast.error("Failed to request revision");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-700">Project Not Found</h2>
        <p className="text-gray-400 mt-2">
          The project ID <span className="text-red-500 font-mono">"{id}"</span> does not exist.
        </p>
        <Link to="/projects" className="text-orange-500 underline mt-4 inline-block font-semibold">
          Back to Projects
        </Link>
      </div>
    );
  }

  const s = projectStatusStyle(project.status);

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
            <Link to="/projects" className="hover:underline">Projects</Link>
            <span>&rsaquo;</span>
            <span className="text-gray-400">{project.jobTitle}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-[#1a1a3c]">{project.jobTitle}</h1>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${s.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
              {s.label}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1 max-w-[800px]">{project.jobDescription}</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold shadow-sm text-sm">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Milestones */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-8">Milestone Progress</h3>

            {milestones.length === 0 && (
              <p className="text-sm text-gray-400">No milestones defined yet.</p>
            )}

            <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
              {milestones.map((milestone) => {
                const uiStatus = milestoneUi(milestone.status);
                return (
                  <div key={milestone.id} className="relative">
                    <div className="absolute -left-[24px] top-1 bg-white p-0.5 z-10">
                      {uiStatus === "completed" && (
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
                      )}
                      {uiStatus === "active" && (
                        <div className="w-5 h-5 border-4 border-orange-500 bg-[#1a1a3c] rounded-full"></div>
                      )}
                      {uiStatus === "pending" && (
                        <div className="w-5 h-5 border-2 border-gray-300 bg-gray-200 rounded-full"></div>
                      )}
                    </div>

                    <div className={`p-5 rounded-2xl border ${uiStatus === "active" ? "bg-gray-50/50 border-gray-100 shadow-sm" : "border-transparent"}`}>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h4 className="font-bold text-[#1a1a3c] text-base">{milestone.title}</h4>
                        {uiStatus === "active" ? (
                          <span className="bg-orange-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                            {milestone.status === "REVISION_REQUESTED" ? "Revision" : "Active"}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-gray-400">
                            {uiStatus === "completed" ? "Approved" : "Pending"}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed mb-3">{milestone.description}</p>

                      {milestone.amount && (
                        <p className="text-xs font-bold text-gray-500 mb-3">
                          Amount: <span className="text-[#1a1a3c]">${milestone.amount.toLocaleString()}</span>
                        </p>
                      )}

                      {/* Client can approve or request revision when milestone is SUBMITTED */}
                      {milestone.status === "SUBMITTED" && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleApprove(milestone.id)}
                            disabled={!!actionLoading}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-orange-600 transition-all disabled:opacity-50"
                          >
                            {actionLoading === milestone.id + "-approve" ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleRevision(milestone.id)}
                            disabled={!!actionLoading}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 shadow-sm hover:border-orange-300 transition-all disabled:opacity-50"
                          >
                            {actionLoading === milestone.id + "-revision" ? "..." : "Request Revision"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expert info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-6">Assigned Expert</h3>
          {project.expertName ? (
            <div className="flex items-center gap-3">
              {project.expertAvatarUrl ? (
                <img src={project.expertAvatarUrl} alt={project.expertName} className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                  <Terminal size={16} />
                </div>
              )}
              <div>
                <h4 className="font-bold text-[#1a1a3c] text-sm">{project.expertName}</h4>
                <p className="text-xs text-gray-400">Expert</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-orange-500 ml-auto"></span>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No expert assigned yet.</p>
          )}

          {typeof project.totalBudget === "number" && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">Total Budget</p>
              <p className="font-bold text-[#1a1a3c] mt-0.5">${project.totalBudget.toLocaleString()}</p>
            </div>
          )}

          {typeof project.progress === "number" && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <MessagesIcon />

      <div>
        <Link
          to="/projects"
          className="w-fit flex items-center justify-center gap-1 p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50/30 transition-all shadow-sm"
        >
          <ArrowLeft size={20} /> Back to projects
        </Link>
      </div>
    </div>
  );
}
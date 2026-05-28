import { useEffect, useState } from "react";
import { CheckCircle2, Clock, UploadCloud, Info } from "lucide-react";
import { getMyProjects, getMilestones, submitMilestone } from "../../api/projects";
import toast from "react-hot-toast";

function milestoneUi(status) {
  if (status === "APPROVED") return "completed";
  if (status === "SUBMITTED" || status === "REVISION_REQUESTED") return "active";
  return "pending";
}

export default function MyTask() {
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);

  useEffect(() => {
    getMyProjects()
      .then((projects) => {
        const active = projects.find((p) => p.status === "ACTIVE") ?? projects[0];
        if (!active) return;
        setProject(active);
        return getMilestones(active.id);
      })
      .then((miles) => {
        if (miles) setMilestones(miles);
      })
      .catch(() => toast.error("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (milestoneId) => {
    setSubmitting(milestoneId);
    try {
      await submitMilestone(milestoneId);
      setMilestones((prev) =>
        prev.map((m) => (m.id === milestoneId ? { ...m, status: "SUBMITTED" } : m))
      );
      toast.success("Milestone submitted for approval!");
    } catch {
      toast.error("Failed to submit milestone");
    } finally {
      setSubmitting(null);
    }
  };

  const releasedAmount = milestones
    .filter((m) => m.status === "APPROVED")
    .reduce((sum, m) => sum + (m.amount ?? 0), 0);

  const heldAmount = milestones
    .filter((m) => m.status !== "APPROVED")
    .reduce((sum, m) => sum + (m.amount ?? 0), 0);

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading tasks...</div>;
  }

  if (!project) {
    return <div className="text-center py-12 text-gray-400">No active projects found.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT: MILESTONES */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-[#15153d] mb-2 flex items-center gap-2">
            <CheckCircle2 className="text-orange-500" /> Project Milestones
          </h3>
          <p className="text-sm text-gray-400 mb-6">{project.jobTitle}</p>

          {milestones.length === 0 && (
            <p className="text-sm text-gray-400">No milestones defined for this project.</p>
          )}

          <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
            {milestones.map((milestone, idx) => {
              const ui = milestoneUi(milestone.status);
              return (
                <div key={milestone.id} className="flex gap-6 relative">
                  <div className="shrink-0 z-10">
                    {ui === "completed" ? (
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
                        <CheckCircle2 size={18} />
                      </div>
                    ) : ui === "active" ? (
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-orange-500 text-orange-500 flex items-center justify-center">
                        <Clock size={18} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-300">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  {ui === "active" ? (
                    <div className="flex-1 p-5 border border-orange-100 bg-orange-50/30 rounded-2xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-orange-600">{milestone.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
                        </div>
                        <div className="text-right">
                          {milestone.amount && (
                            <span className="text-sm font-bold text-orange-600">
                              ${milestone.amount.toLocaleString()}
                            </span>
                          )}
                          <span className="block text-[10px] text-orange-500 font-bold uppercase italic">
                            {milestone.status === "SUBMITTED" ? "In review" : milestone.status === "REVISION_REQUESTED" ? "Revision" : "In progress"}
                          </span>
                        </div>
                      </div>
                      {milestone.status === "PENDING" || milestone.status === "REVISION_REQUESTED" ? (
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => handleSubmit(milestone.id)}
                            disabled={submitting === milestone.id}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-orange-600 transition-all disabled:opacity-50"
                          >
                            {submitting === milestone.id ? "Submitting..." : "Submit Deliverable"}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <h4 className={`font-bold ${ui === "completed" ? "text-[#15153d]" : "text-gray-400"}`}>
                          {milestone.title}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">{milestone.description}</p>
                        {milestone.dueDate && (
                          <span className="text-[10px] font-bold text-gray-400 block mt-2">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        {milestone.amount && (
                          <span className="text-sm font-bold text-[#15153d]">${milestone.amount.toLocaleString()}</span>
                        )}
                        <span className={`block text-[10px] font-bold ${ui === "completed" ? "text-emerald-500" : "text-gray-400"}`}>
                          {ui === "completed" ? "Released" : "Pending"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* UPLOAD AREA */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-[#15153d] mb-4">Submit Deliverables</h3>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-gray-50/30">
            <UploadCloud size={48} className="text-orange-400 mb-4" />
            <p className="text-sm font-bold text-gray-600">Drag and drop related weights or reports here</p>
            <p className="text-xs text-gray-400 mt-1">Supports PDF, ZIP, JSON (Max 5GB)</p>
          </div>
          <div className="mt-6">
            <label className="text-xs font-bold text-gray-400 uppercase">Submission Notes</label>
            <textarea
              className="w-full mt-2 p-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 min-h-[100px]"
              placeholder="Describe the contents..."
            />
          </div>
          <button className="w-full mt-6 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all">
            Submit for Approval
          </button>
        </div>
      </div>

      {/* RIGHT: ESCROW */}
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#15153d] mb-4">History & Audit</h3>
          <div className="space-y-4">
            {milestones
              .filter((m) => m.status === "APPROVED" || m.status === "SUBMITTED")
              .map((m) => (
                <div key={m.id} className="text-sm">
                  <p className="font-bold text-gray-800">
                    {m.status === "APPROVED" ? "Milestone Approved" : "Milestone Submitted"}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{m.title}</p>
                </div>
              ))}
            {milestones.filter((m) => m.status === "APPROVED" || m.status === "SUBMITTED").length === 0 && (
              <p className="text-xs text-gray-400">No activity yet.</p>
            )}
          </div>
          <button className="w-full mt-6 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50">
            View Full Audit Log
          </button>
        </div>

        <div className="bg-[#1e1b4b] p-6 rounded-3xl text-white shadow-xl">
          <h3 className="font-bold uppercase text-[10px] tracking-widest text-blue-300 mb-4">Escrow Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-blue-100/60">Released to Date:</span>
              <span className="font-bold">${releasedAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-100/60">Currently Held:</span>
              <span className="font-bold text-orange-400">${heldAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
          <div className="flex items-start gap-4">
            <Info className="text-orange-500 shrink-0" size={20} />
            <div>
              <p className="text-sm font-bold text-orange-900">Need help?</p>
              <p className="text-xs text-orange-700 mt-1 leading-relaxed">Dispute resolution & help desk are available 24/7.</p>
              <button className="mt-3 text-xs font-bold text-orange-600 underline">Contact Case Manager</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
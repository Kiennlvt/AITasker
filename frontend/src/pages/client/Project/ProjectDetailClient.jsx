import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Share2, Terminal, ArrowLeft, FileText, ChevronDown, ChevronUp, AlertTriangle, Gavel } from "lucide-react";
import MessagesIcon from "../../../components/ui/MesageIcon";
import MilestoneCountdown from "../../../components/ui/MilestoneCountdown";
import { getProjectById, getMilestones, approveMilestone, requestRevision, requestProjectCancellation } from "../../../api/projects";
import { fileDispute, uploadDisputeEvidence, respondToDispute, getProjectDisputes } from "../../../api/disputes";
import { createReview, hasReviewed } from "../../../api/reviews";
import useAuthStore from "../../../store/authStore";
import toast from "react-hot-toast";

function milestoneUi(status) {
  switch (status) {
    case "APPROVED":
    case "PAID":
      return "completed";
    case "SUBMITTED":
      return "active";
    case "REVISION_REQUESTED":
    case "DISPUTED":
      return "active";
    default:
      return "pending";
  }
}

function milestoneStatusStyle(status) {
  switch (status) {
    case "APPROVED":
      return { label: "Approved", className: "bg-emerald-50 text-emerald-600 border-emerald-100" };
    case "SUBMITTED":
      return { label: "In Review", className: "bg-blue-50 text-blue-600 border-blue-100" };
    case "REVISION_REQUESTED":
      return { label: "Revision", className: "bg-amber-50 text-amber-600 border-amber-100" };
    case "DISPUTED":
      return { label: "Disputed", className: "bg-red-50 text-red-600 border-red-100" };
    case "IN_PROGRESS":
      return { label: "In Progress", className: "bg-orange-50 text-orange-600 border-orange-100" };
    default:
      return { label: "Pending", className: "bg-gray-50 text-gray-500 border-gray-100" };
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
  const { user } = useAuthStore();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [revisionNote, setRevisionNote] = useState({});
  const [revisionOpen, setRevisionOpen] = useState(null);
  const [revisionDueDate, setRevisionDueDate] = useState({});
  const [disputeOpen, setDisputeOpen] = useState(null);
  const [disputeReason, setDisputeReason] = useState({});
  const [disputeFiles, setDisputeFiles] = useState({});
  const [respondNote, setRespondNote] = useState({});
  const [respondFiles, setRespondFiles] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const loadDisputes = () => getProjectDisputes(id).then(setDisputes).catch(() => {});

  useEffect(() => {
    Promise.all([getProjectById(id), getMilestones(id)])
      .then(([proj, miles]) => {
        setProject(proj);
        setMilestones(
          [...miles].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        );
        if (proj.status === "COMPLETED") {
          hasReviewed(id).then(setAlreadyReviewed).catch(() => {});
        }
      })
      .catch(() => toast.error("Failed to load project"))
      .finally(() => setLoading(false));
    loadDisputes();
  }, [id]);

  const handleApprove = async (milestoneId) => {
    setActionLoading(milestoneId + "-approve");
    try {
      const updatedProject = await approveMilestone(milestoneId);
      setProject(updatedProject);
      setMilestones(
        [...(updatedProject.milestones ?? [])].sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        )
      );
      toast.success(
        updatedProject.status === "COMPLETED"
          ? "Milestone approved! Project completed 🎉"
          : "Milestone approved!"
      );
    } catch {
      toast.error("Failed to approve milestone");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevision = async (milestoneId) => {
    const note = revisionNote[milestoneId]?.trim();
    const dueDate = revisionDueDate[milestoneId];
    if (!note) { toast.error("Please enter a reason for the revision."); return; }
    if (!dueDate) { toast.error("Please choose a new due date for the revision."); return; }
    setActionLoading(milestoneId + "-revision");
    try {
      await requestRevision(milestoneId, note, dueDate);
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === milestoneId
            ? { ...m, status: "REVISION_REQUESTED", revisionNote: note, revisionDueDate: dueDate }
            : m
        )
      );
      setRevisionOpen(null);
      setRevisionNote((prev) => ({ ...prev, [milestoneId]: "" }));
      setRevisionDueDate((prev) => ({ ...prev, [milestoneId]: "" }));
      toast.success("Revision requested.");
    } catch {
      toast.error("Failed to request revision");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFileDispute = async (milestoneId) => {
    const reason = disputeReason[milestoneId]?.trim();
    if (!reason) { toast.error("Please describe why you're raising a dispute."); return; }
    setActionLoading(milestoneId + "-dispute");
    try {
      const dispute = await fileDispute(milestoneId, reason);
      const files = disputeFiles[milestoneId] || [];
      if (files.length > 0) {
        await uploadDisputeEvidence(dispute.id, files);
      }
      setMilestones((prev) => prev.map((m) => (m.id === milestoneId ? { ...m, status: "DISPUTED" } : m)));
      setDisputeOpen(null);
      setDisputeReason((prev) => ({ ...prev, [milestoneId]: "" }));
      setDisputeFiles((prev) => ({ ...prev, [milestoneId]: [] }));
      await loadDisputes();
      toast.success("Dispute filed. An admin will review it shortly.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to file dispute");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRespondDispute = async (disputeId, milestoneId) => {
    const response = respondNote[disputeId]?.trim();
    if (!response) { toast.error("Please enter your response."); return; }
    setActionLoading(milestoneId + "-respond");
    try {
      await respondToDispute(disputeId, response);
      const files = respondFiles[disputeId] || [];
      if (files.length > 0) {
        await uploadDisputeEvidence(disputeId, files);
      }
      setRespondNote((prev) => ({ ...prev, [disputeId]: "" }));
      setRespondFiles((prev) => ({ ...prev, [disputeId]: [] }));
      await loadDisputes();
      toast.success("Response submitted.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit response");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelProject = async () => {
    setCancelling(true);
    try {
      const updated = await requestProjectCancellation(project.id);
      setProject(updated);
      setShowCancelModal(false);
      toast.success("Cancellation requested. The expert has been notified.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to request cancellation");
    } finally {
      setCancelling(false);
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-8">Milestone Progress</h3>

            {milestones.length === 0 && (
              <p className="text-sm text-gray-400">No milestones defined yet.</p>
            )}

            <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
              {milestones.map((milestone) => {
                const isRevision = milestone.status === "REVISION_REQUESTED";
                const effectiveDueDate = isRevision && milestone.revisionDueDate
                  ? milestone.revisionDueDate
                  : milestone.dueDate;
                const isPastDue =
                  effectiveDueDate &&
                  new Date(effectiveDueDate) < new Date() &&
                  milestone.status !== "APPROVED" &&
                  milestone.status !== "SUBMITTED";
                const canDisputeReview = milestone.status === "SUBMITTED" || milestone.status === "REVISION_REQUESTED";
                const canDisputeOverdue = (milestone.status === "PENDING" || milestone.status === "IN_PROGRESS") && isPastDue;
                let uiStatus = milestoneUi(milestone.status);
                if (uiStatus === "pending" && canDisputeOverdue) uiStatus = "active";
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
                          <span className={`text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded ${canDisputeOverdue ? "bg-red-500" : "bg-orange-500"}`}>
                            {milestone.status === "REVISION_REQUESTED" ? "Revision" : canDisputeOverdue ? "Overdue" : "Active"}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-gray-400">
                            {uiStatus === "completed" ? (milestone.status === "PAID" ? "Paid" : "Approved") : "Pending"}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed mb-3">{milestone.description}</p>
                      {effectiveDueDate && (
                        <p className={`text-[11px] font-bold mb-3 ${isPastDue ? "text-red-500" : "text-gray-400"}`}>
                          {isRevision && milestone.revisionDueDate ? "Revision due" : "Due"}: {new Date(effectiveDueDate).toLocaleDateString()}
                          {isPastDue && " — Overdue!"}
                        </p>
                      )}

                      {milestone.amount && (
                        <p className="text-xs font-bold text-gray-500 mb-3">
                          Amount: <span className="text-[#1a1a3c]">${milestone.amount.toLocaleString()}</span>
                        </p>
                      )}

                      {(milestone.status === "SUBMITTED" || milestone.status === "REVISION_REQUESTED") && milestone.deliverableNote && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                          <p className="text-[11px] font-bold text-blue-500 uppercase mb-1">Expert Note</p>
                          <p className="text-xs text-gray-700 leading-relaxed">{milestone.deliverableNote}</p>
                        </div>
                      )}

                      {milestone.status === "REVISION_REQUESTED" && milestone.revisionNote && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                          <p className="text-[11px] font-bold text-amber-600 uppercase mb-1">Your Revision Request</p>
                          <p className="text-xs text-gray-700 leading-relaxed">{milestone.revisionNote}</p>
                          {milestone.revisionDueDate && (
                            <p className="text-[11px] text-amber-600 font-semibold mt-1.5">
                              New due date: {new Date(milestone.revisionDueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}

                      {milestone.revisionCount >= 2 && (milestone.status === "SUBMITTED" || milestone.status === "REVISION_REQUESTED") && (
                        <p className="mt-2 text-[11px] font-semibold text-red-500">
                          This milestone has been sent back for revision {milestone.revisionCount} times.
                        </p>
                      )}

                      {milestone.status === "DISPUTED" && (() => {
                        const dispute = disputes.find((d) => d.milestoneId === milestone.id && d.status === "PENDING");
                        if (!dispute) return null;
                        const isRespondent = dispute.respondentId === user?.id;
                        return (
                          <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl space-y-2">
                            <p className="text-[11px] font-bold text-red-600 uppercase">
                              Dispute filed by {dispute.filedByName}
                            </p>
                            <p className="text-xs text-gray-700 leading-relaxed">{dispute.reason}</p>
                            {isRespondent && !dispute.respondentResponse && (
                              <div className="space-y-2 pt-1">
                                <textarea
                                  value={respondNote[dispute.id] ?? ""}
                                  onChange={(e) => setRespondNote((prev) => ({ ...prev, [dispute.id]: e.target.value }))}
                                  placeholder="Explain your side / submit evidence notes..."
                                  className="w-full p-3 border border-red-200 rounded-xl text-xs outline-none focus:border-red-400 min-h-[70px] resize-none bg-white"
                                />
                                <input
                                  type="file"
                                  multiple
                                  onChange={(e) => setRespondFiles((prev) => ({ ...prev, [dispute.id]: Array.from(e.target.files) }))}
                                  className="w-full text-[11px] text-gray-500"
                                />
                                <button
                                  onClick={() => handleRespondDispute(dispute.id, milestone.id)}
                                  disabled={!!actionLoading}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                                >
                                  {actionLoading === milestone.id + "-respond" ? "Submitting..." : "Submit Response"}
                                </button>
                              </div>
                            )}
                            {dispute.respondentResponse && (
                              <div className="p-2 bg-white border border-red-100 rounded-lg">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Response</p>
                                <p className="text-xs text-gray-700">{dispute.respondentResponse}</p>
                                {dispute.respondentEvidenceUrls?.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    {dispute.respondentEvidenceUrls.map((url) => (
                                      <a
                                        key={url}
                                        href={`http://localhost:8080${url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] text-gray-600 hover:border-red-300 hover:bg-red-50 transition-colors"
                                      >
                                        <FileText size={10} className="text-red-400" />
                                        {url.split('/').pop().replace(/^[0-9a-f-]+_/, '')}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            <p className="text-[11px] text-red-500 italic">Waiting for admin review and verdict.</p>
                          </div>
                        );
                      })()}

                      {(() => {
                        const resolved = disputes.find((d) => d.milestoneId === milestone.id && d.status === "RESOLVED");
                        if (!resolved) return null;
                        return (
                          <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                            <p className="text-[11px] font-bold text-gray-500 uppercase mb-1">Dispute Resolved by Admin</p>
                            <p className="text-xs text-gray-700">
                              You: ${resolved.clientAmount?.toLocaleString()} · Expert: ${resolved.expertAmount?.toLocaleString()}
                            </p>
                            {resolved.resolutionNote && (
                              <p className="text-[11px] text-gray-500 mt-1 italic">{resolved.resolutionNote}</p>
                            )}
                          </div>
                        );
                      })()}

                      {(milestone.status === "SUBMITTED" || milestone.status === "REVISION_REQUESTED") && milestone.attachmentUrls?.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <p className="text-[11px] font-bold text-gray-400 uppercase">Attachments</p>
                          {milestone.attachmentUrls.map((url) => {
                            const filename = url.split("/").pop().replace(/^[0-9a-f-]+_/, "");
                            return (
                              <a
                                key={url}
                                href={`http://localhost:8080${url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors"
                              >
                                <FileText size={14} className="text-orange-400 shrink-0" />
                                <span className="text-xs text-gray-700 truncate">{filename}</span>
                              </a>
                            );
                          })}
                        </div>
                      )}

                      {milestone.status === "SUBMITTED" && milestone.reviewDeadline && (
                        <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                          <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-amber-700 leading-relaxed">
                            <span className="font-bold">
                              <MilestoneCountdown deadline={milestone.reviewDeadline} />
                            </span>{" "}
                            to review this submission. If you remain inactive until{" "}
                            {new Date(milestone.reviewDeadline).toLocaleString()}, it will be automatically approved
                            and the payment released to the expert.
                          </p>
                        </div>
                      )}

                      {canDisputeOverdue && (
                        <p className="mt-2 text-[11px] font-semibold text-red-500">
                          This milestone's due date has passed and the expert hasn't submitted anything yet.
                        </p>
                      )}

                      {(canDisputeReview || canDisputeOverdue) && (
                        <div className="mt-3 space-y-2">
                          <div className="flex gap-2">
                            {milestone.status === "SUBMITTED" && (
                              <>
                                <button
                                  onClick={() => handleApprove(milestone.id)}
                                  disabled={!!actionLoading}
                                  className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-orange-600 transition-all disabled:opacity-50"
                                >
                                  {actionLoading === milestone.id + "-approve" ? "..." : "Approve"}
                                </button>
                                <button
                                  onClick={() => setRevisionOpen(revisionOpen === milestone.id ? null : milestone.id)}
                                  disabled={!!actionLoading}
                                  className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 shadow-sm hover:border-orange-300 transition-all disabled:opacity-50"
                                >
                                  Request Revision
                                  {revisionOpen === milestone.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setDisputeOpen(disputeOpen === milestone.id ? null : milestone.id)}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1 px-4 py-2 bg-white border border-red-200 rounded-lg text-xs font-bold text-red-500 shadow-sm hover:bg-red-50 transition-all disabled:opacity-50"
                            >
                              <Gavel size={12} /> Raise a Dispute
                            </button>
                          </div>

                          {disputeOpen === milestone.id && (
                            <div className="space-y-2 pt-1">
                              <textarea
                                value={disputeReason[milestone.id] ?? ""}
                                onChange={(e) => setDisputeReason((prev) => ({ ...prev, [milestone.id]: e.target.value }))}
                                placeholder="Explain why you're raising a dispute..."
                                className="w-full p-3 border border-red-200 rounded-xl text-xs outline-none focus:border-red-400 min-h-[80px] resize-none"
                              />
                              <input
                                type="file"
                                multiple
                                onChange={(e) => setDisputeFiles((prev) => ({ ...prev, [milestone.id]: Array.from(e.target.files) }))}
                                className="w-full text-[11px] text-gray-500"
                              />
                              <button
                                onClick={() => handleFileDispute(milestone.id)}
                                disabled={!!actionLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                              >
                                {actionLoading === milestone.id + "-dispute" ? "Filing..." : "File Dispute"}
                              </button>
                            </div>
                          )}

                          {revisionOpen === milestone.id && (
                            <div className="space-y-2 pt-1">
                              <textarea
                                value={revisionNote[milestone.id] ?? ""}
                                onChange={(e) => setRevisionNote((prev) => ({ ...prev, [milestone.id]: e.target.value }))}
                                placeholder="Describe what needs to be revised..."
                                className="w-full p-3 border border-gray-200 rounded-xl text-xs outline-none focus:border-orange-400 min-h-[80px] resize-none"
                              />
                              <div>
                                <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
                                  New due date for resubmission
                                </label>
                                <input
                                  type="date"
                                  value={revisionDueDate[milestone.id] ?? ""}
                                  onChange={(e) => setRevisionDueDate((prev) => ({ ...prev, [milestone.id]: e.target.value }))}
                                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-orange-400"
                                />
                              </div>
                              <button
                                onClick={() => handleRevision(milestone.id)}
                                disabled={!!actionLoading}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-gray-900 transition-all disabled:opacity-50"
                              >
                                {actionLoading === milestone.id + "-revision" ? "Sending..." : "Send Revision Request"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

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

      {project.cancellationRequestedAt && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-700">Cancellation requested — waiting for expert response</p>
            <p className="text-xs text-amber-600 mt-1">
              If the expert doesn't become active or submit a milestone by{" "}
              {project.cancellationDeadline ? new Date(project.cancellationDeadline).toLocaleString() : "the deadline"},
              the project will be automatically cancelled and the full escrow amount refunded to your wallet.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link
          to="/projects"
          className="w-fit flex items-center justify-center gap-1 p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50/30 transition-all shadow-sm text-sm font-semibold"
        >
          <ArrowLeft size={18} /> Back to projects
        </Link>

        {project.status === "COMPLETED" && !alreadyReviewed && (
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold shadow-md transition-all"
          >
            Leave a Review
          </button>
        )}

        {project.cancellationEligible && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="px-6 py-2.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm font-bold shadow-sm transition-all"
          >
            Cancel Project
          </button>
        )}
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-8 max-w-md w-full shadow-xl relative border border-gray-100/50">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 text-xl font-light"
            >
              ✕
            </button>

            <div className="w-16 h-16 bg-red-50 rounded-[20px] flex items-center justify-center text-red-500 mb-5">
              <AlertTriangle size={28} />
            </div>

            <h3 className="text-[22px] font-bold text-[#181926] tracking-tight">Cancel this project?</h3>
            <p className="text-sm text-gray-400 mt-1.5 mb-7 leading-relaxed">
              Your expert has been inactive for at least 5 days with no milestone submitted. We'll notify them and
              give them 48 hours to respond. If they don't, the full escrowed amount will be automatically refunded
              to your wallet and the project will be cancelled.
            </p>

            <div className="flex gap-4 w-full">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#6b7280] text-sm font-bold rounded-[14px] transition-colors"
              >
                Keep Project
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelProject}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-[14px] shadow-sm transition-all disabled:opacity-50"
              >
                {cancelling ? "Requesting..." : "Request Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-8 max-w-md w-full shadow-xl relative border border-gray-100/50 flex flex-col items-center">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 text-xl font-light"
            >
              ✕
            </button>

            <div className="w-16 h-16 bg-[#fff2e6] rounded-[20px] flex items-center justify-center text-[#e07026] mb-5 text-2xl">
              ★
            </div>

            <h3 className="text-[22px] font-bold text-center text-[#181926] tracking-tight">Rate your experience</h3>
            <p className="text-sm text-gray-400 text-center mt-1.5 mb-7">
              How was working with <span className="font-semibold text-[#181926]">{project.expertName || "Le Van Expert"}</span>?
            </p>

            <div className="flex justify-center gap-3 mb-7 w-full">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-all transform hover:scale-110 outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    className={`w-9 h-9 ${star <= rating ? "fill-[#ea8441] stroke-[#ea8441]" : "fill-none stroke-[#d2d4dc]"}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.151-.326.621-.326.772 0l2.742 5.556 6.13 1.107c.362.065.507.513.23.768l-4.42 4.307 1.043 6.113c.062.365-.32.643-.642.47l-5.46-2.873-5.46 2.873c-.322.172-.704-.105-.642-.47l1.042-6.113-4.42-4.307c-.277-.255-.132-.703.23-.768l6.13-1.107 2.742-5.556z" />
                  </svg>
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience (optional)..."
              rows={4}
              className="w-full p-4 border border-gray-200/80 rounded-[16px] text-sm outline-none focus:border-[#ea8441] placeholder-gray-300 transition-all resize-none mb-7 bg-white"
            />

            <div className="flex gap-4 w-full">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-3 bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#6b7280] text-sm font-bold rounded-[14px] transition-colors"
              >
                Skip
              </button>
              <button
                type="button"
                disabled={submittingReview}
                onClick={async () => {
                  setSubmittingReview(true);
                  try {
                    await createReview({
                      projectId: project.id,
                      receiverId: project.expertId,
                      rating: rating,
                      comment: comment.trim() || null
                    });

                    toast.success("Thank you for your review!");
                    setShowReviewModal(false);
                    setComment("");
                    setRating(0);
                  } catch (err) {
                    toast.error(err?.response?.data?.message || "Failed to submit review");
                  } finally {
                    setSubmittingReview(false);
                  }
                }}
                className="flex-1 py-3 bg-[#f2ae83] hover:bg-[#ea8441] text-white text-sm font-bold rounded-[14px] shadow-sm transition-all disabled:opacity-50"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

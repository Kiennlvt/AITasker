import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock, UploadCloud, Info, ArrowLeft, ChevronRight, Briefcase, X, FileText, RefreshCw, Plus, Star } from "lucide-react";
import { getMyProjects, getMilestones, submitMilestone, uploadMilestoneFiles, createMilestone } from "../../api/projects";
import { createReview, hasReviewed } from "../../api/reviews";
import toast from "react-hot-toast";

function milestoneUi(status) {
  if (status === "APPROVED") return "completed";
  if (status === "SUBMITTED" || status === "REVISION_REQUESTED" || status === "IN_PROGRESS" || status === "PENDING") return "active";
  return "pending";
}

const STATUS_MAP = {
  ACTIVE:    { label: "In Progress", cls: "bg-orange-100 text-orange-600" },
  COMPLETED: { label: "Completed",   cls: "bg-emerald-100 text-emerald-600" },
  PENDING:   { label: "Pending",     cls: "bg-gray-100 text-gray-500" },
  DISPUTED:  { label: "Disputed",    cls: "bg-red-100 text-red-600" },
  CANCELLED: { label: "Cancelled",   cls: "bg-gray-200 text-gray-400" },
};

export default function MyTask() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [note, setNote] = useState("");
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [creatingMilestone, setCreatingMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: "", description: "", amount: "", dueDate: "" });
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const fileInputRef = useRef(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    getMyProjects()
      .then(setProjects)
      .catch(() => toast.error("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  // Auto-poll milestones every 8s while any milestone is SUBMITTED (waiting for client)
  useEffect(() => {
    const hasSubmitted = milestones.some((m) => m.status === "SUBMITTED");
    if (selectedProject && hasSubmitted) {
      pollingRef.current = setInterval(() => {
        getMilestones(selectedProject.id)
          .then((fresh) => {
            setMilestones(fresh);
          })
          .catch(() => {});
      }, 8000);
    }
    return () => clearInterval(pollingRef.current);
  }, [milestones, selectedProject]);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setMilestonesLoading(true);
    setAlreadyReviewed(false);
    getMilestones(project.id)
      .then(setMilestones)
      .catch(() => toast.error("Failed to load milestones"))
      .finally(() => setMilestonesLoading(false));
    // Check if expert already reviewed this project
    if (project.status === "COMPLETED") {
      hasReviewed(project.id)
        .then(setAlreadyReviewed)
        .catch(() => {});
    }
  };

  const handleBack = () => {
    setSelectedProject(null);
    setMilestones([]);
    setReviewRating(0);
    setReviewComment("");
    setAlreadyReviewed(false);
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmittingReview(true);
    try {
      await createReview({
        projectId: selectedProject.id,
        receiverId: selectedProject.clientId,
        rating: reviewRating,
        comment: reviewComment.trim() || null,
      });
      toast.success("Review submitted! Thank you.");
      setAlreadyReviewed(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleRefreshMilestones = () => {
    if (!selectedProject) return;
    setRefreshing(true);
    getMilestones(selectedProject.id)
      .then(setMilestones)
      .catch(() => toast.error("Failed to refresh milestones"))
      .finally(() => setRefreshing(false));
  };

  const handleSubmit = async (milestoneId) => {
    if (!note.trim()) {
      toast.error("Please enter submission notes before submitting.");
      return;
    }
    setSubmitting(milestoneId);
    try {
      if (files.length > 0) {
        await uploadMilestoneFiles(milestoneId, files);
      }
      await submitMilestone(milestoneId, note.trim());
      setMilestones((prev) =>
        prev.map((m) => (m.id === milestoneId ? { ...m, status: "SUBMITTED" } : m))
      );
      setFiles([]);
      setNote("");
      toast.success("Milestone submitted for approval!");
    } catch {
      toast.error("Failed to submit milestone");
    } finally {
      setSubmitting(null);
    }
  };

  const handleCreateMilestone = async () => {
    const title = newMilestone.title.trim();
    const amount = parseFloat(newMilestone.amount);
    if (!title) { toast.error("Please enter a milestone title."); return; }
    if (!newMilestone.amount || isNaN(amount) || amount <= 0) { toast.error("Please enter a valid amount."); return; }

    setCreatingMilestone(true);
    try {
      const created = await createMilestone(selectedProject.id, {
        title,
        description: newMilestone.description.trim(),
        amount,
        dueDate: newMilestone.dueDate || null,
      });
      setMilestones((prev) => [...prev, created]);
      setNewMilestone({ title: "", description: "", amount: "", dueDate: "" });
      setShowAddMilestone(false);
      toast.success("Milestone added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create milestone");
    } finally {
      setCreatingMilestone(false);
    }
  };

  const ACCEPTED_TYPES = ["application/pdf", "application/zip", "application/json",
    "application/x-zip-compressed", "application/octet-stream"];

  const addFiles = (incoming) => {
    const valid = Array.from(incoming).filter((f) => {
      if (f.size > 5 * 1024 * 1024 * 1024) {
        toast.error(`${f.name} exceeds 5 GB limit`);
        return false;
      }
      return true;
    });
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...valid.filter((f) => !names.has(f.name))];
    });
  };

  const removeFile = (name) => setFiles((prev) => prev.filter((f) => f.name !== name));

  const fmtSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
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

  /* ───────── TASK LIST VIEW ───────── */
  if (!selectedProject) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#15153d]">My Tasks</h2>
          <p className="text-sm text-gray-400 mt-1">All projects you have accepted</p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Briefcase size={48} className="mx-auto mb-4 text-gray-200" />
            <p className="font-bold">No tasks yet</p>
            <p className="text-sm mt-1">Projects you accept will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => {
              const badge = STATUS_MAP[project.status] ?? { label: project.status, cls: "bg-gray-100 text-gray-400" };
              const isOverdue =
                project.deadline &&
                new Date(project.deadline) < new Date() &&
                project.status === "ACTIVE";
              return (
                <button
                  key={project.id}
                  onClick={() => handleSelectProject(project)}
                  className="w-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all text-left flex items-center gap-6"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-0.5 rounded-full text-[11px] font-bold ${badge.cls}`}>
                        {badge.label}
                      </span>
                      {isOverdue && (
                        <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-600">
                          Overdue
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-[#15153d] text-base truncate">{project.jobTitle}</h4>
                    {project.clientName && (
                      <p className="text-xs text-gray-400 mt-1">Client: {project.clientName}</p>
                    )}
                    {project.deadline && (
                      <p className={`text-xs mt-1 ${isOverdue ? "text-red-400 font-bold" : "text-gray-400"}`}>
                        Deadline: {new Date(project.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {project.totalBudget != null && (
                      <p className="font-bold text-[#15153d] text-base">${project.totalBudget.toLocaleString()}</p>
                    )}
                    {project.progress != null && (
                      <p className="text-xs text-gray-400 mt-1">{project.progress}% done</p>
                    )}
                  </div>
                  <ChevronRight className="text-gray-300 shrink-0" size={20} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  /* ───────── TASK DETAIL VIEW ───────── */
  if (milestonesLoading) {
    return (
      <div className="space-y-4">
        <button onClick={handleBack} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-500 transition-colors">
          <ArrowLeft size={16} /> Back to My Tasks
        </button>
        <div className="text-center py-12 text-gray-400">Loading milestones...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-500 transition-colors"
      >
        <ArrowLeft size={16} /> Back to My Tasks
      </button>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between gap-6 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-[#15153d]">{selectedProject.jobTitle}</h2>
          {selectedProject.clientName && (
            <p className="text-sm text-gray-400 mt-1">Client: {selectedProject.clientName}</p>
          )}
        </div>
        {selectedProject.totalBudget != null && (
          <div className="text-right shrink-0">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Project Price</p>
            <p className="text-2xl font-bold text-orange-500">${selectedProject.totalBudget.toLocaleString()}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: MILESTONES */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-[#15153d] flex items-center gap-2">
                <CheckCircle2 className="text-orange-500" /> Project Milestones
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddMilestone((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all"
                >
                  <Plus size={12} />
                  Add Milestone
                </button>
                <button
                  onClick={handleRefreshMilestones}
                  disabled={refreshing}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-500 border border-gray-200 rounded-lg hover:border-orange-300 hover:text-orange-500 transition-all disabled:opacity-50"
                >
                  <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6">{selectedProject.jobTitle}</p>

            {showAddMilestone && (
              <div className="mb-6 p-5 bg-gray-50/60 border border-gray-100 rounded-2xl space-y-3">
                <input
                  type="text"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Milestone title"
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"
                />
                <textarea
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Description (optional)"
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 min-h-[80px] resize-none"
                />
                <div className="flex gap-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newMilestone.amount}
                    onChange={(e) => setNewMilestone((p) => ({ ...p, amount: e.target.value }))}
                    placeholder="Amount ($)"
                    className="flex-1 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"
                  />
                  <input
                    type="date"
                    value={newMilestone.dueDate}
                    onChange={(e) => setNewMilestone((p) => ({ ...p, dueDate: e.target.value }))}
                    className="flex-1 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateMilestone}
                    disabled={creatingMilestone}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-orange-600 transition-all disabled:opacity-50"
                  >
                    {creatingMilestone ? "Adding..." : "Save Milestone"}
                  </button>
                  <button
                    onClick={() => { setShowAddMilestone(false); setNewMilestone({ title: "", description: "", amount: "", dueDate: "" }); }}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:border-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {milestones.length === 0 && (
              <p className="text-sm text-gray-400">No milestones defined for this project.</p>
            )}

            <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
              {milestones.map((milestone, idx) => {
                const ui = milestoneUi(milestone.status);
                const isPastDue =
                  milestone.dueDate &&
                  new Date(milestone.dueDate) < new Date() &&
                  milestone.status !== "APPROVED" &&
                  milestone.status !== "SUBMITTED";
                const canSubmit =
                  milestone.status === "PENDING" ||
                  milestone.status === "IN_PROGRESS" ||
                  milestone.status === "REVISION_REQUESTED";

                return (
                  <div key={milestone.id} className="flex gap-6 relative">
                    <div className="shrink-0 z-10">
                      {ui === "completed" ? (
                        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
                          <CheckCircle2 size={18} />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-orange-500 text-orange-500 flex items-center justify-center">
                          <Clock size={18} />
                        </div>
                      )}
                    </div>

                    {ui === "completed" ? (
                      <div className="flex-1 flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-[#15153d]">{milestone.title}</h4>
                          <p className="text-sm text-gray-400 mt-1">{milestone.description}</p>
                          {milestone.dueDate && (
                            <span className="text-[10px] font-bold text-gray-400 block mt-2">
                              Due: {new Date(milestone.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          {milestone.amount != null && (
                            <span className="text-sm font-bold text-[#15153d]">${milestone.amount.toLocaleString()}</span>
                          )}
                          <span className="block text-[10px] font-bold text-emerald-500">Released</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 p-5 border border-orange-100 bg-orange-50/30 rounded-2xl">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-orange-600">{milestone.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
                            {milestone.dueDate && (
                              <span className={`text-[10px] font-bold block mt-2 ${isPastDue ? "text-red-500" : "text-gray-400"}`}>
                                Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                {isPastDue && " — Overdue!"}
                              </span>
                            )}
                          </div>
                          <div className="text-right shrink-0 ml-4">
                            {milestone.amount != null && (
                              <span className="text-sm font-bold text-orange-600">
                                ${milestone.amount.toLocaleString()}
                              </span>
                            )}
                            <span className="block text-[10px] text-orange-500 font-bold uppercase italic">
                              {milestone.status === "SUBMITTED"
                                ? "In review"
                                : milestone.status === "REVISION_REQUESTED"
                                ? "Revision requested"
                                : "In progress"}
                            </span>
                          </div>
                        </div>
                        {milestone.status === "REVISION_REQUESTED" && milestone.revisionNote && (
                          <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                            <p className="text-[11px] font-bold text-amber-600 uppercase mb-1">Client Revision Request</p>
                            <p className="text-xs text-gray-700 leading-relaxed">{milestone.revisionNote}</p>
                          </div>
                        )}
                        {canSubmit && (
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() => handleSubmit(milestone.id)}
                              disabled={submitting === milestone.id}
                              className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-orange-600 transition-all disabled:opacity-50"
                            >
                              {submitting === milestone.id ? "Submitting..." : "Submit Deliverable"}
                            </button>
                          </div>
                        )}
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

            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                addFiles(e.dataTransfer.files);
              }}
              className={`cursor-pointer border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors
                ${dragging ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-gray-50/30 hover:border-orange-300 hover:bg-orange-50/20"}`}
            >
              <UploadCloud size={48} className={`mb-4 ${dragging ? "text-orange-500" : "text-orange-400"}`} />
              <p className="text-sm font-bold text-gray-600">
                {dragging ? "Drop files here" : "Drag & drop files here, or click to browse"}
              </p>
              <p className="text-xs text-gray-400 mt-1">Supports PDF, ZIP, JSON (Max 5GB per file)</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.zip,.json"
              className="hidden"
              onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
            />

            {/* File list */}
            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((f) => (
                  <li key={f.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <FileText size={18} className="text-orange-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-700 truncate">{f.name}</p>
                      <p className="text-[11px] text-gray-400">{fmtSize(f.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(f.name)}
                      className="shrink-0 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Submission Notes <span className="text-red-400 normal-case font-normal">(required)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full mt-2 p-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 min-h-[100px]"
                placeholder="Describe what you delivered..."
              />
            </div>
            {(() => {
              const pending = milestones.find(
                (m) => m.status === "PENDING" || m.status === "IN_PROGRESS" || m.status === "REVISION_REQUESTED"
              );
              return (
                <button
                  onClick={() => pending && handleSubmit(pending.id)}
                  disabled={!pending || !!submitting}
                  className="w-full mt-6 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? "Submitting..."
                    : pending
                    ? `Submit "${pending.title}" for Approval`
                    : "No pending milestones"}
                </button>
              );
            })()}
          </div>
        </div>

        {/* RIGHT: ESCROW + AUDIT */}
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
                <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                  Dispute resolution &amp; help desk are available 24/7.
                </p>
                <button className="mt-3 text-xs font-bold text-orange-600 underline">Contact Case Manager</button>
              </div>
            </div>
          </div>

          {/* REVIEW SECTION — only shown for COMPLETED projects */}
          {selectedProject?.status === "COMPLETED" && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-[#15153d] mb-4 flex items-center gap-2">
                <Star size={16} className="text-amber-400" />
                Rate Your Client
              </h3>
              {alreadyReviewed ? (
                <div className="text-center py-4 text-sm text-emerald-600 font-semibold">
                  ✅ You have already reviewed this project.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Star rating */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rating</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={28}
                            className={star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Comment */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Comment (optional)</p>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={3}
                      placeholder="Share your experience working with this client..."
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSubmitReview}
                    disabled={submittingReview || reviewRating === 0}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

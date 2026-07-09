import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, ArrowUpDown, Star, Sparkles, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MessagesIcon from "../../components/ui/MesageIcon";
import Button from "../../components/ui/Button";
import { getMyJobs, deleteJob } from "../../api/jobs";
import { getProposalsByJob, acceptProposal, rejectProposal } from "../../api/proposals";
import { findOrCreateDirect } from "../../api/conversations";
import toast from "react-hot-toast";

import usePostJobStore from "../../store/postJobStore";

const FILTER_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
];

const SORT_OPTIONS = [
  { value: "NEWEST", label: "Newest first" },
  { value: "PRICE_LOW", label: "Price: Low to High" },
  { value: "PRICE_HIGH", label: "Price: High to Low" },
  { value: "DELIVERY_FAST", label: "Delivery: Fastest" },
  { value: "RATING_HIGH", label: "Rating: Highest" },
];

export default function ManageProposals() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [messageLoading, setMessageLoading] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Store actions
  const loadDraft = usePostJobStore((state) => state.loadDraft);

  useEffect(() => {
    getMyJobs()
      .then((data) => {
        const activeJobs = data.filter(job => job.status !== 'DRAFT');
        setJobs(activeJobs);
        if (activeJobs.length > 0) setSelectedJobId(activeJobs[0].id);
      })
      .catch(() => toast.error("Failed to load jobs"))
      .finally(() => setLoadingJobs(false));
  }, []);

  useEffect(() => {
    if (!selectedJobId) return;
    setLoadingProposals(true);
    getProposalsByJob(selectedJobId)
      .then(setProposals)
      .catch(() => toast.error("Failed to load proposals"))
      .finally(() => setLoadingProposals(false));
  }, [selectedJobId]);

  const handleAccept = async (id) => {
    setActionLoading(id + "-accept");
    try {
      await acceptProposal(id);
      // Refetch jobs to get updated status
      const updatedJobs = await getMyJobs();
      const activeJobs = updatedJobs.filter(job => job.status !== 'DRAFT');
      setJobs(activeJobs);
      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "ACCEPTED" } : p))
      );
      toast.success("Proposal accepted! The job is now in progress.");
    } catch {
      toast.error("Failed to accept proposal");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id + "-reject");
    try {
      await rejectProposal(id);
      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "REJECTED" } : p))
      );
      toast.success("Proposal rejected.");
    } catch {
      toast.error("Failed to reject proposal");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMessageExpert = async (expertId, proposalId) => {
    setMessageLoading(proposalId);
    try {
      const result = await findOrCreateDirect(expertId);
      navigate(`/messages?conversationId=${result.conversationId}`);
    } catch {
      toast.error("Không thể mở cuộc trò chuyện");
    } finally {
      setMessageLoading(null);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  // Check if any proposal has been accepted for the selected job
  const hasAcceptedProposal = proposals.some((p) => p.status === "ACCEPTED");

  const handleEdit = () => {
    if (selectedJob) {
      loadDraft(selectedJob);
      navigate("/post-job/step-1");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job post? This action cannot be undone.")) {
      setActionLoading('delete');
      try {
        await deleteJob(selectedJobId);
        toast.success("Job post deleted successfully.");
        const remainingJobs = jobs.filter(job => job.id !== selectedJobId);
        setJobs(remainingJobs);
        if (remainingJobs.length > 0) {
          setSelectedJobId(remainingJobs[0].id);
        } else {
          setSelectedJobId(null);
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Failed to delete job post.";
        toast.error(errorMsg);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const displayedProposals = [...proposals]
    .filter((p) => statusFilter === "ALL" || p.status === statusFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case "PRICE_LOW":
          return (a.bidAmount ?? 0) - (b.bidAmount ?? 0);
        case "PRICE_HIGH":
          return (b.bidAmount ?? 0) - (a.bidAmount ?? 0);
        case "DELIVERY_FAST":
          return (a.deliveryTime ?? Infinity) - (b.deliveryTime ?? Infinity);
        case "RATING_HIGH":
          return (b.expertRating ?? 0) - (a.expertRating ?? 0);
        case "NEWEST":
        default:
          return new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0);
      }
    });

  const statusBadge = (status) => {
    if (status === "ACCEPTED") return "bg-emerald-50 text-emerald-600 border border-emerald-200";
    if (status === "REJECTED") return "bg-rose-50 text-rose-600 border border-rose-200";
    return "bg-orange-500 text-white";
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 animate-fadeIn">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a3c]">Manage Proposals</h1>
      </div>

      {/* Job selector */}
      {!loadingJobs && jobs.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedJobId(job.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                selectedJobId === job.id
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
              }`}
            >
              {job.title}
            </button>
          ))}
        </div>
      )}

      {/* Active Job Info */}
      {selectedJob && (
        <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  {selectedJob.status ?? "Active Listing"}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  Posted {new Date(selectedJob.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1a1a3c] max-w-[800px] leading-snug">
                {selectedJob.title}
              </h2>
              <div className="flex items-center gap-6 text-xs md:text-sm text-gray-500 font-semibold pt-1">
                <span>
                  💵 Budget:{" "}
                  <span className="text-[#1a1a3c] font-bold">
                    ${Number(selectedJob.budget ?? 0).toLocaleString()}
                  </span>
                </span>
                <span>
                  ⏱ Timeline:{" "}
                  <span className="text-[#1a1a3c] font-bold">
                    {selectedJob.timeline ?? "—"}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedJob && !hasAcceptedProposal && (
                <>
                  <button
                    onClick={handleEdit}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2 px-6 rounded-xl transition-colors shadow-sm min-w-[120px]"
                  >
                    Edit Job
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={actionLoading === 'delete'}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2 px-6 rounded-xl transition-colors shadow-sm min-w-[120px] disabled:opacity-50"
                  >
                    {actionLoading === 'delete' ? 'Deleting...' : 'Delete Job'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Proposals + Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proposals list */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-[#1a1a3c]">
              Proposals ({displayedProposals.length})
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative" ref={filterRef}>
                <Button
                  variant="third"
                  leftIcon={<SlidersHorizontal size={14} />}
                  onClick={() => {
                    setFilterOpen((v) => !v);
                    setSortOpen(false);
                  }}
                >
                  Filter{statusFilter !== "ALL" ? ` · ${FILTER_OPTIONS.find((o) => o.value === statusFilter)?.label}` : ""}
                </Button>
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-10">
                    {FILTER_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStatusFilter(option.value);
                          setFilterOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        {option.label}
                        {statusFilter === option.value && <Check size={14} className="text-orange-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={sortRef}>
                <Button
                  variant="third"
                  leftIcon={<ArrowUpDown size={14} />}
                  onClick={() => {
                    setSortOpen((v) => !v);
                    setFilterOpen(false);
                  }}
                >
                  Sort
                </Button>
                {sortOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-10">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        {option.label}
                        {sortBy === option.value && <Check size={14} className="text-orange-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {loadingProposals && (
            <p className="text-sm text-gray-400 py-4">Loading proposals...</p>
          )}
          {!loadingProposals && displayedProposals.length === 0 && (
            <p className="text-sm text-gray-400 py-4">No proposals match the current filter.</p>
          )}

          {displayedProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all relative"
            >
              {/* Status badge */}
              {proposal.status !== "PENDING" && (
                <div className={`absolute top-4 right-4 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusBadge(proposal.status)}`}>
                  {proposal.status}
                </div>
              )}
              {proposal.status === "PENDING" && (
                <div className="absolute top-4 right-4 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-orange-500 text-white flex items-center gap-1">
                  <Sparkles size={10} fill="currentColor" /> New
                </div>
              )}

              <div className="flex items-start gap-4">
                {proposal.expertAvatarUrl ? (
                  <img
                    src={proposal.expertAvatarUrl}
                    alt={proposal.expertName}
                    className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                    {proposal.expertName?.slice(0, 2).toUpperCase() ?? "??"}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-base text-orange-500">{proposal.expertName}</h4>
                  {proposal.expertRating && (
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-0.5">
                      <Star size={12} fill="currentColor" /> {proposal.expertRating.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>

              {proposal.coverLetter && (
                <p className="text-gray-500 text-sm italic leading-relaxed pl-2 border-l-2 border-gray-100">
                  "{proposal.coverLetter}"
                </p>
              )}

              <div className="flex flex-wrap justify-between items-center gap-4 pt-2 border-t border-gray-50">
                <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                  <span>
                    Price:{" "}
                    <span className="text-[#1a1a3c] text-sm font-black">
                      ${proposal.bidAmount?.toLocaleString()}
                    </span>
                  </span>
                  <span>
                    Duration:{" "}
                    <span className="text-[#1a1a3c] font-bold">{proposal.deliveryTime} days</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleMessageExpert(proposal.expertId, proposal.id)}
                  disabled={messageLoading === proposal.id}
                  className="flex items-center gap-1.5 text-sm text-black font-medium hover:underline disabled:opacity-50"
                >
                  {messageLoading === proposal.id ? "Đang mở..." : "Message"}
                  <ArrowRight size={14} />
                </button>
                {proposal.status === "PENDING" && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="third"
                      onClick={() => handleReject(proposal.id)}
                      disabled={!!actionLoading}
                    >
                      {actionLoading === proposal.id + "-reject" ? "..." : "Reject"}
                    </Button>
                    <Button
                      variant="primary"
                      className="px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"
                      onClick={() => handleAccept(proposal.id)}
                      disabled={!!actionLoading}
                    >
                      {actionLoading === proposal.id + "-accept" ? "..." : "Hire Expert"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison sidebar */}
        <div className="space-y-6">
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-orange-500 text-base flex items-center gap-2 mb-4">
              <span className="scale-x-[-1] inline-block">📐</span> Candidate Comparison
            </h3>
            <div className="space-y-4 mb-4">
              {proposals.slice(0, 3).map((item, index) => {
                const maxBid = Math.max(...proposals.map((p) => p.bidAmount ?? 0), 1);
                const pct = Math.round(((item.bidAmount ?? 0) / maxBid) * 100);
                return (
                  <div key={index} className="bg-white border border-gray-50 rounded-xl p-3 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.expertAvatarUrl ? (
                          <img src={item.expertAvatarUrl} alt={item.expertName} className="w-6 h-6 object-cover rounded-full" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-[9px] font-bold">
                            {item.expertName?.slice(0, 2).toUpperCase() ?? "??"}
                          </div>
                        )}
                        <h4 className="font-bold text-xs text-[#1a1a3c]">{item.expertName}</h4>
                      </div>
                      <span className="text-orange-500 font-black text-xs">
                        ${item.bidAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full bg-orange-50 rounded-full h-2 overflow-hidden">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                      <div className="text-[9px] text-gray-400 font-bold">{pct}% of top bid</div>
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium">{item.deliveryTime} days delivery</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-wider">
              <div className="p-1.5 bg-orange-500 text-white rounded-lg"><Sparkles size={12} fill="currentColor" /></div>
              AI Insights
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Review proposals carefully. Compare bid amounts, delivery timelines, and expert ratings before making your decision.
            </p>
          </div>
        </div>

        <MessagesIcon />
      </div>
    </div>
  );
}
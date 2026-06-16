import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, CheckCircle, XCircle, ArrowUpRight, Briefcase, RotateCcw } from "lucide-react";
import { getMyProposals } from "../../api/proposals";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  PENDING: {
    label: "Under Review",
    icon: <Clock size={13} />,
    cls: "bg-blue-50 text-blue-600 border-blue-200",
  },
  ACCEPTED: {
    label: "Accepted",
    icon: <CheckCircle size={13} />,
    cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  REJECTED: {
    label: "Rejected",
    icon: <XCircle size={13} />,
    cls: "bg-rose-50 text-rose-600 border-rose-200",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    icon: <RotateCcw size={13} />,
    cls: "bg-gray-100 text-gray-500 border-gray-200",
  },
};

export default function MyProposals() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    getMyProposals()
      .then(setProposals)
      .catch(() => toast.error("Failed to load proposals"))
      .finally(() => setLoading(false));
  }, []);

  const FILTER_TABS = [
    { key: "ALL", label: "All" },
    { key: "PENDING", label: "Pending" },
    { key: "ACCEPTED", label: "Accepted" },
    { key: "REJECTED", label: "Rejected" },
  ];

  const filtered =
    filter === "ALL" ? proposals : proposals.filter((p) => p.status === filter);

  const counts = {
    ALL: proposals.length,
    PENDING: proposals.filter((p) => p.status === "PENDING").length,
    ACCEPTED: proposals.filter((p) => p.status === "ACCEPTED").length,
    REJECTED: proposals.filter((p) => p.status === "REJECTED").length,
  };

  return (
    <div className="space-y-6 max-w-[900px] mx-auto animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#15153d]">
          My Proposals
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Track all proposals you have submitted
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              filter === tab.key
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
            }`}
          >
            {tab.label}
            <span
              className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                filter === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && (
        <div className="py-12 text-center text-gray-400 text-sm">
          Loading proposals...
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Briefcase size={48} className="mx-auto mb-4 text-gray-200" />
          <p className="font-bold text-gray-400">
            {filter === "ALL"
              ? "You haven't submitted any proposals yet"
              : `No proposals with status "${FILTER_TABS.find((t) => t.key === filter)?.label}"`}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Visit the{" "}
            <button
              onClick={() => navigate("/marketplace")}
              className="text-orange-500 font-bold hover:underline"
            >
              Marketplace
            </button>{" "}
            to find and apply for jobs
          </p>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((proposal) => {
          const cfg = STATUS_CONFIG[proposal.status] ?? STATUS_CONFIG.PENDING;
          return (
            <div
              key={proposal.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-orange-100 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Job info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-orange-500" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#15153d] text-base truncate">
                      {proposal.jobTitle}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Submitted {new Date(proposal.createdAt).toLocaleDateString("en-US")}
                    </p>
                  </div>
                </div>

                {/* Status badge */}
                <span
                  className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${cfg.cls}`}
                >
                  {cfg.icon}
                  {cfg.label}
                </span>
              </div>

              {/* Proposal details */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Bid Amount
                  </p>
                  <p className="font-bold text-[#15153d] text-sm mt-0.5">
                    ${Number(proposal.bidAmount ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Delivery Time
                  </p>
                  <p className="font-bold text-[#15153d] text-sm mt-0.5">
                    {proposal.deliveryTime} days
                  </p>
                </div>
              </div>

              {/* Cover letter preview */}
              {proposal.coverLetter && (
                <p className="mt-3 text-xs text-gray-500 italic leading-relaxed border-l-2 border-orange-100 pl-3 line-clamp-2">
                  "{proposal.coverLetter}"
                </p>
              )}

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                {proposal.status === "ACCEPTED" && (
                  <span className="text-xs font-bold text-emerald-600">
                    🎉 The client has accepted your proposal!
                  </span>
                )}
                {proposal.status === "REJECTED" && (
                  <span className="text-xs text-rose-400">
                    Your proposal was not selected this time.
                  </span>
                )}
                {proposal.status === "PENDING" && (
                  <span className="text-xs text-blue-400">
                    Waiting for the client to review...
                  </span>
                )}
                {proposal.status === "WITHDRAWN" && (
                  <span className="text-xs text-gray-400">
                    You have withdrawn this proposal.
                  </span>
                )}

                <button
                  onClick={() => navigate(`/jobs/${proposal.jobId}`)}
                  className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-orange-500 transition-colors ml-auto"
                >
                  View job <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

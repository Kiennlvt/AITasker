import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { getJobById } from "../../api/jobs";
import { submitProposal } from "../../api/proposals";
import { FiClock, FiUsers, FiDollarSign, FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

export default function JobDetail() {
  const { id } = useParams();
  const user = useAuthStore((s) => s.user);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [bid, setBid] = useState("");
  const [days, setDays] = useState("");
  const [cover, setCover] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getJobById(id)
      .then(setJob)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!bid || !days || !cover) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      await submitProposal({
        jobId: id,
        bidAmount: Number(bid),
        deliveryTime: Number(days),
        coverLetter: cover,
      });
      toast.success("Proposal submitted!");
      setShowApply(false);
    } catch {
      toast.error("Failed to submit proposal");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-gray-400">Loading...</div>;
  if (!job) return <div className="p-10 text-3xl font-black">Job not found</div>;

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-[#111331]">
      <section className="mx-auto grid max-w-[1180px] grid-cols-[1fr_300px] gap-8 px-8 py-10">
        <div>
          <div className="mb-5 flex items-center gap-2 text-sm">
            <Link to="/marketplace" className="font-medium text-slate-500 transition hover:text-orange-500">
              Marketplace
            </Link>
            <span className="text-slate-400">/</span>
            <span className="font-black text-[#111331]">Job Details</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <span className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {job.status ?? "OPEN"}
            </span>
            <span className="text-xs text-slate-400">
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="max-w-[680px] text-4xl font-black leading-tight tracking-tight">
            {job.title}
          </h1>

          <div className="mt-5 flex flex-wrap gap-2">
            {(job.skills ?? []).map((tag, i) => (
              <Badge key={tag} className={i === 0 ? "" : "bg-[#eef2ff] text-[#111331]"}>
                {tag}
              </Badge>
            ))}
          </div>

          <Section title="Project Description">
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{job.description}</p>
          </Section>

          <Section title="Deliverables">
            <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                Working AI solution matching the described scope.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                Technical documentation and deployment guide.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                Source code and final handoff package.
              </li>
            </ul>
          </Section>

          {/* Proposal form */}
          {user?.role === "EXPERT" && (
            <Section title="Submit a Proposal">
              {!showApply ? (
                <Button onClick={() => setShowApply(true)}>Apply for this Job</Button>
              ) : (
                <div className="space-y-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Bid Amount ($)</label>
                      <input
                        type="number"
                        value={bid}
                        onChange={(e) => setBid(e.target.value)}
                        className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"
                        placeholder="e.g. 3000"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Delivery (days)</label>
                      <input
                        type="number"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"
                        placeholder="e.g. 30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Cover Letter</label>
                    <textarea
                      value={cover}
                      onChange={(e) => setCover(e.target.value)}
                      rows={5}
                      className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 resize-none"
                      placeholder="Describe your approach, relevant experience, and why you're the right fit..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleApply} disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Proposal"}
                    </Button>
                    <button
                      onClick={() => setShowApply(false)}
                      className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </Section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-7 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
            <InfoRow label="Budget" value={`$${Number(job.budget ?? 0).toLocaleString()}`} icon={<FiDollarSign />} />
            <InfoRow
              label="Deadline"
              value={job.deadline ? new Date(job.deadline).toLocaleDateString() : "Flexible"}
              icon={<FiCalendar />}
            />
            <InfoRow label="Proposals" value={`${job.proposalCount ?? 0} received`} icon={<FiUsers />} orange />

            {user?.role === "EXPERT" && (
              <Button className="mt-6 w-full rounded-full py-4 text-base" onClick={() => setShowApply(true)}>
                Apply Now
              </Button>
            )}
            <Button className="mt-6 w-full rounded-full py-4 text-base">Apply proposal</Button>
            <Button className="mt-6 w-full rounded-full py-4 text-base" variant="secondary">Save for later</Button>
            <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <p className="flex items-center gap-2">
                <FiClock /> Posted {new Date(job.createdAt).toLocaleDateString()}
              </p>
              <p className="flex items-center gap-2">
                <FiUsers /> {job.proposalCount ?? 0} applications
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
            <h3 className="mb-5 text-sm font-black">About the Client</h3>
            <div className="flex items-center gap-3">
              {job.clientAvatarUrl ? (
                <img src={job.clientAvatarUrl} alt={job.clientName} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-base">
                  {job.clientName?.slice(0, 2).toUpperCase() ?? "??"}
                </div>
              )}
              <div>
                <p className="text-sm font-black">{job.clientName ?? "Client"}</p>
                <p className="text-[11px] text-slate-400">Verified Client</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-12">
      <h2 className="mb-5 border-b border-slate-200 pb-3 text-2xl font-black">{title}</h2>
      <div className="text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

function InfoRow({ label, value, icon, orange }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4 text-sm">
      <span className="flex items-center gap-1.5 text-slate-500">
        {icon} {label}
      </span>
      <span className={`font-black ${orange ? "text-orange-500" : "text-[#111331]"}`}>{value}</span>
    </div>
  );
}
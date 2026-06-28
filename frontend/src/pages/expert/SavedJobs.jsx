import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, BookmarkX, ExternalLink } from "lucide-react";
import { FiDollarSign, FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";
import { getSavedJobs, unsaveJob } from "../../api/savedJob";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    getSavedJobs()
      .then(setJobs)
      .catch(() => toast.error("Unable to load saved jobs"))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (jobId) => {
    setRemoving(jobId);
    try {
      await unsaveJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast.success("Removed from saved jobs");
    } catch {
      toast.error("An error occurred, please try again.");
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 animate-fadeIn text-[#1a1a3c]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Saved Jobs</h1>
          <p className="text-sm text-gray-400 mt-1">{jobs.length} job{jobs.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          to="/marketplace"
          className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
        >
          Explore more →
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 shadow-sm text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookmarkX size={28} className="text-orange-400" />
          </div>
          <h3 className="font-bold text-lg text-[#1a1a3c] mb-2">No jobs saved yet.</h3>
          <p className="text-sm text-gray-400 mb-6">
            Click "Save for Later" on a job detail page to bookmark jobs you're interested in.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-md transition-all"
          >
            Explore jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <SavedJobCard
              key={job.id}
              job={job}
              removing={removing === job.id}
              onRemove={() => handleRemove(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SavedJobCard({ job, removing, onRemove }) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-orange-100 transition-all flex flex-col p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
          {job.status ?? "OPEN"}
        </span>
        <button
          onClick={onRemove}
          disabled={removing}
          title="Remove from saved"
          className="w-8 h-8 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl flex items-center justify-center transition-all disabled:opacity-60"
        >
          {removing ? <Loader2 size={14} className="animate-spin" /> : <BookmarkX size={14} />}
        </button>
      </div>

      <h3 className="font-black text-sm text-[#1a1a3c] leading-snug line-clamp-2 flex-1 mb-3">
        {job.title}
      </h3>

      <p className="text-xs text-gray-400 line-clamp-2 mb-4">{job.description}</p>

      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="text-[10px] bg-[#eef2ff] text-[#111331] font-semibold px-2 py-0.5 rounded-full">
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="text-[10px] text-gray-400">+{job.skills.length - 3}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
        <div className="space-y-1">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <FiDollarSign size={11} />
            <span className="font-black text-orange-500">${Number(job.budget ?? 0).toLocaleString()}</span>
          </p>
          {job.deadline && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <FiCalendar size={11} />
              {new Date(job.deadline).toLocaleDateString()}
            </p>
          )}
        </div>
        <Link
          to={`/jobs/${job.id}`}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1a1a3c] hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all"
        >
          <ExternalLink size={12} />
          View Job
        </Link>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import Badge from "../ui/Badge";

export default function JobCard({ job }) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_40px_rgba(15,23,42,0.08)] flex flex-col">
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          {(job.skills ?? []).slice(0, 3).map((tag, i) => (
            <Badge key={tag} className={i === 0 ? "" : "bg-[#eef2ff] text-[#111331]"}>
              {tag}
            </Badge>
          ))}
        </div>

        <h3 className="text-lg font-black leading-tight text-[#0b1b2f] line-clamp-2 flex-1">
          {job.title}
        </h3>

        <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        <div className="mt-4 flex items-center gap-2">
          {job.clientAvatarUrl ? (
            <img src={job.clientAvatarUrl} alt={job.clientName} className="h-7 w-7 rounded-full object-cover" />
          ) : (
            <div className="h-7 w-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold">
              {job.clientName?.slice(0, 2).toUpperCase() ?? "??"}
            </div>
          )}
          <p className="text-xs text-slate-500 font-medium">{job.clientName ?? "Client"}</p>
          <span className="text-xs text-orange-500">●</span>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-medium text-slate-400">Budget</p>
            <p className="text-xl font-black text-[#0b1b2f]">
              ${Number(job.budget ?? 0).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
              <Users size={13} />
              {job.proposalCount ?? 0}
            </div>
            <Link to={`/jobs/${job.id}`}>
              <button className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md hover:bg-orange-600 transition-all">
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
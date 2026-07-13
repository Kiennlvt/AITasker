import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import Badge from "../ui/Badge";

// Ảnh nền cho job card: tone sáng, chủ đề tech/freelance, không trùng thumbnail giữa các ảnh
const techImages = [
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80", // UI/UX thiết kế
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80", // Code trên màn hình
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", // Laptop & data
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80", // Teamwork bàn làm việc
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80", // Analytics dashboard
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&q=80", // Không gian làm việc code
  "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=600&q=80", // Thiết bị công nghệ
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80", // Người viết code
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80", // Business meeting sáng
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80", // Bàn phím & màn hình
  "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80", // Kỹ sư công nghệ
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80"  // Không gian làm việc hiện đại
];

const FALLBACK_IMAGE = techImages[0];

export default function JobCard({ job, index = 0 }) {
  // Gán ảnh theo vị trí trong danh sách để 2 card liền kề luôn khác ảnh nhau
  const image = job.image || techImages[index % techImages.length];

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_40px_rgba(15,23,42,0.08)] flex flex-col">
      <div className="relative h-[155px]">
        <img
          src={image}
          alt={job.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        
        <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-black flex items-center gap-1">
          <Users size={11} />
          {job.proposalCount ?? 0}
        </div>
      </div>

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
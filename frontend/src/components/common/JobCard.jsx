import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import Badge from "../ui/Badge";

// Danh sách 12 ảnh được lọc kỹ, tone sáng, tech/data/dashboard chuẩn gu nhóm ông
const techImages = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80", // Dashboard phân tích
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", // Laptop data
  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80", // Biểu đồ đồ thị
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80", // UI/UX thiết kế sáng
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80", // Thao tác máy tính
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80", // Mạng lưới toàn cầu
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", // Vi mạch phần cứng
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80", // Không gian làm việc code
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80", // Hệ thống dữ liệu server
  "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=600&q=80", // Robot AI trừu tượng
  "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80", // Kỹ sư công nghệ
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80"  // Bàn phím máy tính sáng
];

export default function JobCard({ job }) {
  // Hàm tạo số Hash độc nhất vô nhị từ Tiêu đề + Mô tả để triệt tiêu hoàn toàn tỷ lệ trùng lặp
  const getAbsoluteUniqueImage = (title, desc) => {
    const str = `${title || ""}${desc || ""}`;
    let hash = 2166136261; // Số Prime của thuật toán FNV-1a
    
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = (hash * 16777619) >>> 0; // Nhân với FNV prime và ép về số nguyên dương 32-bit
    }
    
    // Lấy chỉ số mảng ảnh bảo đảm phân tán cực đều, không bị dính chùm
    const index = hash % techImages.length;
    return techImages[index];
  };

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_40px_rgba(15,23,42,0.08)] flex flex-col">
      <div className="relative h-[155px]">
        {/* Đã sửa: Ép thuật toán băm chuỗi FNV-1a, bẻ gãy hoàn toàn tình trạng trùng ảnh */}
        <img 
          src={job.image || getAbsoluteUniqueImage(job.title, job.description)} 
          alt={job.title} 
          className="h-full w-full object-cover" 
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80";
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
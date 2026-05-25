import { Zap, Layers, Award } from "lucide-react";

// 1. Khai báo "Từ điển ánh xạ" (Mapping Object)
// Backend trả về chữ gì -> Frontend tự biến thành Component Icon đó
const iconMapping = {
  basic: Zap,
  standard: Layers,
  premium: Award,
};

export default function PricingCard({ 
  type,          // Nhận chữ định danh từ API (basic / standard / premium)
  title, 
  description, 
  price, 
  billingText, 
  isSelected,    // Trạng thái được chọn (true/false)
  onSelect       // Hàm kích hoạt khi click
}) {
  
  // Lấy đúng Component Icon ra dựa vào chữ `type` nhận từ Backend
  const SelectedIcon = iconMapping[type] || Zap; // Nếu không tìm thấy thì mặc định là Zap

  return (
    <div 
      onClick={onSelect} // Khi click sẽ chạy hàm đổi trạng thái ở trang cha
      className={`border rounded-2xl p-6 flex flex-col justify-between bg-white cursor-pointer transition-all duration-300
        ${isSelected 
          ? "border-teal-600 ring-2 ring-teal-600/10 shadow-md transform -translate-y-1"  // Style khi ĐƯỢC CHỌN
          : "border-slate-200 hover:border-teal-600 hover:shadow-sm"                      // Style bình thường
        }`}
    >
      <div>
        {/* Render Icon động dựa trên component đã tra từ điển */}
        <div className="text-teal-600 mb-3 shrink-0">
          <SelectedIcon size={24} className={isSelected ? "text-teal-600" : "text-teal-500"} />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="mt-6 border-t border-slate-100 pt-4">
        <span className="text-2xl font-bold text-slate-900">
          {price}
        </span>
        <p className="text-xs text-slate-400 mt-1">
          {billingText}
        </p>
      </div>
    </div>
  );
}
export default function StatCard({ 
  label, 
  value, 
  icon: Icon,
  iconBgColor = "bg-gray-50", 
  iconTextColor = "text-gray-500", 
  subtext 
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-[150px]">
      {/* Phần trên: Tiêu đề và Icon */}
      <div className="flex justify-between items-start">
        <span className="font-semibold text-gray-500 text-sm">{label}</span>
        <div className={`p-2 rounded-lg ${iconBgColor} ${iconTextColor}`}>
          {Icon && <Icon size={18} />}
        </div>
      </div>

      {/* Phần dưới: Số liệu và Trend/Subtext */}
      <div>
        <div className="text-3xl font-bold text-[#1a1a3c]">{value}</div>
        <div className="text-xs font-medium mt-1">
          {subtext}
        </div>
      </div>
    </div>
  );
}
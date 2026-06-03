import React from 'react';
import { FiBriefcase, FiRefreshCw, FiDollarSign, FiArrowRight } from 'react-icons/fi';

const AdminDashboardPage = () => {
  // 1. Cấu hình 3 cái Card thống kê trên đầu ăn khớp mã màu #f97316 của nhóm
  const stats = [
    {
      title: 'Active Jobs',
      value: '1',
      subText: 'Currently in progress',
      icon: <FiBriefcase className="w-5 h-5 text-[#f97316]" />,
      bgIcon: 'bg-orange-50',
    },
    {
      title: 'Pending Review',
      value: '0',
      subText: 'Requires your attention',
      icon: <FiRefreshCw className="w-5 h-5 text-blue-500" />,
      bgIcon: 'bg-blue-50',
    },
    {
      title: 'Total Spend',
      value: '$0',
      subText: 'Total project budget',
      icon: <FiDollarSign className="w-5 h-5 text-[#f97316]" />,
      bgIcon: 'bg-orange-50', // Đổi sang đồng bộ màu cam thương hiệu của nhóm
    },
  ];

  // 2. Dữ liệu mẫu cho bảng Active Job Streams giống hệt ảnh mẫu
  const recentStreams = [
    {
      id: 1,
      projectName: 'Build NLP Chatbot for Customer Support',
      progress: '33% complete',
      expertName: 'Le Van Khoa',
      expertInitial: 'LK',
      status: 'In Progress',
      statusColor: 'bg-[#f97316]', // Đổi sang màu cam chuẩn thương hiệu
      budget: '$3,000'
    }
  ];

  return (
    <div className="space-y-8 font-sans antialiased">
      
      {/* HEADER CỦA PAGE */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Dashboard Overview</h1>
          <p className="text-sm font-bold text-slate-400 mt-1">
            Welcome back, <span className="text-[#f97316] font-black">Nguyen Van An</span>!
          </p>
        </div>
      </div>

      {/* HÀNG 3 CARD THỐNG KÊ (Bo góc mềm mại, đổ bóng nhẹ giống ảnh) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-sm font-bold text-slate-400">{stat.title}</span>
              <div className="text-4xl font-black text-[#1E293B] tracking-tight">{stat.value}</div>
              <span className="text-xs text-slate-400 font-bold block">{stat.subText}</span>
            </div>
            <div className={`p-3 rounded-xl ${stat.bgIcon} flex items-center justify-center`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* BẢNG ACTIVE JOB STREAMS (Làm giống hệt khối danh sách trong ảnh) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-[#1E293B]">Active Job Streams</h2>
          <button className="text-sm text-slate-400 hover:text-slate-600 font-bold flex items-center gap-1.5 transition-all">
            <span>View All</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-black tracking-wider text-slate-400 uppercase border-b border-slate-100 pb-3">
                <th className="pb-3">Project Name</th>
                <th className="pb-3">Assigned Expert</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[14px]">
              {recentStreams.map((stream) => (
                <tr key={stream.id} className="hover:bg-slate-50/40 transition-colors">
                  {/* Tên Project */}
                  <td className="py-5 pr-4">
                    <div className="font-black text-[#1E293B] text-[15px]">{stream.projectName}</div>
                    <div className="text-xs text-slate-400 mt-0.5 font-bold">{stream.progress}</div>
                  </td>
                  
                  {/* Chuyên gia xử lý */}
                  <td className="py-5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-[11px] font-black shadow-sm" style={{ backgroundColor: groupOrange }}>
                        {stream.expertInitial}
                      </div>
                      <span className="font-bold text-slate-700">{stream.expertName}</span>
                    </div>
                  </td>
                  
                  {/* Trạng thái công việc */}
                  <td className="py-5 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></span>
                      <span className="font-bold text-slate-700">{stream.status}</span>
                    </div>
                  </td>
                  
                  {/* Ngân sách */}
                  <td className="py-5 font-black text-[#1E293B] text-right text-[15px]">
                    {stream.budget}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KHỐI PHỤ TOP PERFORMING EXPERTS DƯỚI ĐÁY */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-wider mb-4">Top Performing Experts</h3>
        <div className="border border-dashed border-slate-200 rounded-xl py-8 text-center text-sm text-slate-400 font-bold">
          Data and performance metrics are being synthesized...
        </div>
      </div>

    </div>
  );
};

// Đặt biến màu ở ngoài để hàm render gọn gàng
const groupOrange = "#f97316";

export default AdminDashboardPage;
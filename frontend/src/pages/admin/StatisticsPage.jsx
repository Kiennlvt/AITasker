import React from 'react';
import { FiBriefcase, FiRefreshCw, FiDollarSign } from 'react-icons/fi';
import { HiOutlineUserCircle } from 'react-icons/hi2';

export default function StatisticsPage() {
  
  // Màu cam chuẩn
  const groupOrange = "#f97316";

  // Dữ liệu giả cho bảng công việc (Active Job Streams)
  const jobStreams = [
    {
      projectName: "Build NLP Chatbot for Customer Support",
      completion: 33,
      expertName: "Le Van Khoa",
      expertAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      status: "In Progress",
      budget: "$3,000",
    },
  ];

  // Các thẻ thống kê
  const stats = [
    { title: "Active Jobs", value: "1", description: "Currently in progress", icon: <FiBriefcase />, iconBg: "#FAF3F1", iconColor: groupOrange },
    { title: "Pending Review", value: "0", description: "Requires your attention", icon: <FiRefreshCw />, iconBg: "#EEF2F5", iconColor: "#2F80ED" },
    { title: "Total Spend", value: "$0", description: "Total project budget", icon: <FiDollarSign />, iconBg: "#FAF3F1", iconColor: groupOrange },
  ];

  return (
    <div className="space-y-10">
      
      {/* Tiêu đề trang & Welcome */}
      <div className="flex flex-col">
        <h2 className="text-3xl font-black text-slate-800">Dashboard Overview</h2>
        <p className="mt-1 text-sm font-bold text-slate-500">
          Welcome back, <span style={{ color: groupOrange }}>Nguyen Van An!</span>
        </p>
      </div>

      {/* 3 Thẻ thống kê */}
      <div className="grid grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-5">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}>
              {stat.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-400">{stat.title}</span>
              <h3 className="text-5xl font-black text-slate-800 mt-2">{stat.value}</h3>
              <p className="mt-2 text-xs font-bold text-slate-400">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bảng "Active Job Streams" */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-xl font-black text-slate-800">Active Job Streams</h4>
          <button className="text-sm font-bold text-slate-500 hover:text-slate-700">View All →</button>
        </div>
        
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-black text-slate-400 uppercase tracking-wider">
              <th className="pb-5">PROJECT NAME</th>
              <th className="pb-5">ASSIGNED EXPERT</th>
              <th className="pb-5">STATUS</th>
              <th className="pb-5">BUDGET</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobStreams.map((job, index) => (
              <tr key={index}>
                <td className="py-5">
                  <h5 className="font-bold text-slate-700">{job.projectName}</h5>
                  <p className="text-xs font-bold text-slate-400 mt-1">{job.completion}% complete</p>
                </td>
                <td className="py-5 flex items-center gap-3">
                    <img src={job.expertAvatar} alt={job.expertName} className="w-9 h-9 rounded-full object-cover" />
                    <span className="font-bold text-slate-600">{job.expertName}</span>
                </td>
                <td className="py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: groupOrange }}></div>
                    <span className="font-bold text-slate-700">{job.status}</span>
                  </div>
                </td>
                <td className="py-5">
                  <span className="font-black text-slate-700">{job.budget}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
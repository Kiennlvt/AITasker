import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { FiTrendingUp, FiDollarSign, FiBriefcase, FiUsers } from 'react-icons/fi';

export default function StatisticsPage() {
  const groupOrange = "#f97316";

  const revenueData = [
    { month: 'Jan', Spend: 4000, Earnings: 400 },
    { month: 'Feb', Spend: 7500, Earnings: 750 },
    { month: 'Mar', Spend: 12000, Earnings: 1200 },
    { month: 'Apr', Spend: 9000, Earnings: 900 },
    { month: 'May', Spend: 18500, Earnings: 1850 },
    { month: 'Jun', Spend: 22000, Earnings: 2200 },
  ];

  const categoryData = [
    { name: 'AI Chatbot', value: 40 },
    { name: 'Computer Vision', value: 30 },
    { name: 'LLM & Fine-tuning', value: 20 },
    { name: 'Data Engineering', value: 10 },
  ];

  const COLORS = [groupOrange, '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-8 font-sans antialiased">
      
      {/* HEADER TRANG */}
      <div className="flex flex-col">
        <h2 className="text-3xl font-black text-slate-800">System Statistics</h2>
        <p className="mt-1 text-sm font-bold text-slate-400">Báo cáo phân tích dữ liệu hoạt động và doanh thu định kỳ năm 2026.</p>
      </div>

      {/* HÀNG CARD TỔNG QUAN */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-50 text-[#f97316]"><FiDollarSign size={22} /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Platform Commission (10%)</span>
            <span className="text-xl font-black text-slate-800">$6,900</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-500"><FiTrendingUp size={22} /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Growth Rate</span>
            <span className="text-xl font-black text-slate-800">+24.5%</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500"><FiBriefcase size={22} /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Total Completed Tasks</span>
            <span className="text-xl font-black text-slate-800">142</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-500"><FiUsers size={22} /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Active Experts</span>
            <span className="text-xl font-black text-slate-800">38</span>
          </div>
        </div>
      </div>

      {/* KHU VỰC ĐỒ THỊ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Biểu đồ cột */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-black text-slate-700">Financial Performance</h3>
            <p className="text-xs font-bold text-slate-400">So sánh giữa Tổng ngân sách dự án (Spend) và Tiền hoa hồng sàn thu về (Earnings).</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px', fontSize: '13px', fontWeight: 700 }} />
                <Bar dataKey="Spend" fill={groupOrange} radius={[6, 6, 0, 0]} name="Total Project Budget ($)" />
                <Bar dataKey="Earnings" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Platform Net Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ tròn */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-700">Market Category Share</h3>
            <p className="text-xs font-bold text-slate-400">Tỷ lệ bài đăng công việc theo các mảng công nghệ AI.</p>
          </div>
          <div className="h-64 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center flex flex-col">
              <span className="text-2xl font-black text-slate-700">100%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Domain</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-500 mt-2">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="truncate">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
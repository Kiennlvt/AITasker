// src/pages/expert/DashboardPage.jsx
import { TrendingUp, Briefcase, CheckCircle, Star, ArrowUpRight, Award, ArrowRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import StatCard from "../../components/ui/StatCard";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import { allProjectsData } from "../../data/projectsMockData";
import { Link } from "react-router-dom";
import { expertTable } from "../../data/expertTable";
import {
  earningsData,
  recentProposals,
  statsData,
} from "../../data/dashboardExpertMockData";

export default function DashboardExpert() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expert Dashboard</span>
          <h1 className="text-3xl font-bold text-[#15153d] mt-1">Welcome back, Alex.</h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's what's happening with your projects today.</p>
        </div>
      </div>
      {/* 4 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
       {statsData.map((stat) => (
         <StatCard
         key={stat.id}
         label={stat.label}
         value={stat.value}
         icon={stat.icon}
         iconBgColor={stat.iconBgColor}
         iconTextColor={stat.iconTextColor}
         subtext={stat.subtext}
         />
         
       ))}
      </div>
      {/* CHART & PROPOSALS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT CHART CARD (2/3 width) */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col justify-between min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-[#15153d]">Earnings Overview</h3>
            <select className="h-9 px-8 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-500 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          
          {/* Biểu đồ diện tích mượt mà y chang ảnh gốc */}
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" h="100%">
              <AreaChart data={earningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#f97316" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorEarnings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT PROPOSALS CARD (1/3 width) */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[400px]">
          <div>
            <h3 className="font-bold text-lg text-[#15153d] mb-4">Recent Proposals</h3>
            <div className="space-y-4">
              {recentProposals.map((prop) => (
                <div key={prop.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                  <div className="min-w-0 flex-1 pr-2">
                    <h4 className="font-bold text-sm text-[#15153d] truncate">{prop.title}</h4>
                    <span className="text-xs text-gray-400 mt-0.5 block">{prop.time}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border tracking-wider shrink-0 ${prop.statusColor}`}>
                    {prop.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full h-12 border border-orange-200 hover:border-orange-500 text-orange-500 font-semibold text-sm rounded-xl mt-4 transition-all hover:bg-orange-50/30">
            View All Proposals
          </button>
        </div>
      </div>
      {/* ACTIVE PROJECTS TABLE */}
      <div>
        <DataTable 
          title="Your Active Job Streams" 
          data={allProjectsData} 
          columns={expertTable()}
        />
      </div>
    </div>
  );
}
// src/pages/expert/ProfileClient.jsx
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Star, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfileClient() {
  // 1. Dữ liệu tổng quan Client
  const clientInfo = {
    companyName: "Nexus AI Systems",
    industry: "FinTech • Healthcare • Enterprise AI",
    about: "Nexus AI Systems is a premier technology integrator specializing in the intersection of high-frequency financial modeling and predictive healthcare analytics. Founded in 2018, we leverage large-scale transformer models to optimize liquidity pools and diagnostic accuracy for Fortune 500 partners. Our mission is to bridge the gap between theoretical AI research and robust, enterprise-grade execution.",
    performance: {
      totalInvestment: "$442,800.00",
      projectsCount: 124,
      rating: "4.9"
    }
  };

  // 2. Danh sách Job đang active
  const activeJobs = [
    {
      id: "active-01",
      title: "RLHF Specialist for Healthcare LLM",
      posted: "2 days ago",
      rate: "$120 - $180 /hr",
      applicants: "6 Applicants"
    },
    {
      id: "active-02",
      title: "Quant AI: Portfolio Optimization Engine",
      posted: "1 week ago",
      rate: "Fixed $25,000",
      applicants: "14 Applicants"
    }
  ];

  // 3. Danh sách lịch sử dự án (Project History)
  const projectHistory = [
    {
      id: "hist-01",
      title: "Neural Fraud Detection v2",
      description: "Implementation of real-time anomaly detection for global transaction feeds.",
      expert: "Sarah Jenkins",
      rating: 5
    },
    {
      id: "hist-02",
      title: "Patient Triage Automation",
      description: "NLP-based triage for digital health intake platforms.",
      expert: "David Chen",
      rating: 5
    }
  ];

  // 4. Thành viên đội ngũ (Key Team Members)
  const teamMembers = [
    { name: "Dr. Elena Rodriguez", role: "Head of AI Strategy", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100" },
    { name: "Marcus Thorne", role: "CTO, Fintech Solutions", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
    { name: "Sarah Williams", role: "Operations Director", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" }
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 animate-fadeIn text-[#1a1a3c]">
      
      {/* CARD 1: BANNER TOP PROFILE */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Logo Box */}
          <div className="w-20 h-20 bg-[#1a1a3c] rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-md shrink-0">
            N
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">{clientInfo.companyName}</h1>
              <ShieldCheck size={18} className="text-orange-500" fill="currentColor" />
            </div>
            <p className="text-gray-400 text-xs font-semibold">{clientInfo.industry}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50 transition-all shadow-sm">
            Edit Profile
          </button>
          <button className="flex-1 sm:flex-none px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all">
            Manage Teams
          </button>
        </div>
      </div>

      {/* CHIA BỐ CỤC LỚN: 2 CỘT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CỘT TRÁI (Chiếm 2 Phần) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* KHỐI 1: COMPANY OVERVIEW */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-3.5">
            <h3 className="font-bold text-lg">Company Overview</h3>
            <p className="text-gray-500 text-sm leading-relaxed text-justify">
              {clientInfo.about}
            </p>
          </div>

          {/* KHỐI 2: ACTIVE JOB POSTS */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Active Job Posts</h3>
              <Link to="/projects" className="flex items-center gap-1 text-sm font-bold text-black hover:text-orange-500 transition-colors"> View All <ArrowRight size={16} /> </Link>
            </div>

            <div className="space-y-3">
              {activeJobs.map((job) => (
                <div key={job.id} className="border border-gray-100 rounded-2xl p-4 flex justify-between items-center gap-4 hover:border-orange-100 transition-all">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm hover:text-orange-500 transition-colors cursor-pointer">{job.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                      <span className="flex items-center gap-1"><Clock size={12}/> {job.posted}</span>
                      <span className="text-[#1a1a3c] font-bold">{job.rate}</span>
                    </div>
                  </div>
                  <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-3 py-1 rounded-full border border-orange-100 shrink-0">
                    {job.applicants}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* KHỐI 3: PROJECT HISTORY */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-lg">Project History</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectHistory.map((hist) => (
                <div key={hist.id} className="border border-gray-100 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-green-50 text-green-700 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-green-100">
                        Completed
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(hist.rating)].map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <h4 className="font-bold text-sm">{hist.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{hist.description}</p>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-[11px] text-gray-400 font-medium border-t border-gray-50">
                    <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                    <span>Expert: <strong className="text-[#1a1a3c]">{hist.expert}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CỘT PHẢI (Chiếm 1 Phần) */}
        <div className="space-y-6">
          
          {/* KHỐI 4: ACCOUNT PERFORMANCE (Hộp Màu Cam) */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl p-6 shadow-md space-y-6 relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-90">
              <Sparkles size={14} fill="currentColor" /> Account Performance
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-75">Total Investment</p>
              <h2 className="text-3xl font-black tracking-tight">{clientInfo.performance.totalInvestment}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-75 mb-0.5">Projects</p>
                <span className="text-xl font-black">{clientInfo.performance.projectsCount}</span>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-75 mb-0.5">Rating</p>
                <span className="text-xl font-black flex items-center gap-1">
                  {clientInfo.performance.rating} <Star size={14} fill="currentColor" className="text-amber-300 stroke-none" />
                </span>
              </div>
            </div>
          </div>

          {/* KHỐI 5: KEY TEAM MEMBERS */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-50 pb-2">
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400">Key Team Members</h3>
              <span className="text-xs font-bold text-gray-400">{teamMembers.length} Total</span>
            </div>

            <div className="space-y-4">
              {teamMembers.map((member, mIdx) => (
                <div key={mIdx} className="flex items-center gap-3">
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" />
                  <div>
                    <h4 className="font-bold text-sm text-[#1a1a3c]">{member.name}</h4>
                    <p className="text-[11px] text-gray-400 font-medium">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-2.5 mt-2 border border-gray-100 hover:border-orange-200 text-orange-500 bg-white hover:bg-orange-50/10 font-bold text-xs rounded-xl shadow-sm transition-all text-center">
              Manage Permissions
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
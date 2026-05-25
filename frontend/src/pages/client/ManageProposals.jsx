// src/pages/client/ManageProposals.jsx
import { SlidersHorizontal, ArrowUpDown, Star, MessageSquare, Sparkles, UserCheck, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MessagesIcon from "../../components/ui/MesageIcon";
import Button from "../../components/ui/Button";


export default function ManageProposals() {
  // 1. Dữ liệu Job đang tuyển (Active Listing)
  const jobInfo = {
    title: "Implement Large Language Model for Legal Document Automation",
    status: "Active Listing",
    posted: "Posted 2 days ago",
    budget: "$5,000 - $8,000",
    timeline: "3 Months"
  };

  // 2. Danh sách các Proposals bên cột trái
  const proposals = [
    {
      id: "prop-01",
      name: "Dr. Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      tag: "Elite Seller",
      match: "98% Match",
      matchClass: "bg-orange-500 text-white",
      rating: "4.9",
      reviews: "124 reviews",
      quote: `"I have successfully deployed LLMs for Magic Circle law firms using proprietary RAG pipelines. My approach for your project involves structuring a highly secure vector database paired with fine-tuned open-source models..."`,
      price: "$5,500",
      duration: "2 months",
      skills: ["PyTorch", "LangChain", "Legal AI"]
    },
    {
      id: "prop-02",
      name: "Alex Miller",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      tag: "Top Rated",
      match: "92% Match",
      matchClass: "bg-orange-500 text-white",
      rating: "5.0",
      reviews: "42 reviews",
      quote: `"Specialized in high-speed document ingestion for financial and legal services. I propose building a custom LLM interface utilizing advanced prompt-chaining compilation to optimize cost..."`,
      price: "$7,200",
      duration: "6 weeks",
      skills: ["GPT-4", "Pinecone"]
    },
    
  ];

  // 3. Danh sách so sánh ứng viên bên cột phải
  const comparisons = [
    { name: "Sarah Chen", score: "98% SCORE", price: "$5.5k", width: "w-[98%]", desc: "Best for high-accuracy requirements.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" },
    { name: "Alex Miller", score: "92% SCORE", price: "$7.2k", width: "w-[92%]", desc: "Fastest delivery timeline.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
    { name: "Raj Kumar", score: "88% SCORE", price: "$4.8k", width: "w-[88%]", desc: "Most budget-friendly option.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" }
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 animate-fadeIn">
      {/* Tiêu đề chính */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a3c]">Manage Proposals</h1>
      </div>

      {/* KHỐI 1: Thông tin chi tiết của Job đang active */}
      <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 z-10 relative">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                {jobInfo.status}
              </span>
              <span className="text-xs text-gray-400 font-medium">{jobInfo.posted}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1a1a3c] max-w-[800px] leading-snug">
              {jobInfo.title}
            </h2>
            <div className="flex items-center gap-6 text-xs md:text-sm text-gray-500 font-semibold pt-1">
              <span className="flex items-center gap-1.5">💵 Budget: <span className="text-[#1a1a3c] font-bold">{jobInfo.budget}</span></span>
              <span className="flex items-center gap-1.5">⏱ Est. Timeline: <span className="text-[#1a1a3c] font-bold">{jobInfo.timeline}</span></span>
            </div>
          </div>

          <button className="bg-orange-50 text-orange-500 border border-orange-100 px-5 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-orange-100/50 transition-all self-start md:self-center">
            Edit Job
          </button>
        </div>
      </div>

      {/* KHỐI 2: Chia 2 cột chính */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CỘT TRÁI (Chiếm 2 phần): Danh sách Proposals */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header bộ lọc */}
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-[#1a1a3c]">Proposals ({proposals.length})</h3>
            <div className="flex items-center gap-2">
              <Button variant="third"  leftIcon={<SlidersHorizontal size={14} />}>Filter</Button>
              <Button variant="third"  leftIcon={<ArrowUpDown size={14} />}>Sort</Button>
            </div>
          </div>

          {/* Vòng lặp render các Proposal Card */}
          {proposals.map((proposal) => (
            <div key={proposal.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all relative">
              
              {/* Badge % Match góc trên phải */}
              <div className={`absolute top-4 right-4 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${proposal.matchClass}`}>
                <Sparkles size={10} fill="currentColor" /> {proposal.match}
              </div>

              {/* Thông tin Expert */}
              <div className="flex items-start gap-4">
                <img src={proposal.avatar} alt={proposal.name} className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-orange-500 hover:underline cursor-pointer">{proposal.name}</h4>
                    <span className="bg-orange-50 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-orange-100">
                      {proposal.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-0.5">
                    <Star size={12} fill="currentColor" /> {proposal.rating}
                    <span className="text-gray-400 font-normal ml-1">({proposal.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Nội dung trích dẫn Proposal */}
              <p className="text-gray-500 text-sm italic leading-relaxed pl-2 border-l-2 border-gray-100">
                {proposal.quote}
              </p>

              {/* Giá cả & Thời gian & Kỹ năng kĩ thuật */}
              <div className="flex flex-wrap justify-between items-center gap-4 pt-2 border-t border-gray-50">
                <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                  <span>Price: <span className="text-[#1a1a3c] text-sm font-black">{proposal.price}</span></span>
                  <span>Duration: <span className="text-[#1a1a3c] font-bold">{proposal.duration}</span></span>
                </div>
                {/* Các tags kĩ năng */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {proposal.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="bg-slate-50 text-slate-600 border border-slate-100 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Các nút hành động */}
              <div className="flex items-center justify-between pt-2">
                <Link 
                to={`/messages`} 
                className="flex items-center gap-1.5 text-sm text-black font-medium hover:underline"
              >
                Message <ArrowRight size={14} />
              </Link>
                <div className="flex items-center gap-2">
                  <Button variant="third">View Full Proposal</Button>
                  <Button variant="primary" className="px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"> Hire Expert</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CỘT PHẢI (Chiếm 1 phần): Candidate Comparison & AI Insights */}
        <div className="space-y-6">
          
          {/* Khối Candidate Comparison */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-orange-500 text-base flex items-center gap-2 mb-4">
              <span className="scale-x-[-1] inline-block">📐</span> Candidate Comparison
            </h3>
            
            <div className="space-y-4 mb-4">
              {comparisons.map((item, index) => (
                <div key={index} className="bg-white border border-gray-50 rounded-xl p-3 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={item.img} alt={item.name} className="w-6 h-6 object-cover rounded-full" />
                      <h4 className="font-bold text-xs text-[#1a1a3c]">{item.name}</h4>
                    </div>
                    <span className="text-orange-500 font-black text-xs">{item.price}</span>
                  </div>
                  {/* Thanh Progress Score bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-orange-50 rounded-full h-2 overflow-hidden">
                      <div className={`bg-orange-500 h-full rounded-full ${item.width}`}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                      <span>{item.score}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            <button className="w-full py-2.5 border-2 border-orange-500 bg-transparent text-orange-500 font-bold text-xs rounded-xl hover:bg-orange-50 transition-all shadow-sm">
              Compare All Candidates
            </button>
          </div>

          {/* Khối AI Insights */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-wider">
              <div className="p-1.5 bg-orange-500 text-white rounded-lg"><Sparkles size={12} fill="currentColor"/></div>
              AI Insights
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Based on your requirements for <span className="text-[#1a1a3c] font-bold">"Accuracy"</span> and <span className="text-[#1a1a3c] font-bold">"Fine-tuning"</span>, <span className="text-orange-500 font-bold underline cursor-pointer">Sarah Chen</span> is the most qualified. Her previous work matches 94% of your task complexity.
            </p>
            <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs rounded-xl shadow-md hover:from-orange-600 hover:to-orange-700 transition-all">
              View Analysis Report
            </button>
          </div>

        </div>

        <MessagesIcon />

      </div>
    </div>
  );
}
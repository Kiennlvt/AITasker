import React, { useState } from 'react';
import { FiSearch, FiCheckCircle, FiXCircle, FiFilter } from 'react-icons/fi';

export default function ManageJobsPage() {
  const groupOrange = "#f97316"; // Màu cam chuẩn của nhóm ông

  const [jobs, setJobs] = useState([
    { id: 1, title: "Build NLP Chatbot for Customer Support", client: "Tran Thi Mai", email: "mai.tran@gmail.com", budget: "$3,000", category: "AI Chatbot", status: "Pending", date: "2026-06-01" },
    { id: 2, title: "Computer Vision Model for Defect Detection", client: "Nguyen Hoang Nam", email: "nam.nguyen@company.com", budget: "$5,500", category: "Computer Vision", status: "Approved", date: "2026-05-28" },
    { id: 3, title: "Fine-tune LLM for Legal Document Analysis", client: "TechCorp CEO", email: "ceo@techcorp.com", budget: "$8,000", category: "LLM & Generative AI", status: "Pending", date: "2026-06-02" },
    { id: 4, title: "Python Scraping Data for Market Research", client: "Le Van Thắng", email: "thang.le@gmail.com", budget: "$450", category: "Data Engineering", status: "Rejected", date: "2026-05-25" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleApprove = (id) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: "Approved" } : job));
  };

  const handleReject = (id) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: "Rejected" } : job));
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col">
        <h2 className="text-3xl font-black text-slate-800">Content Management</h2>
        <p className="mt-1 text-sm font-bold text-slate-400">Danh sách quản lý và phê duyệt bài đăng công việc trên hệ thống.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="text"
            placeholder="Search jobs by title or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-slate-200 rounded-xl text-sm outline-none font-medium focus:border-[#f97316] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <FiFilter className="text-slate-400" />
          <span className="text-sm font-bold text-slate-500 mr-2">Status:</span>
          {["ALL", "Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                statusFilter === status ? "text-white shadow-sm" : "text-slate-500 bg-slate-50 hover:bg-slate-100"
              }`}
              style={{ backgroundColor: statusFilter === status ? groupOrange : undefined }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="px-8 py-5">Job Details</th>
              <th className="px-6 py-5">Client (Poster)</th>
              <th className="px-6 py-5">Budget</th>
              <th className="px-6 py-5">Posted Date</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 max-w-xs">
                    <h4 className="font-black text-slate-700 text-[15px] line-clamp-1">{job.title}</h4>
                    <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                      {job.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 text-sm">{job.client}</span>
                      <span className="text-xs font-semibold text-slate-400">{job.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-black text-slate-800">{job.budget}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-500">{job.date}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-full ${
                      job.status === "Approved" ? "bg-green-50 text-green-600" :
                      job.status === "Pending" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${job.status === "Approved" ? "bg-green-500" : job.status === "Pending" ? "bg-amber-500" : "bg-red-500"}`}></span>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {job.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleApprove(job.id)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl text-xs font-black transition-all">
                          <FiCheckCircle size={14} /> Approve
                        </button>
                        <button onClick={() => handleReject(job.id)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-black transition-all">
                          <FiXCircle size={14} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-300 italic">No actions needed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-sm font-bold text-slate-400">
                  No job posts found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
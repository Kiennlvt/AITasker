import React, { useState, useEffect } from 'react';
import { FiSearch, FiCheckCircle, FiXCircle, FiFilter } from 'react-icons/fi';
import { getAdminJobs, approveJob, rejectJob } from '../../api/admin';

const STATUS_FILTERS = ["ALL", "OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const statusDisplay = {
  OPEN: { label: "Open", cls: "bg-green-50 text-green-600", dot: "bg-green-500" },
  IN_PROGRESS: { label: "In Progress", cls: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
  COMPLETED: { label: "Completed", cls: "bg-blue-50 text-blue-600", dot: "bg-blue-500" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-50 text-red-600", dot: "bg-red-500" },
  DISPUTED: { label: "Disputed", cls: "bg-purple-50 text-purple-600", dot: "bg-purple-500" },
};

export default function ManageJobsPage() {
  const groupOrange = "#f97316";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    setLoading(true);
    getAdminJobs(statusFilter)
      .then(data => setJobs(data.content ?? []))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const handleApprove = async (id) => {
    const updated = await approveJob(id);
    setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
  };

  const handleReject = async (id) => {
    const updated = await rejectJob(id);
    setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
  };

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <div className="flex items-center gap-2 flex-wrap">
          <FiFilter className="text-slate-400" />
          <span className="text-sm font-bold text-slate-500 mr-2">Status:</span>
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${statusFilter === status ? "text-white shadow-sm" : "text-slate-500 bg-slate-50 hover:bg-slate-100"
                }`}
              style={{ backgroundColor: statusFilter === status ? groupOrange : undefined }}
            >
              {status === "ALL" ? "ALL" : statusDisplay[status]?.label ?? status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm font-bold text-slate-400">Loading jobs...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="px-8 py-5">Job Details</th>
                <th className="px-6 py-5">Client</th>
                <th className="px-6 py-5">Budget</th>
                <th className="px-6 py-5">Posted Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                  const s = statusDisplay[job.status] ?? { label: job.status, cls: "bg-slate-50 text-slate-600", dot: "bg-slate-400" };
                  return (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5 max-w-xs">
                        <h4 className="font-black text-slate-700 text-[15px] line-clamp-1">{job.title}</h4>
                        <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                          {job.proposalCount} proposals
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-sm">{job.clientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-slate-800">${job.budget?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-slate-500">
                          {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-full ${s.cls}`}>
                          <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {job.status === "CANCELLED" ? (
                          <button onClick={() => handleApprove(job.id)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl text-xs font-black transition-all">
                            <FiCheckCircle size={14} /> Reopen
                          </button>
                        ) : job.status === "OPEN" ? (
                          <button onClick={() => handleReject(job.id)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-black transition-all">
                            <FiXCircle size={14} /> Cancel
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-slate-300 italic">No actions</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-sm font-bold text-slate-400">
                    No job posts found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { FiBriefcase, FiUsers, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { getAdminStats, getAdminJobs } from '../../api/admin';

const groupOrange = "#f97316";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminJobs('ALL', 0, 5)])
      .then(([s, jobs]) => {
        setStats(s);
        setRecentJobs(jobs.content ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
      {
        title: 'Active Jobs',
        value: stats.activeJobs,
        subText: 'Currently in progress',
        icon: <FiBriefcase className="w-5 h-5 text-[#f97316]" />,
        bgIcon: 'bg-orange-50',
      },
      {
        title: 'Total Users',
        value: stats.totalUsers,
        subText: 'Registered accounts',
        icon: <FiUsers className="w-5 h-5 text-blue-500" />,
        bgIcon: 'bg-blue-50',
      },
      {
        title: 'Completed Jobs',
        value: stats.completedJobs,
        subText: 'Successfully finished',
        icon: <FiCheckCircle className="w-5 h-5 text-[#f97316]" />,
        bgIcon: 'bg-orange-50',
      },
    ]
    : [];

  const statusLabel = (status) => {
    const map = {
      OPEN: 'Open',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
      DISPUTED: 'Disputed',
    };
    return map[status] ?? status;
  };

  return (
    <div className="space-y-8 font-sans antialiased">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Dashboard Overview</h1>
          <p className="text-sm font-bold text-slate-400 mt-1">
            Welcome back, <span className="text-[#f97316] font-black">Admin</span>!
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 font-bold">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statCards.map((stat, idx) => (
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

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-[#1E293B]">Recent Jobs</h2>
              <button className="text-sm text-slate-400 hover:text-slate-600 font-bold flex items-center gap-1.5 transition-all">
                <span>View All</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[11px] font-black tracking-wider text-slate-400 uppercase border-b border-slate-100">
                    <th className="pb-3">Job Title</th>
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Budget</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[14px]">
                  {recentJobs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-sm text-slate-400 font-bold">
                        No jobs yet.
                      </td>
                    </tr>
                  ) : (
                    recentJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-5 pr-4">
                          <div className="font-black text-[#1E293B] text-[15px] line-clamp-1">{job.title}</div>
                          <div className="text-xs text-slate-400 mt-0.5 font-bold">
                            {job.proposalCount} proposals
                          </div>
                        </td>
                        <td className="py-5 pr-4">
                          <div className="flex items-center gap-2.5">
                            {job.clientAvatarUrl ? (
                              <img src={job.clientAvatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-[11px] font-black" style={{ backgroundColor: groupOrange }}>
                                {job.clientName?.[0] ?? '?'}
                              </div>
                            )}
                            <span className="font-bold text-slate-700">{job.clientName}</span>
                          </div>
                        </td>
                        <td className="py-5 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></span>
                            <span className="font-bold text-slate-700">{statusLabel(job.status)}</span>
                          </div>
                        </td>
                        <td className="py-5 font-black text-[#1E293B] text-right text-[15px]">
                          ${job.budget?.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
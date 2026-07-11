import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiClock, FiDollarSign, FiEye, FiX } from 'react-icons/fi';

export default function ManageDisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, RESOLVED
  const [loading, setLoading] = useState(true);
  
  // State quản lý việc đóng mở Modal xem chi tiết bằng chứng
  const [selectedDispute, setSelectedDispute] = useState(null);

  // 1. Fetch data from backend API
  useEffect(() => {
    fetch('/api/admin/disputes')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch disputes');
        return res.json();
      })
      .then((data) => {
        setDisputes(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching disputes:', err);
        setLoading(false);
      });
  }, []);

  // 2. Resolve handler (Refund Client or Pay Expert)
  const handleResolve = (disputeId, decision) => {
    if (!window.confirm(`Are you sure you want to resolve this dispute as ${decision === 'REFUND_CLIENT' ? 'Refund to Client' : 'Pay to Expert'}?`)) return;

    fetch(`/api/admin/disputes/${disputeId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision })
    })
    .then((res) => {
      if (res.ok) {
        setDisputes(disputes.map(d => d.id === disputeId ? { ...d, status: 'RESOLVED', decision } : d));
        alert('Dispute resolved successfully!');
        setSelectedDispute(null); // Đóng modal nếu đang xử lý trong modal
      } else {
        alert('Failed to resolve dispute.');
      }
    })
    .catch((err) => alert('API Connection Error!'));
  };

  // 3. Filter logic
  const filteredDisputes = disputes.filter(d => {
    if (filter === 'ALL') return true;
    return d.status === filter;
  });

  // 4. Quick analytics calculation
  const totalPending = disputes.filter(d => d.status === 'PENDING').length;
  const totalResolved = disputes.filter(d => d.status === 'RESOLVED').length;
  
  // Tự động tính tổng tiền của các ca đang PENDING để hiển thị số tiền đang bị đóng băng
  const totalFrozenFunds = disputes
    .filter(d => d.status === 'PENDING')
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  if (loading) return <div className="p-6 text-center text-gray-500 font-medium">Loading system disputes...</div>;

  return (
    <div className="space-y-6 font-sans antialiased">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Manage Disputes</h2>
        <p className="text-sm text-gray-400 mt-1">Review evidence portfolios and issue financial arbitration verdicts.</p>
      </div>

      {/* Quick Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Frozen Contract Funds</p>
            <p className="text-2xl font-bold text-gray-700 mt-1">${totalFrozenFunds.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><FiDollarSign size={22} /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-500 font-bold tracking-wider uppercase">Pending Arbitration</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{totalPending} Cases</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><FiClock size={22} /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-green-500 font-bold tracking-wider uppercase">Resolved Verdicts</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{totalResolved} Cases</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><FiCheckCircle size={22} /></div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100 w-fit">
        {['ALL', 'PENDING', 'RESOLVED'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              filter === type 
                ? 'bg-[#ea580c] text-white shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Disputes Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold tracking-wider uppercase border-b border-gray-200">
              <th className="p-4">Project Details</th>
              <th className="p-4">Dispute Reason</th>
              <th className="p-4">Frozen Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
            {filteredDisputes.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400 font-medium">
                  No disputes found matching the criteria.
                </td>
              </tr>
            ) : (
              filteredDisputes.map((dispute) => (
                <tr key={dispute.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">Job #{dispute.projectId || 'N/A'}</span>
                      <span className="text-xs text-gray-400 font-mono mt-0.5">ID: {dispute.id}</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-700 max-w-xs truncate">{dispute.reason}</td>
                  <td className="p-4 font-bold text-gray-600">${dispute.amount ?? '0'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      dispute.status === 'PENDING' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {dispute.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedDispute(dispute)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition"
                    >
                      <FiEye size={14} /> Review Case
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= EVIDENCE ARBITRATION MODAL ================= */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2 text-gray-800">
                <FiAlertTriangle className="text-amber-500" size={20} />
                <h3 className="font-bold text-lg">Case Arbitration Review</h3>
              </div>
              <button 
                onClick={() => setSelectedDispute(null)}
                className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="text-xs font-bold text-gray-400 block uppercase">Project Contract</span>
                  <span className="text-sm font-semibold text-gray-700">Project #{selectedDispute.projectId}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 block uppercase">Escrowed Funds</span>
                  <span className="text-sm font-bold text-orange-600">${selectedDispute.amount ?? 0}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 block uppercase mb-1">Filing Party Claim Reason</span>
                <div className="bg-red-50/50 border border-red-100 p-3 rounded-xl text-sm text-gray-700 font-medium">
                  {selectedDispute.reason}
                </div>
              </div>

              {/* Evidence File Attached */}
              <div>
                <span className="text-xs font-bold text-gray-400 block uppercase mb-2">Submitted Evidence Portfolios</span>
                {selectedDispute.evidenceUrl ? (
                  <div className="border border-gray-200 rounded-xl overflow-hidden p-2 bg-gray-50 flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-500 truncate max-w-xs">{selectedDispute.evidenceUrl}</span>
                    <a 
                      href={selectedDispute.evidenceUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-3 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-600 shadow-xs"
                    >
                      Download Assets
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No external document files attached to this dispute entry.</p>
                )}
              </div>
            </div>

            {/* Modal Footer / Verdict Decision Buttons */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-bold block">Current Status</span>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{selectedDispute.status}</span>
              </div>
              
              <div className="flex gap-2">
                {selectedDispute.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => handleResolve(selectedDispute.id, 'REFUND_CLIENT')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition shadow-sm"
                    >
                      Arbitrate: Refund Client
                    </button>
                    <button
                      onClick={() => handleResolve(selectedDispute.id, 'PAY_EXPERT')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-black transition shadow-sm"
                    >
                      Arbitrate: Pay Expert
                    </button>
                  </>
                ) : (
                  <span className="text-sm font-bold text-gray-500 italic bg-gray-200/60 px-4 py-2 rounded-xl">
                    Verdict Rendered: {selectedDispute.decision === 'REFUND_CLIENT' ? 'Refunded Client' : 'Paid Expert'}
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
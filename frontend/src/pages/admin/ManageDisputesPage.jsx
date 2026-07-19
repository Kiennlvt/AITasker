import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiClock, FiDollarSign, FiEye, FiX, FiFileText } from 'react-icons/fi';
import { getAdminDisputes, resolveDispute } from '../../api/admin';
import toast from 'react-hot-toast';

const FILE_BASE = 'http://localhost:8080';

const PRESETS = [
  { label: '100% Expert', client: 0, expert: 1 },
  { label: '60/40 Expert', client: 0.4, expert: 0.6 },
  { label: '50 / 50', client: 0.5, expert: 0.5 },
  { label: '100% Client', client: 1, expert: 0 },
];

function EvidenceList({ urls }) {
  if (!urls || urls.length === 0) return <p className="text-xs text-gray-400 italic">No evidence files submitted.</p>;
  return (
    <div className="space-y-1.5">
      {urls.map((url) => {
        const filename = url.split('/').pop().replace(/^[0-9a-f-]+_/, '');
        return (
          <a
            key={url}
            href={`${FILE_BASE}${url}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors"
          >
            <FiFileText size={14} className="text-orange-400 shrink-0" />
            <span className="text-xs text-gray-700 truncate">{filename}</span>
          </a>
        );
      })}
    </div>
  );
}

export default function ManageDisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, RESOLVED
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [clientAmount, setClientAmount] = useState('');
  const [expertAmount, setExpertAmount] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolving, setResolving] = useState(false);

  const loadDisputes = (status = filter) => {
    setLoading(true);
    getAdminDisputes(status)
      .then(setDisputes)
      .catch(() => toast.error('Failed to load disputes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDisputes(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const openCase = (dispute) => {
    setSelectedDispute(dispute);
    setClientAmount('');
    setExpertAmount('');
    setResolutionNote('');
  };

  const applyPreset = (preset) => {
    const total = selectedDispute.amount ?? 0;
    const client = Number((total * preset.client).toFixed(2));
    const expert = Number((total - client).toFixed(2));
    setClientAmount(client.toFixed(2));
    setExpertAmount(expert.toFixed(2));
  };

  const sum = (Number(clientAmount) || 0) + (Number(expertAmount) || 0);
  const totalAmount = selectedDispute?.amount ?? 0;
  const sumMatches = Math.abs(sum - totalAmount) < 0.01;

  const handleResolve = async () => {
    if (!sumMatches) {
      toast.error(`Client + Expert amounts must sum to $${totalAmount.toLocaleString()}`);
      return;
    }
    setResolving(true);
    try {
      const updated = await resolveDispute(selectedDispute.id, {
        clientAmount: Number(clientAmount) || 0,
        expertAmount: Number(expertAmount) || 0,
        resolutionNote: resolutionNote.trim() || null,
      });
      setDisputes((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setSelectedDispute(updated);
      toast.success('Dispute resolved!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to resolve dispute');
    } finally {
      setResolving(false);
    }
  };

  const filteredDisputes = disputes;
  const totalPending = disputes.filter((d) => d.status === 'PENDING').length;
  const totalResolved = disputes.filter((d) => d.status === 'RESOLVED').length;
  const totalFrozenFunds = disputes
    .filter((d) => d.status === 'PENDING')
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  if (loading) return <div className="p-6 text-center text-gray-500 font-medium">Loading system disputes...</div>;

  return (
    <div className="space-y-6 font-sans antialiased">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Manage Disputes</h2>
        <p className="text-sm text-gray-400 mt-1">Review evidence portfolios and issue financial arbitration verdicts.</p>
      </div>

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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold tracking-wider uppercase border-b border-gray-200">
              <th className="p-4">Project / Milestone</th>
              <th className="p-4">Filed By</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
            {filteredDisputes.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400 font-medium">
                  No disputes found matching the criteria.
                </td>
              </tr>
            ) : (
              filteredDisputes.map((dispute) => (
                <tr key={dispute.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">{dispute.jobTitle || 'N/A'}</span>
                      <span className="text-xs text-gray-400 mt-0.5">{dispute.milestoneTitle}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-gray-500">{dispute.filedByName}</td>
                  <td className="p-4 font-medium text-gray-700 max-w-xs truncate">{dispute.reason}</td>
                  <td className="p-4 font-bold text-gray-600">${(dispute.amount ?? 0).toLocaleString()}</td>
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
                      onClick={() => openCase(dispute)}
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

      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
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

            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="text-xs font-bold text-gray-400 block uppercase">Project / Milestone</span>
                  <span className="text-sm font-semibold text-gray-700">{selectedDispute.jobTitle} — {selectedDispute.milestoneTitle}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 block uppercase">Disputed Amount</span>
                  <span className="text-sm font-bold text-orange-600">${(selectedDispute.amount ?? 0).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 block uppercase mb-1">
                  Filed by {selectedDispute.filedByName} (against {selectedDispute.respondentName})
                </span>
                <div className="bg-red-50/50 border border-red-100 p-3 rounded-xl text-sm text-gray-700 font-medium">
                  {selectedDispute.reason}
                </div>
                <div className="mt-2">
                  <EvidenceList urls={selectedDispute.evidenceUrls} />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 block uppercase mb-1">
                  Response from {selectedDispute.respondentName}
                </span>
                {selectedDispute.respondentResponse ? (
                  <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl text-sm text-gray-700 font-medium">
                    {selectedDispute.respondentResponse}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No response submitted yet.</p>
                )}
                <div className="mt-2">
                  <EvidenceList urls={selectedDispute.respondentEvidenceUrls} />
                </div>
              </div>

              {selectedDispute.status === 'PENDING' ? (
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <span className="text-xs font-bold text-gray-400 block uppercase">Arbitration Verdict</span>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => applyPreset(preset)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold transition"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">Refund to Client ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={clientAmount}
                        onChange={(e) => setClientAmount(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">Pay to Expert ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={expertAmount}
                        onChange={(e) => setExpertAmount(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>
                  {!sumMatches && (clientAmount !== '' || expertAmount !== '') && (
                    <p className="text-[11px] font-semibold text-red-500">
                      Amounts must sum to ${totalAmount.toLocaleString()} (currently ${sum.toLocaleString()}).
                    </p>
                  )}
                  <textarea
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Resolution note (visible to both parties)..."
                    className="w-full p-3 border border-gray-200 rounded-xl text-xs outline-none focus:border-orange-400 min-h-[70px] resize-none"
                  />
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-4">
                  <span className="text-xs font-bold text-gray-400 block uppercase mb-1">Verdict Rendered</span>
                  <p className="text-sm text-gray-700">
                    Client: ${(selectedDispute.clientAmount ?? 0).toLocaleString()} · Expert: ${(selectedDispute.expertAmount ?? 0).toLocaleString()}
                  </p>
                  {selectedDispute.resolutionNote && (
                    <p className="text-xs text-gray-500 mt-1 italic">{selectedDispute.resolutionNote}</p>
                  )}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-bold block">Current Status</span>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{selectedDispute.status}</span>
              </div>

              {selectedDispute.status === 'PENDING' && (
                <button
                  onClick={handleResolve}
                  disabled={resolving || !sumMatches}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black transition shadow-sm disabled:opacity-50"
                >
                  {resolving ? 'Resolving...' : 'Confirm Verdict'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

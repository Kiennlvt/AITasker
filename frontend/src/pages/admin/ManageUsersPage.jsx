import React, { useState, useEffect } from 'react';
import { FiSearch, FiUserCheck, FiUserX, FiFilter } from 'react-icons/fi';
import { getAdminUsers, toggleUserStatus } from '../../api/admin';

export default function ManageUsersPage() {
  const groupOrange = "#f97316";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {
    getAdminUsers(roleFilter)
      .then(setUsers)
      .finally(() => setLoading(false));
  }, [roleFilter]);

  const handleToggleStatus = async (id) => {
    const updated = await toggleUserStatus(id);
    setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, isActive: updated.isActive } : u));
  };

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col">
        <h2 className="text-3xl font-black text-slate-800">User Management</h2>
        <p className="mt-1 text-sm font-bold text-slate-400">List of Client and AI Expert accounts on the system.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-slate-200 rounded-xl text-sm outline-none font-medium focus:border-[#f97316] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <FiFilter className="text-slate-400" />
          <span className="text-sm font-bold text-slate-500 mr-2">Filter Role:</span>
          {["ALL", "CLIENT", "EXPERT"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${roleFilter === role ? "text-white shadow-sm" : "text-slate-500 bg-slate-50 hover:bg-slate-100"
                }`}
              style={{ backgroundColor: roleFilter === role ? groupOrange : undefined }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm font-bold text-slate-400">Loading users...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="px-8 py-5">User Info</th>
                <th className="px-6 py-5">Role</th>
                <th className="px-6 py-5">Joined Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 flex items-center gap-4">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.fullName} className="w-11 h-11 rounded-xl border border-slate-100 object-cover shadow-xs" />
                      ) : (
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-base" style={{ backgroundColor: groupOrange }}>
                          {user.fullName?.[0] ?? '?'}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-black text-slate-700 text-[15px]">{user.fullName}</span>
                        <span className="text-xs font-bold text-slate-400 mt-0.5">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-lg text-xs font-black tracking-wide"
                        style={{
                          backgroundColor: user.role === "EXPERT" ? "#FFF2E6" : "#EDF2F7",
                          color: user.role === "EXPERT" ? groupOrange : "#4A5568"
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-full ${user.isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500"}`}></span>
                        {user.isActive ? "Active" : "Banned"}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs ${user.isActive
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                      >
                        {user.isActive ? (
                          <><FiUserX size={14} /> Ban User</>
                        ) : (
                          <><FiUserCheck size={14} /> Unban User</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-sm font-bold text-slate-400">
                    No users found matching your criteria.
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
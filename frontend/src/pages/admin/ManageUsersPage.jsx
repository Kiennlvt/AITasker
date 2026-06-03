import React, { useState } from 'react';
import { FiSearch, FiUserCheck, FiUserX, FiFilter } from 'react-icons/fi';

export default function ManageUsersPage() {
  const groupOrange = "#f97316";

  // Giả lập dữ liệu danh sách tài khoản đổ từ database lên (Client và Expert)
  const [users, setUsers] = useState([
    { id: 1, name: "Le Van Khoa", email: "khoa.le@aitasker.com", phone: "0901234567", role: "EXPERT", status: "Active", joinDate: "2026-05-15", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, name: "Tran Thi Mai", email: "mai.tran@gmail.com", phone: "0918765432", role: "CLIENT", status: "Active", joinDate: "2026-05-20", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 3, name: "Nguyen Hoang Nam", email: "nam.nguyen@company.com", phone: "0983332211", role: "CLIENT", status: "Banned", joinDate: "2026-05-22", avatar: "https://randomuser.me/api/portraits/men/85.jpg" },
    { id: 4, name: "Dr. AI Expert", email: "expert.ai@aitasker.com", phone: "0977665544", role: "EXPERT", status: "Active", joinDate: "2026-05-28", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Hàm xử lý Banned / Unbanned tài khoản trực tiếp trên giao diện
  const toggleStatus = (id) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        const newStatus = user.status === "Active" ? "Banned" : "Active";
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  // Logic lọc và tìm kiếm người dùng
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      {/* 1. Tiêu đề trang */}
      <div className="flex flex-col">
        <h2 className="text-3xl font-black text-slate-800">User Management</h2>
        <p className="mt-1 text-sm font-bold text-slate-400">Danh sách tài khoản Client và AI Expert trên hệ thống.</p>
      </div>

      {/* 2. Thanh công cụ: Tìm kiếm & Bộ lọc (Filter) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        {/* Ô tìm kiếm */}
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-slate-200 rounded-xl text-sm outline-none font-medium focus:border-[#E67E22] transition-colors"
          />
        </div>

        {/* Nút lọc Role nhanh */}
        <div className="flex items-center gap-2">
          <FiFilter className="text-slate-400" />
          <span className="text-sm font-bold text-slate-500 mr-2">Filter Role:</span>
          {["ALL", "CLIENT", "EXPERT"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                roleFilter === role
                  ? "text-white shadow-sm"
                  : "text-slate-500 bg-slate-50 hover:bg-slate-100"
              }`}
              style={{
                backgroundColor: roleFilter === role ? groupOrange : undefined
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Bảng danh sách người dùng (User Table) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="px-8 py-5">User Info</th>
              <th className="px-6 py-5">Phone</th>
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
                  {/* Cột thông tin cá nhân kèm Avatar */}
                  <td className="px-8 py-4 flex items-center gap-4">
                    <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-xl border border-slate-100 object-cover shadow-xs" />
                    <div className="flex flex-col">
                      <span className="font-black text-slate-700 text-[15px]">{user.name}</span>
                      <span className="text-xs font-bold text-slate-400 mt-0.5">{user.email}</span>
                    </div>
                  </td>
                  {/* Cột Số điện thoại */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-600">{user.phone}</span>
                  </td>
                  {/* Cột Role (Client bọc màu xám, Expert bọc màu cam nhạt) */}
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
                  {/* Cột Ngày tham gia */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-500">{user.joinDate}</span>
                  </td>
                  {/* Cột Trạng thái tài khoản */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-full ${
                      user.status === "Active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${user.status === "Active" ? "bg-green-500" : "bg-red-500"}`}></span>
                      {user.status}
                    </span>
                  </td>
                  {/* Cột nút Hành động (Ban / Unban) */}
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs ${
                        user.status === "Active"
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {user.status === "Active" ? (
                        <>
                          <FiUserX size={14} /> Ban User
                        </>
                      ) : (
                        <>
                          <FiUserCheck size={14} /> Unban User
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-sm font-bold text-slate-400">
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
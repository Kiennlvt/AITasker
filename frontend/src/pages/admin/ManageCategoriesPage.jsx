import React, { useEffect, useState } from 'react';
import {
  FiGrid, FiCheckCircle, FiBriefcase, FiUsers,
  FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiX,
  FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  getAdminCategories, getAdminCategoryStats,
  createCategory, updateCategory, toggleCategory, deleteCategory,
} from '../../api/adminCategories';

const groupOrange = "#f97316";
const PAGE_SIZE = 10;

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const load = () => {
    setLoading(true);
    Promise.all([getAdminCategories(), getAdminCategoryStats()])
      .then(([cats, s]) => {
        setCategories(cats);
        setStats(s);
      })
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const statCards = stats
    ? [
      { title: 'Total Categories', value: stats.totalCategories, icon: <FiGrid className="w-5 h-5 text-[#f97316]" />, bgIcon: 'bg-orange-50' },
      { title: 'Active Categories', value: stats.activeCategories, icon: <FiCheckCircle className="w-5 h-5 text-blue-500" />, bgIcon: 'bg-blue-50' },
      { title: 'Services Tagged', value: stats.totalServices, icon: <FiBriefcase className="w-5 h-5 text-[#f97316]" />, bgIcon: 'bg-orange-50' },
      { title: 'Jobs Tagged', value: stats.totalJobs, icon: <FiUsers className="w-5 h-5 text-blue-500" />, bgIcon: 'bg-blue-50' },
    ]
    : [];

  const filteredCategories = categories.filter((cat) => {
    if (statusFilter === 'ACTIVE') return cat.isActive;
    if (statusFilter === 'INACTIVE') return !cat.isActive;
    return true;
  });

  const statusFilters = [
    { key: 'ALL', label: 'All' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'INACTIVE', label: 'Inactive' },
  ];

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginatedCategories = filteredCategories.slice(
    (currentPageSafe - 1) * PAGE_SIZE,
    currentPageSafe * PAGE_SIZE
  );

  const handleStatusFilterChange = (key) => {
    setStatusFilter(key);
    setCurrentPage(1);
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm({ name: '', description: '' });
    setShowForm(true);
  };

  const openEditForm = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description || '' });
    setShowForm(true);
  };

  const closeForm = () => {
setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateCategory(editingId, form);
        toast.success('Category updated');
      } else {
        await createCategory(form);
        toast.success('Category created');
      }
      closeForm();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await toggleCategory(id);
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: updated.isActive } : c)));
    } catch {
      toast.error('Failed to update category status');
    }
  };

  const handleDelete = async (cat) => {
    const usage = cat.serviceCount + cat.jobCount;
    const message = usage > 0
      ? `"${cat.name}" is used by ${cat.serviceCount} service(s) and ${cat.jobCount} job(s). Delete anyway?`
      : `Delete "${cat.name}"?`;
    if (!window.confirm(message)) return;
    try {
      await deleteCategory(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      toast.success('Category deleted');
    } catch {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="space-y-8 font-sans antialiased">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Category Management</h1>
          <p className="text-sm font-bold text-slate-400 mt-1">
            Manage the categories experts and clients pick from across the platform.
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black text-white shadow-sm transition-all"
          style={{ backgroundColor: groupOrange }}
        >
          <FiPlus size={16} /> New Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 font-bold">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {statCards.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start">
                <div className="space-y-2">
                  <span className="text-sm font-bold text-slate-400">{stat.title}</span>
                  <div className="text-4xl font-black text-[#1E293B] tracking-tight">{stat.value}</div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgIcon} flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
))}
          </div>

          <div className="flex items-center gap-2">
            {statusFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => handleStatusFilterChange(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-colors ${
                  statusFilter === f.key
                    ? 'text-white shadow-sm'
                    : 'text-slate-500 bg-white border border-slate-200 hover:bg-slate-50'
                }`}
                style={statusFilter === f.key ? { backgroundColor: groupOrange } : undefined}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="px-8 py-5">Name</th>
                  <th className="px-6 py-5"># Services</th>
                  <th className="px-6 py-5"># Jobs</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Created</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCategories.length > 0 ? (
                  paginatedCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="font-black text-slate-700 text-[15px]">{cat.name}</div>
                        {cat.description && (
                          <div className="text-xs font-bold text-slate-400 mt-0.5 line-clamp-1">{cat.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-600">{cat.serviceCount}</td>
                      <td className="px-6 py-4 font-bold text-slate-600">{cat.jobCount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-full ${cat.isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                          <span className={`w-2 h-2 rounded-full ${cat.isActive ? "bg-green-500" : "bg-red-500"}`}></span>
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-500">
                          {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : '—'}
                        </span>
</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditForm(cat)}
                            title="Edit"
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleToggle(cat.id)}
                            title={cat.isActive ? "Deactivate" : "Activate"}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                          >
                            {cat.isActive ? <FiToggleRight size={15} /> : <FiToggleLeft size={15} />}
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
                            title="Delete"
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-sm font-bold text-slate-400">
                      {statusFilter === 'ALL' ? 'No categories yet. Create one to get started.' : 'No categories match this filter.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredCategories.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-400">
                Showing {(currentPageSafe - 1) * PAGE_SIZE + 1}-
                {Math.min(currentPageSafe * PAGE_SIZE, filteredCategories.length)} of {filteredCategories.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPageSafe === 1}
                  className="p-2 rounded-lg text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-black transition-colors ${
                      currentPageSafe === page
? 'text-white shadow-sm'
                        : 'text-slate-500 bg-white border border-slate-200 hover:bg-slate-50'
                    }`}
                    style={currentPageSafe === page ? { backgroundColor: groupOrange } : undefined}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPageSafe === totalPages}
                  className="p-2 rounded-lg text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          onClick={closeForm}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl space-y-4 w-full max-w-lg"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#1E293B]">
                {editingId ? 'Edit Category' : 'New Category'}
              </h3>
              <button type="button" onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                <FiX size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-xs font-black text-slate-500 uppercase tracking-wide">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Computer Vision"
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-slate-200 rounded-xl text-sm outline-none font-medium focus:border-[#f97316] transition-colors"
                />
              </div>
              <div>
                <label className="block mb-2 text-xs font-black text-slate-500 uppercase tracking-wide">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Optional short description"
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-slate-200 rounded-xl text-sm outline-none font-medium focus:border-[#f97316] transition-colors"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
onClick={closeForm}
                className="px-5 py-2.5 rounded-xl text-sm font-black text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-sm font-black text-white shadow-sm disabled:opacity-60 transition-all"
                style={{ backgroundColor: groupOrange }}
              >
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

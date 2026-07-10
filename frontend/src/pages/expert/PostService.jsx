import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createService } from "../../api/services";
import useCategories from "../../hooks/useCategories";

export default function PostService() {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryDays: "",
    tags: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.price || !form.deliveryDays) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        deliveryDays: Number(form.deliveryDays),
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        imageUrl: form.imageUrl || null,
      };
      await createService(payload);
      toast.success("Đã đăng dịch vụ thành công!");
      navigate("/services");
    } catch {
      toast.error("Không thể đăng dịch vụ, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="mb-2 text-xs text-slate-500">
          Expert / <span className="font-black text-slate-800">Post Service</span>
        </p>
        <h1 className="text-3xl font-bold text-[#15153d]">Post a New Service</h1>
        <p className="mt-2 text-sm text-slate-500">Showcase your AI expertise and start receiving orders.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
        <div className="bg-[#f0f4ff] px-8 py-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#15153d]">Service Details</h2>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-sm text-[#15153d]">
              Service Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Fine-tune LLM for your business use case"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm text-[#15153d]">
Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe what you offer, your approach, and expected outcomes..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-sm text-[#15153d]">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors bg-white"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-sm text-[#15153d]">
                Price (USD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min={1}
                placeholder="e.g. 500"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-sm text-[#15153d]">
                Delivery Days <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="deliveryDays"
                value={form.deliveryDays}
                onChange={handleChange}
                min={1}
                placeholder="e.g. 7"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-sm text-[#15153d]">Tags</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="NLP, Python, GPT-4 (comma separated)"
className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm text-[#15153d]">Image URL (optional)</label>
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="px-8 pb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm"
          >
            {loading ? "Posting..." : "Post Service"}
          </button>
        </div>
      </form>
    </div>
  );
}

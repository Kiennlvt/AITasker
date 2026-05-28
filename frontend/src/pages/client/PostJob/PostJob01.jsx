import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import StepBar from "../../../components/ui/StepBar";
import usePostJobStore from "../../../store/postJobStore";

export default function PostJob() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  let currentStep = 1;
  if (path.includes("step-2")) currentStep = 2;
  if (path.includes("step-3")) currentStep = 3;

  const store = usePostJobStore();
  const [title, setTitle] = useState(store.title);
  const [category, setCategory] = useState(store.category);
  const [timelineAmount, setTimelineAmount] = useState(store.timelineAmount);
  const [timelineUnit, setTimelineUnit] = useState(store.timelineUnit);
  const [description, setDescription] = useState(store.description);

  const handleNext = () => {
    store.updateStep1({ title, category, timelineAmount, timelineUnit, description });
    navigate("/post-job/step-2");
  };

  return (
    <div>
      <StepBar currentStep={currentStep} />

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
        <div className="bg-[#f4f6ff] px-8 py-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-[#15153d]">Job Information</h2>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <label className="block mb-3 font-semibold text-[#15153d]">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Machine Learning Engineer for NLP Project"
              className="w-full h-[65px] px-5 rounded-2xl border border-gray-300 outline-none focus:border-orange-400"
            />
          </div>

          <div className="mb-8">
            <label className="block mb-3 font-semibold text-[#15153d]">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-[65px] px-5 rounded-2xl border border-gray-300 outline-none focus:border-orange-400"
            >
              <option>Natural Language Processing</option>
              <option>Computer Vision</option>
              <option>Automation</option>
              <option>AI Chatbot</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="block mb-3 font-semibold text-[#15153d]">Thời hạn mong muốn</label>
            <div className="flex gap-4">
              <input
                type="number"
                value={timelineAmount}
                onChange={(e) => setTimelineAmount(e.target.value)}
                placeholder="Nhập số..."
                className="flex-1 h-[65px] px-5 rounded-2xl border border-gray-300 outline-none focus:border-orange-400"
              />
              <select
                value={timelineUnit}
                onChange={(e) => setTimelineUnit(e.target.value)}
                className="w-[160px] h-[65px] px-5 rounded-2xl border border-gray-300 outline-none focus:border-orange-400"
              >
                <option>Tháng</option>
                <option>Tuần</option>
                <option>Ngày</option>
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label className="block mb-3 font-semibold text-[#15153d]">Detailed Description</label>
            <textarea
              rows={7}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the scope, objectives, and specific challenges of this task..."
              className="w-full p-5 rounded-2xl border border-gray-300 outline-none resize-none focus:border-orange-400"
            />
            <p className="text-sm text-gray-400 mt-3">
              Pro tip: Be specific about technical requirements for better matching.
            </p>
          </div>

          <div className="mb-12">
            <label className="block mb-3 font-semibold text-[#15153d]">
              Tải lên hình ảnh hoặc tài liệu mẫu
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-3xl h-[220px] flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">☁️</div>
              <h3 className="font-semibold text-lg text-[#15153d]">Tải lên hình ảnh hoặc tài liệu mẫu</h3>
              <p className="text-gray-400 mt-2">PNG, JPG, PDF (tối đa 10MB)</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="secondary" type="button" onClick={() => navigate("/marketplace")}>
              Cancel
            </Button>
            <Button variant="primary" type="button" onClick={handleNext}>
              Next: Budget & Timeline →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
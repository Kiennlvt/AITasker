import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import StepBar from "../../../components/ui/StepBar";
export default function PostJob() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  let currentStep = 1;
  if (path.includes("step-2")) currentStep = 2;
  if (path.includes("step-3")) currentStep = 3;

  return (
    
    <div>
       <StepBar currentStep={currentStep} />

      {/* FORM CARD */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
        {/* CARD HEADER */}
        <div className="bg-[#f4f6ff] px-8 py-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-[#15153d]">
            Job Information
          </h2>
        </div>

        {/* CARD BODY */}
        <div className="p-8">
          {/* JOB TITLE */}
          <div className="mb-8">
            <label className="block mb-3 font-semibold text-[#15153d]">
              Job Title
            </label>

            <input
              type="text"
              placeholder="e.g. Senior Machine Learning Engineer for NLP Project"
              className="w-full h-[65px] px-5 rounded-2xl border border-gray-300 outline-none focus:border-orange-400"
            />
          </div>

          {/* CATEGORY */}
          <div className="mb-8">
            <label className="block mb-3 font-semibold text-[#15153d]">
              Category
            </label>

            <select className="w-full h-[65px] px-5 rounded-2xl border border-gray-300 outline-none focus:border-orange-400">
              <option>Natural Language Processing</option>
              <option>Computer Vision</option>
              <option>Automation</option>
              <option>AI Chatbot</option>
            </select>
          </div>

          {/* TIMELINE */}
          <div className="mb-8">
            <label className="block mb-3 font-semibold text-[#15153d]">
              Thời hạn mong muốn
            </label>

            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Nhập số..."
                className="flex-1 h-[65px] px-5 rounded-2xl border border-gray-300 outline-none focus:border-orange-400"
              />

              <select className="w-[160px] h-[65px] px-5 rounded-2xl border border-gray-300 outline-none focus:border-orange-400">
                <option>Tháng</option>
                <option>Tuần</option>
                <option>Ngày</option>
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-8">
            <label className="block mb-3 font-semibold text-[#15153d]">
              Detailed Description
            </label>

            <textarea
              rows={7}
              placeholder="Describe the scope, objectives, and specific challenges of this task..."
              className="w-full p-5 rounded-2xl border border-gray-300 outline-none resize-none focus:border-orange-400"
            ></textarea>

            <p className="text-sm text-gray-400 mt-3">
              Pro tip: Be specific about technical requirements for better
              matching.
            </p>
          </div>

          {/* UPLOAD */}
          <div className="mb-12">
            <label className="block mb-3 font-semibold text-[#15153d]">
              Tải lên hình ảnh hoặc tài liệu mẫu
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-3xl h-[220px] flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">☁️</div>

              <h3 className="font-semibold text-lg text-[#15153d]">
                Tải lên hình ảnh hoặc tài liệu mẫu
              </h3>

              <p className="text-gray-400 mt-2">
                PNG, JPG, PDF (tối đa 10MB)
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between">
            <Button variant="secondary" type="button" onClick={() => navigate("/marketplace")}> Cancel</Button>

            <Button variant="primary" type="button" onClick={() => navigate("/post-job/step-2")}> Next: Budget & Timeline → </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
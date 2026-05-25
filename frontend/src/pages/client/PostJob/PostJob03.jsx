// src/pages/client/PostJob/PostJob03.jsx
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import StepBar from "../../../components/ui/StepBar";

export default function PostJob03() {
  const navigate = useNavigate();

  // Hàm xử lý khi bấm Đăng việc
  const handlePostJobNow = () => {
    alert("Chúc mừng! Bạn đã đăng dự án thành công.");
    navigate("/dashboard"); // Hoặc chuyển về danh sách công việc tùy logic của bạn
  };

  const location = useLocation();
  const path = location.pathname;
  let currentStep = 1;
  if (path.includes("step-2")) currentStep = 2;
  if (path.includes("step-3")) currentStep = 3;

  return (
    <>
     <StepBar    currentStep={currentStep} />
      {/* CARD HEADER */}
      <div className="bg-[#f4f6ff] px-8 py-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#15153d]">
            Requirement Document
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Generate a technical PRD from your draft details.
          </p>
        </div>

        {/* NÚT OPTIMIZE WITH AI */}
        <button
          type="button"
          className="bg-[#027a89] hover:bg-[#02636f] transition-all text-white px-5 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 shadow-sm"
        >
          <span className="text-base">✨</span> Optimize with AI
        </button>
      </div>

      {/* CARD BODY */}
      <div className="p-8">
        {/* KHUNG EDITABLE DOCUMENT */}
        <div className="border border-gray-300 rounded-3xl p-6 relative bg-white shadow-inner max-w-4xl mx-auto">
          {/* Nhãn Editable Document đè lên viền */}
          <span className="absolute -top-3 left-8 bg-white px-3 text-sm font-semibold text-[#027a89] flex items-center gap-1 border border-gray-200 rounded-full py-0.5 shadow-sm">
            📝 Editable Document
          </span>

          {/* Vùng hiển thị / chỉnh sửa nội dung PRD */}
          <div className="mt-4 text-gray-700 font-mono text-sm leading-relaxed space-y-6 overflow-y-auto max-h-[500px] pr-2">
            <div>
              <h3 className="text-lg font-bold text-[#15153d] mb-2">
                # Project Overview: Medical LLM Fine-Tuning
              </h3>
              <p>
                The objective is to fine-tune a Llama-3-70B model on a curated
                dataset of HIPAA-compliant medical research papers.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#15153d] mb-1">
                ## Technical Requirements
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong className="font-semibold text-gray-900">
                    **Architecture**:
                  </strong>{" "}
                  Retrieval-Augmented Generation (RAG) implementation required.
                </li>
                <li>
                  <strong className="font-semibold text-gray-900">
                    **Hardware**:
                  </strong>{" "}
                  Must be optimized for A100/H100 clusters.
                </li>
                <li>
                  <strong className="font-semibold text-gray-900">
                    **Evaluation**:
                  </strong>{" "}
                  Implement MMLU (Medical) and HumanEval metrics.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#15153d] mb-1">
                ## Scope of Work
              </h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Pre-processing 14TB of raw medical text.</li>
                <li>Tokenization and hyperparameter optimization.</li>
                <li>LoRA/QLoRA adaptation for memory efficiency.</li>
                <li>Final validation and API integration.</li>
              </ol>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#15153d] mb-1">
                ## Candidate Expectations
              </h3>
              <p>
                Elite researchers with published work in bio-informatics or
                transformer optimization are preferred.
              </p>
            </div>
          </div>
        </div>

        {/* HAI HÌNH ẢNH MINH HỌA PHÍA DƯỚI (Như trong thiết kế) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden h-[160px] group shadow-md">
            <img
              src="https://images.unsplash.com/photo-1639322537228-f710d846310a?w=500&auto=format&fit=crop&q=60"
              alt="Precision matching"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5">
              <span className="text-white font-medium text-xs sm:text-sm">
                Precision matching with AI talent pools
              </span>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-[160px] group shadow-md">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60"
              alt="Automated scope"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5">
              <span className="text-white font-medium text-xs sm:text-sm">
                Automated scope-of-work generation
              </span>
            </div>
          </div>
        </div>

        {/* NÚT ĐIỀU HƯỚNG DƯỚI CÙNG */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
          {/* Nút quay lại bước 2 */}
          <button
            type="button"
            onClick={() => navigate("/post-job/step-2")}
            className="text-[#15153d] font-semibold text-lg hover:underline"
          >
            ← Back
          </button>

          {/* Nhóm nút bên phải */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => alert("Đã lưu bản nháp!")}
              className="text-gray-500 hover:text-gray-700 font-semibold text-lg px-4 py-2"
            >
              Save as Draft
            </button>

            <Button
              variant="primary"
              onClick={handlePostJobNow}
              className="!px-8 flex items-center gap-2"
            >
              Post Job Now <span className="text-xl">🚀</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

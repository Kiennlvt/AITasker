// src/components/ui/StepBar.jsx
export default function StepBar({ currentStep = 1 }) {
  return (
    <div>
      <div>
        <h1 className="text-[42px] font-bold text-[#15153d]">Post a Job</h1>
        <p className="text-gray-500 mb-5 text-lg">
          Complete the details below to find the perfect AI specialist for your project.
        </p>
      </div>
    <div className="bg-white rounded-3xl border border-gray-200 mb-6 px-8 py-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm">
      {/* STEP 1 */}
      <div className="flex items-center flex-1 w-full">
        {/* Bước 1 luôn sáng vì bắt đầu đã ở bước 1 */}
        <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-sm">
          1
        </div>
        <span className="ml-4 font-semibold text-sm text-[#15153d]">
          Job Info
        </span>
        {/* Đường nối sang bước 2: Cam lên khi bước hiện tại từ số 2 trở đi */}
        <div className={`flex-1 h-[2px] mx-6 hidden sm:block transition-all duration-300 ${
          currentStep >= 2 ? "bg-orange-500" : "bg-gray-200"
        }`}></div>
      </div>

      {/* STEP 2 */}
      <div className="flex items-center flex-1 w-full">
        {/* Vòng tròn số 2: Hóa cam khi ở bước 2 hoặc bước 3 */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
          currentStep >= 2 
            ? "bg-orange-500 text-white border-transparent shadow-md" 
            : "border border-gray-300 text-gray-400 bg-transparent"
        }`}>
          2
        </div>
        <span className={`ml-4 font-semibold text-sm transition-all duration-300 ${
          currentStep >= 2 ? "text-[#15153d]" : "text-gray-400"
        }`}>
          Budget & Service
        </span>
        {/* Đường nối sang bước 3: Cam lên khi bước hiện tại chạm mốc số 3 */}
        <div className={`flex-1 h-[2px] mx-6 hidden sm:block transition-all duration-300 ${
          currentStep >= 3 ? "bg-orange-500" : "bg-gray-200"
        }`}></div>
      </div>

      {/* STEP 3 */}
      <div className="flex items-center w-full sm:w-auto">
        {/* Vòng tròn số 3: Hóa cam khi bước hiện tại là bước 3 */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
          currentStep >= 3 
            ? "bg-orange-500 text-white border-transparent shadow-md" 
            : "border border-gray-300 text-gray-400 bg-transparent"
        }`}>
          3
        </div>
        <span className={`ml-4 font-semibold text-sm transition-all duration-300 ${
          currentStep >= 3 ? "text-[#15153d]" : "text-gray-400"
        }`}>
          Review and AI generate
        </span>
      </div>

    </div>
    </div>
  );
}
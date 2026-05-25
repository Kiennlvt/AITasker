import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import StepBar from "../../../components/ui/StepBar";
import PricingCard from "../../../components/ui/PricingCard";
import { useState } from "react";

export default function PostJob02() {
  const [selectedType, setSelectedType] = useState("basic");

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  let currentStep = 1;
  if (path.includes("step-2")) currentStep = 2;
  if (path.includes("step-3")) currentStep = 3;

  const packagesData = [
  {
    id: "pkg-01",
    type: "basic",
    title: "Basic",
    description: "Quick tasks, fixed price, essential requirements. Best for defined, small-scale AI model testing or data labeling.",
    price: "$500 - $2,500",
    billingText: "Starting per project"
  },
  {
    id: "pkg-02",
    type: "standard",
    title: "Standard",
    description: "Intermediate complexity, milestone-based, detailed oversight. Includes regular check-ins and iterative refinements.",
    price: "$2,500 - $10,000",
    billingText: "Milestone-based billing"
  },
  {
    id: "pkg-03",
    type: "premium",
    title: "Premium",
    description: "Complex enterprise solutions, expert tier, full-cycle management. Dedicated senior AI researchers and architects.",
    price: "$10,000+",
    billingText: "Custom enterprise pricing"
  }
];

  return (
    <div>
      <StepBar currentStep={currentStep} />

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Budget & Service Packages
        </h2>

        {/* Lưới 3 Gói (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packagesData.map((pkg) => (
          <PricingCard
            key={pkg.id}
            type={pkg.type}
            title={pkg.title}
            description={pkg.description}
            price={pkg.price}
            billingText={pkg.billingText}
            
            // 3. Truyền trạng thái xem card này có đang trùng khớp với bộ nhớ không
              isSelected={selectedType === pkg.type}
              
              // 4. Khi click chọn, cập nhật lại bộ nhớ thành loại gói vừa click
              onSelect={() => setSelectedType(pkg.type)}
          />
        ))}
      </div>

        {/* Nút Điều Hướng */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-6">
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate("/post-job/step-1")}
          >
            {" "}
            ← Previous: Job Info
          </Button>

          <Button variant="primary" onClick={() => navigate("/post-job/step-3")}>Next Review and AI Generate</Button>
        </div>
      </div>
    </div>
  );
}

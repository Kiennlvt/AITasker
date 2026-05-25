// src/pages/client/ProjectDetailClient.jsx
import { useParams, Link } from "react-router-dom";
import {
  Share2,
  CheckCircle2,
  FileText,
  Terminal,
  Plus,
  MessageSquare,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";
import MessagesIcon from "../../../components/ui/MesageIcon";

export default function ProjectDetailClient() {
  // 1. Lấy id động từ thanh URL (ví dụ: "prj-8829", "neural-arch")
  const { id } = useParams();

  // 2. Giả lập cơ sở dữ liệu chi tiết của từng dự án (Mô phỏng dữ liệu từ Backend)
  const projectsMockDatabase = {
    "prj-8829": {
      name: "Neural Grid Optimization",
      status: "In Progress",
      statusBg: "bg-blue-50 text-blue-600 border-blue-100",
      statusDot: "bg-blue-500",
      desc: "Technical execution of the high-density data pipeline for real-time grid balancing using GPT-4o specialized models.",
      milestones: [
        {
          title: "Data Ingestion Architecture",
          status: "completed",
          dateInfo: "Completed Jun 12",
          desc: "Validated multi-source ingestion points and confirmed low-latency throughput for 1TB+ daily loads.",
        },
        {
          title: "Model Integration & Fine-tuning",
          status: "active",
          progress: 68,
          eta: "ETA: June 18",
          desc: "Refining parameters for grid-balancing logic. Expected completion in 48 hours.",
        },
        {
          title: "Production Deployment",
          status: "pending",
          dateInfo: "Pending Approval",
          desc: "Final staging environment validation and blue-green deployment sequence.",
        },
      ],
      agents: [
        { name: "Analytic-Core v4", role: "Lead AI Strategist", online: true },
      ],
    },
    "neural-arch": {
      name: "Neural Arch v2.4",
      status: "In Progress",
      statusBg: "bg-blue-50 text-blue-600 border-blue-100",
      statusDot: "bg-blue-500",
      desc: "Infrastructure Optimization and cloud resource streamlining for enterprise deep learning models.",
      milestones: [
        {
          title: "Cloud Resource Mapping",
          status: "completed",
          dateInfo: "Completed May 10",
          desc: "Mapped all multi-region AWS and GCP instances.",
        },
        {
          title: "Cluster Cost Optimization",
          status: "active",
          progress: 45,
          eta: "ETA: May 25",
          desc: "Downsizing underutilized nodes and structuring auto-scaling behavior.",
        },
      ],
      agents: [
        { name: "Dev-Bot Alpha", role: "Automation Engineer", online: true },
      ],
    },
    "data-cleansing": {
      name: "Data Cleansing AI",
      status: "Reviewing",
      statusBg: "bg-amber-50 text-amber-600 border-amber-100",
      statusDot: "bg-amber-500",
      desc: "Large Language Model Training and automated data deduplication workflows.",
      milestones: [
        {
          title: "Dataset Tokenization",
          status: "completed",
          dateInfo: "Completed May 01",
          desc: "Successfully cleaned and formatted 400B token base.",
        },
      ],
      agents: [{ name: "Sarah Chen", role: "QA Supervisor", online: false }],
    },
    "quantum-scripting": {
      name: "Quantum Scripting",
      status: "Queueing",
      statusBg: "bg-gray-50 text-gray-600 border-gray-100",
      statusDot: "bg-gray-400",
      desc: "Advanced Logic Processing using experimental prompt-chaining compilation.",
      milestones: [
        {
          title: "Logic Tree Evaluation",
          status: "pending",
          dateInfo: "In Queue",
          desc: "Waiting for resource allocation to initialize graph tests.",
        },
      ],
      agents: [],
    },
  };

  // 3. Tìm kiếm dự án trong "kho dữ liệu" dựa vào ID trên URL
  const project = projectsMockDatabase[id];

  // Trường hợp gõ sai ID trên URL hoặc không tìm thấy dự án
  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-700">Project Not Found</h2>
        <p className="text-gray-400 mt-2">
          The project ID <span className="text-red-500 font-mono">"{id}"</span>{" "}
          does not exist.
        </p>
        <Link
          to="/projects"
          className="text-orange-500 underline mt-4 inline-block font-semibold"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
            <Link to="/projects" className="hover:underline">
              Projects
            </Link>
            <span>&rsaquo;</span>
            <span className="text-gray-400">
              {id?.toUpperCase()}: {project.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-[#1a1a3c]">
              {project.name}
            </h1>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${project.statusBg}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${project.statusDot}`}
              ></span>
              {project.status}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1 max-w-[800px]">
            {project.desc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold shadow-sm text-sm">
            <Share2 size={16} /> Share
          </button>
          <button className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md text-sm">
            <CheckCircle2 size={16} /> Approve Phase
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Tiến độ Milestone */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-8">
              Milestone Progress
            </h3>

            <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
              {project.milestones.map((milestone, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[24px] top-1 bg-white p-0.5 z-10">
                    {milestone.status === "completed" && (
                      <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-[10px]">
                        ✓
                      </div>
                    )}
                    {milestone.status === "active" && (
                      <div className="w-5 h-5 border-4 border-orange-500 bg-[#1a1a3c] rounded-full"></div>
                    )}
                    {milestone.status === "pending" && (
                      <div className="w-5 h-5 border-2 border-gray-300 bg-gray-200 rounded-full"></div>
                    )}
                  </div>

                  <div
                    className={`p-5 rounded-2xl border ${milestone.status === "active" ? "bg-gray-50/50 border-gray-100 shadow-sm" : "border-transparent"}`}
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h4 className="font-bold text-[#1a1a3c] text-base">
                        {milestone.title}
                      </h4>
                      {milestone.status === "active" ? (
                        <span className="bg-orange-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-gray-400">
                          {milestone.dateInfo}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {milestone.desc}
                    </p>

                    {milestone.status === "active" && (
                      <div className="space-y-2 bg-white p-4 rounded-xl border border-gray-100">
                        <div className="w-full bg-blue-50 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-orange-600 h-full rounded-full"
                            style={{ width: `${milestone.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 font-medium">
                          <span>{milestone.progress}% Complete</span>
                          <span>{milestone.eta}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột phải: Thông tin Agents hỗ trợ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-6">
            Assigned Agents
          </h3>
          <div className="space-y-4">
            {project.agents.length > 0 ? (
              project.agents.map((agent, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                      <Terminal size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1a1a3c] text-sm">
                        {agent.name}
                      </h4>
                      <p className="text-xs text-gray-400">{agent.role}</p>
                    </div>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full ${agent.online ? "bg-orange-500" : "bg-gray-300"}`}
                  ></span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">
                No agents assigned yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Floating Message Button */}
      <MessagesIcon />

      <div>
        <Link
          to="/projects"
          className="w-fit flex items-center justify-center p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50/30 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />Back to projects   
        </Link>
      </div>
    </div>
  );
}

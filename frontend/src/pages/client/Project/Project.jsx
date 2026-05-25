// src/pages/ProjectListClient.jsx
import { FolderGit2, ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import MessagesIcon from "../../../components/ui/MesageIcon";

export default function ProjectClient() {
  // Danh sách tất cả dự án hiện có của công ty/client
  const allProjects = [
    {
      id: "prj-8829",
      name: "Neural Grid Optimization",
      desc: "Technical execution of the high-density data pipeline for real-time grid balancing using GPT-4o specialized models.",
      status: "In Progress",
      statusColor: "bg-blue-100 text-blue-600 border-blue-100",
      dotColor: "bg-blue-600",
      agentsCount: 3,
    },
    {
      id: "neural-arch",
      name: "Neural Arch v2.4",
      desc: "Infrastructure Optimization and cloud resource streamlining for enterprise deep learning models.",
      status: "In Progress",
      statusColor: "bg-blue-100 text-blue-600 border-blue-100",
      dotColor: "bg-blue-600",
      agentsCount: 2,
    },
    {
      id: "data-cleansing",
      name: "Data Cleansing AI",
      desc: "Large Language Model Training and automated data deduplication workflows.",
      status: "Reviewing",
      statusColor: "bg-amber-50 text-amber-600 border-amber-100",
      dotColor: "bg-black",
      agentsCount: 1,
    },
    {
      id: "quantum-scripting",
      name: "Quantum Scripting",
      desc: "Advanced Logic Processing using experimental prompt-chaining compilation.",
      status: "Queueing",
      statusColor: "bg-gray-50 text-gray-600 border-gray-100",
      dotColor: "bg-gray-400",
      agentsCount: 0,
    }
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      {/* Tiêu đề trang */}
      <div>
        <h1 className="text-3xl font-bold text-[#1a1a3c]">All Active Projects</h1>
        <p className="text-gray-500 mt-1">Select a workspace to monitor technical execution and milestones.</p>
      </div>

      {/* Grid danh sách dự án */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allProjects.map((project) => (
          <div 
            key={project.id} 
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
          >
            <div>
              {/* Header của Card dự án */}
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
                  <FolderGit2 size={22} />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${project.statusColor}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${project.dotColor}`}></span>
                  {project.status}
                </span>
              </div>

              {/* Tên & Mô tả */}
              <h3 className="font-bold text-lg text-[#1a1a3c] group-hover:text-orange-500 transition-colors mb-2">
                {project.name}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                {project.desc}
              </p>
            </div>

            {/* Footer của Card chứa nút bấm vào xem Chi tiết */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs font-medium text-gray-400">
              <span>{project.agentsCount} Agents Assigned</span>
              
              {/* Thẻ Link này sẽ chuyển thẳng sang route chi tiết dựa trên ID của dự án */}
              <Link 
                to={`/projects/${project.id}`} 
                className="flex items-center gap-1.5 text-orange-500 font-bold hover:underline"
              >
                View Details <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* FLOATING MESSAGE ICON */}
      <MessagesIcon />
    </div>
  );
}
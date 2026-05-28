import { useEffect, useState } from "react";
import { FolderGit2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MessagesIcon from "../../../components/ui/MesageIcon";
import { getMyProjects } from "../../../api/projects";

function statusStyle(status) {
  switch (status) {
    case "ACTIVE":
      return {
        label: "In Progress",
        color: "bg-blue-100 text-blue-600 border-blue-100",
        dot: "bg-blue-600",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        color: "bg-emerald-50 text-emerald-600 border-emerald-100",
        dot: "bg-emerald-500",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        color: "bg-gray-50 text-gray-500 border-gray-100",
        dot: "bg-gray-400",
      };
    default:
      return {
        label: status ?? "Unknown",
        color: "bg-amber-50 text-amber-600 border-amber-100",
        dot: "bg-amber-400",
      };
  }
}

export default function ProjectClient() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProjects()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold text-[#1a1a3c]">All Active Projects</h1>
        <p className="text-gray-500 mt-1">Select a workspace to monitor technical execution and milestones.</p>
      </div>

      {loading && (
        <p className="text-sm text-gray-400">Loading projects...</p>
      )}

      {!loading && projects.length === 0 && (
        <p className="text-sm text-gray-400">No projects found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => {
          const s = statusStyle(project.status);
          return (
            <div
              key={project.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
                    <FolderGit2 size={22} />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${s.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                    {s.label}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-[#1a1a3c] group-hover:text-orange-500 transition-colors mb-2">
                  {project.jobTitle}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                  {project.jobDescription || "No description provided."}
                </p>

                {typeof project.progress === "number" && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full rounded-full" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs font-medium text-gray-400">
                <span>{project.expertName ? `Expert: ${project.expertName}` : "No expert assigned"}</span>
                <Link
                  to={`/projects/${project.id}`}
                  className="flex items-center gap-1.5 text-orange-500 font-bold hover:underline"
                >
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <MessagesIcon />
    </div>
  );
}
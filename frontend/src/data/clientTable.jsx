import { Link } from "react-router-dom";

export const clientTable = () => [
  {
      header: "Project Name",
      render: (row) => (
        <Link to="/projects" className="block group cursor-pointer">
          <div className="font-bold text-[#1a1a3c] group-hover:text-orange-500 transition-colors">
            {row.name}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{row.desc}</div>
        </Link>
      ),
    },
    {
      header: "Assigned Expert",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full ${row.avatarBg} text-white flex items-center justify-center text-[10px] font-bold`}
          >
            {row.avatarText}
          </div>
          <span className="font-medium text-gray-700">{row.expert}</span>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${row.status === "In Progress" ? "bg-orange-500" : row.status === "Reviewing" ? "bg-amber-500" : "bg-slate-400"}`}
          ></span>
          <span className="font-medium text-gray-600">{row.status}</span>
        </div>
      ),
    },
    {
      header: "Budget",
      render: (row) => (
        <span className="font-bold text-[#1a1a3c]">{row.budget}</span>
      ),
    },
];
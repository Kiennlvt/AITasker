import { Link } from "react-router-dom";

export const expertTable = () => [
  {
    header: "Project Name",
    render: (row) => (
      <Link to="/my-tasks" className="block group cursor-pointer">
        <div className="font-bold text-[#1a1a3c] group-hover:text-orange-500 transition-colors">
          {row.name}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">{row.desc}</div>
      </Link>
    )
  },
  {
    header: "Client", 
    accessor: "client",
    render: (row) => <span className="font-semibold text-gray-700">{row.client}</span>
  },
  {
    header: "Execution Progress",
    render: (row) => (
      <div className="flex items-center gap-3 w-[160px]">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${row.avatarBg || 'bg-orange-500'} transition-all duration-500`} 
            style={{ width: `${row.progress}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-400 font-bold shrink-0">{row.progress}%</span>
      </div>
    )
  },
  {
    header: "Status",
    render: (row) => (
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${
          row.status === "In Progress" ? "bg-orange-500" : row.status === "Reviewing" ? "bg-amber-500" : "bg-slate-400"
        }`}></span>
        <span className="font-medium text-gray-600">{row.status}</span>
      </div>
    )
  },
  {
    header: "Action",
    render: () => (
      <Link to="/my-tasks" className="font-semibold text-gray-700 hover:text-orange-500 transition-colors">
        View Detail
      </Link>
    )
  }
];
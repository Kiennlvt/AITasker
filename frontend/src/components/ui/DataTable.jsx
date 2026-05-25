// src/components/ui/DataTable.jsx
export default function DataTable({ title, extraHeader, data = [], columns = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header của bảng */}
      <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-xl text-[#1a1a3c]">{title}</h3>
        {extraHeader && <div>{extraHeader}</div>}
      </div>
      
      {/* Nội dung lưới table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fbfd] border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-8 py-4 ${col.align === "right" ? "text-right" : ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
            {data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="group hover:bg-gray-50/50 transition-colors">
                {columns.map((col, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`px-8 py-4 ${col.align === "right" ? "text-right" : ""}`}
                  >
                    {/* Nếu cột có hàm render custom thì chạy, không thì bốc chữ thuần từ accessor */}
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

const DataTable = ({ columns, data, emptyMessage = 'No items found' }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr 
                  key={row.id || rowIdx} 
                  className="transition-colors hover:bg-slate-800/40"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-6 py-4 font-medium text-slate-200 ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox size={36} className="text-slate-600" />
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Simple Footer Pagination info */}
      <div className="flex items-center justify-between border-t border-slate-800 px-6 py-3 text-xs text-slate-400">
        <span>Showing {data.length} entries</span>
        <div className="flex items-center gap-2">
          <button disabled className="p-1 rounded bg-slate-800 text-slate-500 cursor-not-allowed">
            <ChevronLeft size={16} />
          </button>
          <span className="px-2 font-medium text-slate-300">Page 1 of 1</span>
          <button disabled className="p-1 rounded bg-slate-800 text-slate-500 cursor-not-allowed">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;

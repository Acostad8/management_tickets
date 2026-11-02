export function DataTable({ columns, rows, empty = 'Sin resultados', onRowClick }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className="min-w-full divide-y divide-slate-200 bg-white text-sm dark:divide-slate-800 dark:bg-slate-900">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-2 text-left font-medium">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.length === 0 && (
            <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={columns.length}>{empty}</td></tr>
          )}
          {rows.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50' : ''}
            >
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-2 text-slate-800 dark:text-slate-200">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

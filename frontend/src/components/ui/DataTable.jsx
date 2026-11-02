export function DataTable({ columns, rows, empty = 'Sin resultados', onRowClick }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-900 bg-zinc-950">
      <table className="min-w-full divide-y divide-zinc-900 text-[13px]">
        <thead className="bg-zinc-900/40 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 text-left">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900">
          {rows.length === 0 && (
            <tr>
              <td className="px-4 py-8 text-center text-zinc-500" colSpan={columns.length}>
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? 'cursor-pointer transition hover:bg-zinc-900/40' : 'transition hover:bg-zinc-900/30'}
            >
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 align-middle text-zinc-200">
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

'use client';

import * as React from 'react';
import { Search, ChevronDown, ChevronUp, SlidersHorizontal, CheckSquare, Square } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface FilterOption {
  key: string;
  label: string;
  options: Array<{ label: string; value: string }>;
}

interface AdminTableProps<T> {
  columns: Array<Column<T>>;
  data: T[];
  searchPlaceholder?: string;
  filters?: FilterOption[];
  bulkActions?: React.ReactNode | ((selectedIds: Set<string>, clearSelection: () => void) => React.ReactNode);
  isLoading?: boolean;
}

export function AdminTable<T extends { id: string }>({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  filters = [],
  bulkActions,
  isLoading = false,
}: AdminTableProps<T>) {
  const [search, setSearch] = React.useState('');
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>({});
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(columns.map((c) => c.key));
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [showColumnDropdown, setShowColumnDropdown] = React.useState(false);
  const itemsPerPage = 10;

  // Toggle selection
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map((d) => d.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Filter & Search
  const filteredData = React.useMemo(() => {
    return data
      .filter((row) => {
        const rowData = row as unknown as Record<string, unknown>;
        // Search
        const searchStr = search.toLowerCase();
        const matchesSearch = Object.values(rowData).some((val) =>
          String(val).toLowerCase().includes(searchStr)
        );

        // Filters
        const matchesFilters = Object.entries(filterValues).every(([key, val]) => {
          if (!val || val === 'ALL') return true;
          return String(rowData[key]) === val;
        });

        return matchesSearch && matchesFilters;
      })
      .sort((a, b) => {
        if (!sortKey) return 0;
        const rowA = a as unknown as Record<string, unknown>;
        const rowB = b as unknown as Record<string, unknown>;
        const valA = rowA[sortKey];
        const valB = rowB[sortKey];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return sortOrder === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [data, search, filterValues, sortKey, sortOrder]);

  // Pagination
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3 text-white">
        <div className="h-8 w-8 rounded-full border-2 border-zinc-800 border-t-[#FF4D00] animate-spin" />
        <span className="text-[10px] uppercase tracking-widest text-[#B5B5B5] font-bold">
          Querying enterprise ledger...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-white text-left">
      {/* Table Toolbar Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center text-xs">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#B5B5B5]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-black border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Custom Filters */}
          {filters.map((filter) => (
            <select
              key={filter.key}
              value={filterValues[filter.key] || 'ALL'}
              onChange={(e) => {
                setFilterValues({ ...filterValues, [filter.key]: e.target.value });
                setCurrentPage(1);
              }}
              className="bg-black border border-white/10 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] cursor-pointer"
            >
              <option value="ALL">All {filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}

          {/* Column Visibility Control */}
          <div className="relative">
            <button
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className="bg-black border border-white/10 text-white px-3.5 py-2.5 rounded-xl outline-none flex items-center space-x-1.5 hover:border-[#FF4D00] transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="h-4 w-4 text-[#B5B5B5]" />
              <span>Columns</span>
            </button>
            {showColumnDropdown && (
              <div className="absolute right-0 mt-2 z-20 w-48 border border-white/10 bg-[#0c0c0c] rounded-xl p-3 shadow-2xl space-y-2 text-left text-white">
                <span className="text-[9px] uppercase tracking-widest text-[#B5B5B5] font-bold block mb-1">
                  Toggle Columns
                </span>
                {columns.map((c) => (
                  <label key={c.key} className="flex items-center space-x-2 cursor-pointer text-[10px] uppercase font-bold text-[#B5B5B5] hover:text-white">
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(c.key)}
                      onChange={() => toggleColumnVisibility(c.key)}
                      className="h-3.5 w-3.5 rounded bg-black border-white/10 text-[#FF4D00]"
                    />
                    <span>{c.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions Header */}
      {selectedIds.size > 0 && (
        <div className="bg-[#FF4D00]/10 border border-[#FF4D00]/20 p-3 rounded-xl flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#FF4D00]">
          <span>{selectedIds.size} records selected</span>
          <div className="flex items-center space-x-3">
            {typeof bulkActions === 'function' ? bulkActions(selectedIds, () => setSelectedIds(new Set())) : bulkActions}
            <button
              onClick={() => setSelectedIds(new Set())}
              className="hover:underline text-white cursor-pointer bg-transparent border-0"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Main Table Grid */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-[#B5B5B5] text-xs">
          No records matching the ledger query criteria.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto border border-white/5 rounded-2xl bg-black/40">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-[#B5B5B5]">
                  <th className="p-4 w-10">
                    <button
                      onClick={toggleSelectAll}
                      className="p-1 hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-white"
                    >
                      {selectedIds.size === filteredData.length ? (
                        <CheckSquare className="h-4 w-4 text-[#FF4D00]" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  {columns
                    .filter((c) => visibleColumns.includes(c.key))
                    .map((c) => (
                      <th
                        key={c.key}
                        onClick={() => c.sortable && handleSort(c.key)}
                        className={`p-4 font-bold ${c.sortable ? 'cursor-pointer select-none hover:text-white' : ''}`}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{c.label}</span>
                          {c.sortable && sortKey === c.key && (
                            sortOrder === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-[#FF4D00]" /> : <ChevronDown className="h-3.5 w-3.5 text-[#FF4D00]" />
                          )}
                        </div>
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-white/5 transition-colors ${selectedIds.has(row.id) ? 'bg-[#FF4D00]/5' : ''}`}
                  >
                    <td className="p-4">
                      <button
                        onClick={() => toggleSelectRow(row.id)}
                        className="p-1 hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-white"
                      >
                        {selectedIds.has(row.id) ? (
                          <CheckSquare className="h-4 w-4 text-[#FF4D00]" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    {columns
                      .filter((c) => visibleColumns.includes(c.key))
                      .map((c) => (
                        <td key={c.key} className="p-4 text-[#E5E5E5]">
                          {c.render ? c.render(row) : String((row as unknown as Record<string, unknown>)[c.key])}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-3 text-[10px] uppercase font-bold tracking-wider text-[#B5B5B5]">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="py-2 px-4 border border-white/10 hover:border-white disabled:opacity-30 disabled:hover:border-white/10 rounded-xl transition-all cursor-pointer bg-transparent text-white"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages} ({filteredData.length} records)
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="py-2 px-4 border border-white/10 hover:border-white disabled:opacity-30 disabled:hover:border-white/10 rounded-xl transition-all cursor-pointer bg-transparent text-white"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default AdminTable;

import { useState, useEffect } from "react";
import { MoreVertical, Search, ChevronLeft, ChevronRight, Download, Star, Trash2, Edit, Eye } from "lucide-react";
import toast from "react-hot-toast";
const CategoryTable = ({
  columns,
  data,
  total,
  page,
  totalPages,
  onPageChange,
  onSearch,
  onAction,
  searchPlaceholder = "Search...",
  filters,
  entityName = "Categories"
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  const handleExport = () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }
    const headers = columns.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(",");
    const rows = data.map((row) => {
      return columns.map((c) => {
        let cellData = row[c.key];
        if (cellData === null || cellData === void 0) cellData = "";
        if (typeof cellData === "object") cellData = JSON.stringify(cellData);
        return `"${String(cellData).replace(/"/g, '""')}"`;
      }).join(",");
    });
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${entityName.toLowerCase().replace(/\s+/g, "_")}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export successful");
  };
  return <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-border dark:border-neutral-800 shadow-sm flex flex-col min-h-[560px] justify-between">
      {
    /* Table Toolbar */
  }
      <div className="p-6 border-b border-border dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/30 rounded-t-3xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        
        {
    /* Search */
  }
        <form onSubmit={handleSearch} className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-caption" />
          <input
    type="text"
    placeholder={searchPlaceholder}
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-neutral-700 bg-white dark:bg-neutral-900 text-heading dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
  />
        </form>

        {
    /* Actions & Filters */
  }
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {filters}
          
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-800 border border-border dark:border-neutral-700 rounded-xl text-heading dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export {entityName}</span>
          </button>
        </div>
      </div>

      {
    /* Table Content */
  }
      <div className="overflow-x-auto min-h-[460px] pb-48">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-caption uppercase tracking-wider border-b border-border dark:border-neutral-800 bg-white dark:bg-neutral-900">
              {columns.map((col) => <th key={col.key} className="p-4 font-semibold whitespace-nowrap">
                  {col.label}
                </th>)}
              <th className="p-4 font-semibold text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.length === 0 ? <tr>
                <td colSpan={columns.length + 1} className="p-16 text-center text-caption font-medium">
                  No {entityName.toLowerCase()} found.
                </td>
              </tr> : data.map((row, index) => {
                const shouldOpenUpward = index > 2 && index >= data.length - 2;
                return (
                  <tr key={row.id} className="border-b border-border/50 dark:border-neutral-800/50 hover:bg-gray-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    {columns.map((col) => <td key={col.key} className="p-4">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>)}
                    
                    <td className="p-4 text-right">
                      <div className="relative group inline-block z-20">
                        <button className="p-2 text-caption hover:text-primary hover:bg-orange-50 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className={`absolute right-0 ${shouldOpenUpward ? "bottom-full mb-2" : "top-full mt-2"} w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-border dark:border-neutral-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 flex flex-col py-2`}>
                          <button onClick={() => onAction("view", row)} className="px-4 py-2 text-sm text-heading dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 font-medium text-left flex items-center gap-2">
                             <Eye className="w-4 h-4 text-blue-500" /> View Details
                          </button>
                          
                          <button onClick={() => onAction("edit", row)} className="px-4 py-2 text-sm text-heading dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 font-medium text-left flex items-center gap-2">
                             <Edit className="w-4 h-4 text-emerald-500" /> Edit Category
                          </button>
                          
                          <button onClick={() => onAction("toggleFeatured", row)} className="px-4 py-2 text-sm text-heading dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 font-medium text-left flex items-center gap-2">
                             <Star className={`w-4 h-4 ${row.featured ? "text-gray-400" : "text-yellow-500"}`} /> 
                             {row.featured ? "Remove Feature" : "Feature Category"}
                          </button>
                          
                          <div className="h-px bg-border dark:bg-neutral-700 my-1 w-full" />
                          <button onClick={() => onAction("delete", row)} className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-bold text-left flex items-center gap-2">
                             <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {
    /* Pagination */
  }
      <div className="p-6 border-t border-border flex justify-between items-center bg-gray-50/50">
        <div className="text-sm text-caption font-medium">
          Showing <span className="text-heading font-bold">{data.length}</span> of <span className="text-heading font-bold">{total}</span> {entityName}
        </div>
        <div className="flex gap-2">
          <button
    disabled={page === 1}
    onClick={() => onPageChange(page - 1)}
    className="p-2 border border-border rounded-lg text-heading hover:bg-white disabled:opacity-50 transition-colors"
  >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
    disabled={page >= totalPages || totalPages === 0}
    onClick={() => onPageChange(page + 1)}
    className="p-2 border border-border rounded-lg text-heading hover:bg-white disabled:opacity-50 transition-colors"
  >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>;
};
var stdin_default = CategoryTable;
export {
  stdin_default as default
};

import React, { useState, useEffect } from 'react';
import { MoreVertical, Search, ChevronLeft, ChevronRight, Download, CheckCircle, XCircle, Globe, EyeOff, Star, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface CourseTableProps {
  columns: Column[];
  data: any[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onAction: (action: string, ids: string[]) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  entityName?: string;
  detailPathPrefix?: string;
}

const CourseTable = ({
  columns, data, total, page, totalPages,
  onPageChange, onSearch, onAction,
  searchPlaceholder = 'Search...',
  filters, entityName = 'Courses', detailPathPrefix
}: CourseTableProps) => {
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(data.map(item => item.id));
    else setSelectedIds([]);
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleExport = () => {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    const headers = columns.map(c => `"${c.label.replace(/"/g, '""')}"`).join(',');
    const rows = data.map(row => {
      return columns.map(c => {
        let cellData = row[c.key];
        if (cellData === null || cellData === undefined) cellData = '';
        if (typeof cellData === 'object') cellData = JSON.stringify(cellData);
        return `"${String(cellData).replace(/"/g, '""')}"`;
      }).join(',');
    });
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${entityName.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export successful');
  };

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-6 border-b border-border bg-gray-50/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        
        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-caption" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </form>

        {/* Actions & Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {filters}
          
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 border-l border-border pl-3">
              <span className="text-sm font-bold text-primary">{selectedIds.length} Selected</span>
              
              <select 
                onChange={(e) => {
                  if(e.target.value) {
                    onAction(e.target.value, selectedIds);
                    e.target.value = '';
                  }
                }}
                className="px-3 py-1.5 bg-white border border-border text-sm font-bold rounded-lg outline-none hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <option value="">Bulk Actions</option>
                <option value="approve">Approve Selected</option>
                <option value="reject">Reject Selected</option>
                <option value="publish">Publish Selected</option>
                <option value="unpublish">Unpublish Selected</option>
                <option value="delete">Delete Selected</option>
              </select>
            </div>
          )}

          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-heading font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-caption uppercase tracking-wider border-b border-border bg-white">
              <th className="p-4 w-12">
                <input 
                  type="checkbox" 
                  checked={data.length > 0 && selectedIds.length === data.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
              </th>
              {columns.map((col) => (
                <th key={col.key} className="p-4 font-semibold whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              <th className="p-4 font-semibold text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="p-8 text-center text-caption font-medium">
                  No {entityName.toLowerCase()} found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-b border-border/50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleSelect(row.id)}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                  </td>
                  
                  {columns.map((col) => (
                    <td key={col.key} className="p-4">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  
                  <td className="p-4 text-right">
                    <div className="relative group inline-block">
                      <button className="p-2 text-caption hover:text-primary hover:bg-orange-50 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 flex flex-col py-2">
                        {detailPathPrefix && (
                           <Link to={`${detailPathPrefix}/${row.id}`} className="px-4 py-2 text-sm text-heading hover:bg-gray-50 font-medium text-left flex items-center gap-2">
                             <Eye className="w-4 h-4 text-caption" /> View Course
                           </Link>
                        )}
                        <button onClick={() => onAction('approve', [row.id])} className="px-4 py-2 text-sm text-heading hover:bg-gray-50 font-medium text-left flex items-center gap-2">
                           <CheckCircle className="w-4 h-4 text-emerald-500" /> Approve
                        </button>
                        <button onClick={() => onAction('reject', [row.id])} className="px-4 py-2 text-sm text-heading hover:bg-gray-50 font-medium text-left flex items-center gap-2">
                           <XCircle className="w-4 h-4 text-red-500" /> Reject
                        </button>
                        <button onClick={() => onAction('publish', [row.id])} className="px-4 py-2 text-sm text-heading hover:bg-gray-50 font-medium text-left flex items-center gap-2">
                           <Globe className="w-4 h-4 text-blue-500" /> Publish
                        </button>
                        <button onClick={() => onAction('unpublish', [row.id])} className="px-4 py-2 text-sm text-heading hover:bg-gray-50 font-medium text-left flex items-center gap-2">
                           <EyeOff className="w-4 h-4 text-gray-500" /> Unpublish
                        </button>
                        <button onClick={() => onAction(row.featured ? 'unfeature' : 'feature', [row.id])} className="px-4 py-2 text-sm text-heading hover:bg-gray-50 font-medium text-left flex items-center gap-2">
                           <Star className={`w-4 h-4 ${row.featured ? 'text-gray-400' : 'text-yellow-500'}`} /> {row.featured ? 'Unfeature Course' : 'Feature Course'}
                        </button>
                        <div className="h-px bg-border my-1 w-full"></div>
                        <button onClick={() => onAction('delete', [row.id])} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold text-left flex items-center gap-2">
                           <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="p-2 border border-border rounded-lg text-heading hover:bg-white disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseTable;

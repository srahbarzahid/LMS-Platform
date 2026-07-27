import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, Eye, Download, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

export interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface CourseApprovalTableProps {
  columns: Column[];
  data: any[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onAction: (action: string, row: any) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
}

const CourseApprovalTable = ({
  columns, data, total, page, totalPages,
  onPageChange, onSearch, onAction,
  searchPlaceholder = 'Search pending courses...',
  filters
}: CourseApprovalTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

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
    link.setAttribute('download', `pending_courses_export.csv`);
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
                <td colSpan={columns.length + 1} className="p-8 text-center text-caption font-medium">
                  No pending courses found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-b border-border/50 hover:bg-gray-50/50 transition-colors">
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
                        <button onClick={() => onAction('review', row)} className="px-4 py-2 text-sm text-heading hover:bg-gray-50 font-medium text-left flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-500" /> Review Details
                        </button>
                        <div className="h-px bg-border my-1 w-full"></div>
                        <button onClick={() => onAction('approve', row)} className="px-4 py-2 text-sm text-heading hover:bg-emerald-50 text-emerald-600 font-medium text-left flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> Approve Course
                        </button>
                        <button onClick={() => onAction('reject', row)} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium text-left flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500" /> Reject Course
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
          Showing <span className="text-heading font-bold">{data.length}</span> of <span className="text-heading font-bold">{total}</span> Pending Courses
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

export default CourseApprovalTable;

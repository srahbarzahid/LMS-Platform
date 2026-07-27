import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  CreditCard, TrendingUp, DollarSign, Activity, AlertCircle, 
  Search, ChevronLeft, ChevronRight, Eye, ChevronDown, CheckCircle, XCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomDropdown = ({ value, options, onChange, placeholder }: { value: string, options: {value: string, label: string}[], onChange: (val: string) => void, placeholder: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 bg-white border border-border rounded-xl text-heading font-medium text-sm outline-none hover:border-primary focus:border-primary flex items-center justify-between min-w-[180px] gap-2 transition-colors cursor-pointer"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-caption transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-border rounded-xl shadow-lg shadow-gray-200/50 z-20 py-2 min-w-[180px] overflow-hidden transform opacity-100 scale-100 transition-all origin-top">
            <button
              onClick={() => { onChange(''); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${value === '' ? 'bg-primary/5 text-primary font-bold' : 'text-heading font-medium'}`}
            >
              {placeholder}
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => { onChange(option.value); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${value === option.value ? 'bg-primary/5 text-primary font-bold' : 'text-heading font-medium'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const AdminPayments = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filtering State
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState({
    status: '',
    method: ''
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/admin/payments?page=${page}&limit=10`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (filters.status) url += `&status=${filters.status}`;
      if (filters.method) url += `&method=${filters.method}`;
      
      const [res, sumRes, revRes] = await Promise.all([
        axios.get(url),
        axios.get('http://localhost:5000/api/admin/payments/summary'),
        axios.get('http://localhost:5000/api/admin/payments/revenue')
      ]);

      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setSummary(sumRes.data.data);
      setRevenueData(revRes.data.data);
    } catch (err) {
      toast.error('Failed to fetch payments data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, searchTerm, filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const statCards = summary ? [
    { label: 'Total Revenue', value: `₹${summary.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: 'Total Orders', value: summary.totalOrders, icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Successful', value: summary.successful, icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
    { label: 'Pending', value: summary.pending, icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
    { label: 'Failed', value: summary.failed, icon: XCircle, color: 'text-red-600', bg: 'bg-red-500/10' }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-heading mb-1">Payments & Revenue</h1>
          <p className="text-body text-sm">Track all course purchases, transactions, invoices, and payment status.</p>
        </div>
      </div>

      {/* Stats Cards */}
      {statCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="relative bg-white p-5 rounded-2xl border border-border overflow-hidden flex flex-col shadow-sm transition-transform hover:-translate-y-1 duration-300">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} mb-3 relative z-10`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="relative z-10">
                  <div className="text-2xl font-heading font-black text-heading leading-tight truncate" title={stat.value.toString()}>{stat.value}</div>
                  <div className="text-[11px] font-bold text-caption uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
                <Icon className="absolute -bottom-2 -right-2 w-20 h-20 text-gray-100 opacity-50 transform -rotate-12 pointer-events-none" strokeWidth={1.5} />
              </div>
            );
          })}
        </div>
      )}

      {/* Revenue Section */}
      {summary && (
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col lg:flex-row">
          <div className="p-8 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-border bg-gray-50 flex flex-col justify-center">
            <h3 className="font-heading font-bold text-heading text-lg mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Revenue Insights
            </h3>
            <div className="space-y-6">
              <div>
                <div className="text-sm font-bold text-caption uppercase tracking-wider mb-1">Today's Revenue</div>
                <div className="text-3xl font-heading font-black text-emerald-600">₹{summary.todaysRevenue.toLocaleString()}</div>
              </div>
              <div className="pt-6 border-t border-border/50">
                <div className="text-sm font-bold text-caption uppercase tracking-wider mb-1">This Month</div>
                <div className="text-2xl font-heading font-black text-heading">₹{summary.thisMonthRevenue.toLocaleString()}</div>
              </div>
              <div className="pt-6 border-t border-border/50">
                <div className="text-sm font-bold text-caption uppercase tracking-wider mb-1">Average Order Value</div>
                <div className="text-2xl font-heading font-black text-heading">₹{summary.averageOrderValue.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="p-6 lg:w-2/3 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-6 border-b border-border bg-gray-50/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-caption" />
            <input
              type="text"
              placeholder="Search by student, course, TXN ID..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <CustomDropdown
              value={filters.status}
              onChange={(val) => { setFilters({...filters, status: val}); setPage(1); }}
              placeholder="All Statuses"
              options={[
                { value: 'Paid', label: 'Paid' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Failed', label: 'Failed' }
              ]}
            />

            <CustomDropdown
              value={filters.method}
              onChange={(val) => { setFilters({...filters, method: val}); setPage(1); }}
              placeholder="All Methods"
              options={[
                { value: 'Razorpay', label: 'Razorpay' },
                { value: 'UPI', label: 'UPI' },
                { value: 'Credit Card', label: 'Credit Card' },
                { value: 'Debit Card', label: 'Debit Card' },
                { value: 'Net Banking', label: 'Net Banking' }
              ]}
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-caption uppercase tracking-wider border-b border-border bg-white">
                <th className="p-4 font-semibold whitespace-nowrap">Transaction Info</th>
                <th className="p-4 font-semibold whitespace-nowrap">Student</th>
                <th className="p-4 font-semibold whitespace-nowrap">Course</th>
                <th className="p-4 font-semibold whitespace-nowrap">Amount</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                <th className="p-4 font-semibold text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-caption font-medium">Loading payments...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-caption font-medium">No payments found.</td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="border-b border-border/50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-heading font-mono text-xs">{row.transactionId}</div>
                        <div className="text-xs text-caption flex items-center gap-1 mt-1">
                          <Activity className="w-3 h-3" /> {new Date(row.paymentDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-heading">{row.studentName}</div>
                        <div className="text-xs text-caption">{row.studentEmail}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-heading max-w-[200px] truncate" title={row.courseName}>{row.courseName}</div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-heading">₹{row.finalAmount}</div>
                        <div className="text-xs text-caption">{row.paymentMethod}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        row.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                        row.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                        row.status === 'Failed' ? 'bg-red-50 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => navigate(`/admin/payments/${row.id}`)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center gap-2"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-xs font-bold">View</span>
                      </button>
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
            Showing <span className="text-heading font-bold">{data.length}</span> of <span className="text-heading font-bold">{total}</span> Payments
          </div>
          <div className="flex gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 border border-border rounded-lg text-heading hover:bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 border border-border rounded-lg text-heading hover:bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;

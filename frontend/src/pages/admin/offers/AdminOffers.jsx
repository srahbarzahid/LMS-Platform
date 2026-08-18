import { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Trash2,
  X,
  AlertTriangle,
  Activity,
  IndianRupee,
  ChevronDown
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CustomDropdown = ({ value, options, onChange, placeholder, className = "", disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);
  return <div className="relative flex-1 sm:flex-none">
      <div
    onClick={() => !disabled && setIsOpen(!isOpen)}
    className={`flex items-center justify-between gap-2 transition-colors cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""} ${className || "px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium text-sm hover:border-orange-500 shadow-sm min-w-[160px]"}`}
  >
        <span className={!selectedOption ? "text-gray-500" : ""}>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </div>
      
      {isOpen && !disabled && <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-200/50 z-20 py-2 min-w-[160px] max-h-60 overflow-y-auto transform opacity-100 scale-100 transition-all origin-top">
            <div
    onClick={() => {
      onChange("All");
      setIsOpen(false);
    }}
    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${value === "All" || value === "" ? "bg-orange-50/50 text-orange-600 font-bold" : "text-gray-700 font-medium"}`}
  >
              {placeholder}
            </div>
            {options.map((option) => <div
    key={option.value}
    onClick={() => {
      onChange(option.value);
      setIsOpen(false);
    }}
    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${value === option.value ? "bg-orange-50/50 text-orange-600 font-bold" : "text-gray-700 font-medium"}`}
  >
                {option.label}
              </div>)}
          </div>
        </>}
    </div>;
};
function AdminOffers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [statusConfirm, setStatusConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    offerType: "Coupon Code",
    discountType: "Percentage",
    discountValue: "",
    applicableType: "All Courses",
    targetId: "",
    targetName: "",
    minimumPurchaseAmount: "",
    maximumDiscountAmount: "",
    usageLimit: "",
    usagePerStudent: "1",
    startDate: "",
    endDate: "",
    status: "Active"
  });
  useEffect(() => {
    fetchOffers();
  }, []);
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/admin/offers");
      if (response.data.success) {
        setOffers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleToggleStatus = async () => {
    if (!statusConfirm) return;
    try {
      await axios.put(`http://localhost:5000/api/admin/offers/${statusConfirm.id}/activate`);
      fetchOffers();
      setStatusConfirm(null);
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/offers/${id}`);
      fetchOffers();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minimumPurchaseAmount: formData.minimumPurchaseAmount ? Number(formData.minimumPurchaseAmount) : null,
        maximumDiscountAmount: formData.maximumDiscountAmount ? Number(formData.maximumDiscountAmount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        usagePerStudent: 1
        // Hardcoded to 1 per student globally
      };
      await axios.post("http://localhost:5000/api/admin/offers", payload);
      setShowAddModal(false);
      fetchOffers();
      setFormData({
        name: "",
        code: "",
        offerType: "Coupon Code",
        discountType: "Percentage",
        discountValue: "",
        applicableType: "All Courses",
        targetId: "",
        targetName: "",
        minimumPurchaseAmount: "",
        maximumDiscountAmount: "",
        usageLimit: "",
        usagePerStudent: "1",
        startDate: "",
        endDate: "",
        status: "Active"
      });
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = offer.name.toLowerCase().includes(searchTerm.toLowerCase()) || offer.code && offer.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || offer.offerType === filterType;
    const matchesStatus = filterStatus === "All" || offer.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });
  const stats = {
    total: offers.length,
    active: offers.filter((o) => o.status === "Active").length,
    scheduled: offers.filter((o) => o.status === "Scheduled").length,
    expired: offers.filter((o) => o.status === "Expired").length,
    totalUsage: offers.reduce((sum, o) => sum + o.usedCount, 0)
  };
  const statCards = [
    { label: "Total Offers", value: stats.total, icon: Tag, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Active Offers", value: stats.active, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Scheduled", value: stats.scheduled, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Expired", value: stats.expired, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Total Usage", value: stats.totalUsage, icon: Activity, color: "text-amber-600", bg: "bg-amber-50" }
  ];
  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Expired":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading offers...</div>;
  }
  return <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shrink-0 shadow-inner shadow-white">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Coupons & Offers</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage course discounts, category offers, and coupon codes.</p>
          </div>
        </div>
        <button
    onClick={() => setShowAddModal(true)}
    className="px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 hover:-translate-y-0.5 border border-orange-400/50"
  >
          <Plus className="w-4 h-4" />
          Create New Offer
        </button>
      </div>

      {
    /* Stats Cards */
  }
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => {
    const Icon = stat.icon;
    return <div key={idx} className="relative bg-white p-5 rounded-2xl border border-border overflow-hidden flex flex-col shadow-sm transition-transform hover:-translate-y-1 duration-300">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} mb-3 relative z-10`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="relative z-10">
                <div className="text-2xl font-heading font-black text-heading leading-tight truncate" title={stat.value.toString()}>{stat.value}</div>
                <div className="text-[11px] font-bold text-caption uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
              <Icon className="absolute -bottom-2 -right-2 w-20 h-20 text-gray-100 opacity-50 transform -rotate-12 pointer-events-none" strokeWidth={1.5} />
            </div>;
  })}
      </div>

      {
    /* Controls */
  }
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
    type="text"
    placeholder="Search offers or codes..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="input-field pl-9 w-full"
  />
        </div>
        <div className="flex gap-2">
          <CustomDropdown
    value={filterType}
    onChange={(val) => setFilterType(val)}
    placeholder="All Types"
    options={[
      { value: "Coupon Code", label: "Coupon Code" },
      { value: "Course Offer", label: "Course Offer" },
      { value: "Category Offer", label: "Category Offer" }
    ]}
    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium text-sm hover:border-orange-500 shadow-sm w-36"
  />
          <CustomDropdown
    value={filterStatus}
    onChange={(val) => setFilterStatus(val)}
    placeholder="All Status"
    options={[
      { value: "Active", label: "Active" },
      { value: "Scheduled", label: "Scheduled" },
      { value: "Expired", label: "Expired" },
      { value: "Inactive", label: "Inactive" }
    ]}
    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium text-sm hover:border-orange-500 shadow-sm w-36"
  />
        </div>
      </div>

      {
    /* Table */
  }
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Offer Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicable To</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOffers.length > 0 ? filteredOffers.map((offer) => <tr key={offer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{offer.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">{offer.offerType}</span>
                          {offer.code && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                              {offer.code}
                            </span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {offer.discountType === "Percentage" ? `${offer.discountValue}%` : `\u20B9${offer.discountValue}`}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {offer.discountType === "Percentage" && offer.maximumDiscountAmount ? `Up to \u20B9${offer.maximumDiscountAmount}` : "No Limit"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{offer.applicableType}</div>
                      <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]">{offer.targetName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{offer.usedCount}</span>
                        {offer.usageLimit && <span className="text-sm text-gray-500">/ {offer.usageLimit}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(offer.status)}`}>
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
    onClick={() => setStatusConfirm({ id: offer.id, name: offer.name, status: offer.status })}
    className={`p-2 rounded-lg transition-colors ${offer.status === "Active" ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"}`}
    title={offer.status === "Active" ? "Deactivate" : "Activate"}
  >
                          {offer.status === "Active" ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
    onClick={() => navigate(`/admin/offers/${offer.id}`)}
    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
    title="View Details"
  >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
    onClick={() => setDeleteConfirm(offer.id)}
    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
    title="Delete Offer"
  >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>) : <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <Tag className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">No offers found</h3>
                      <p className="text-sm text-gray-500 mt-1">Get started by creating a new coupon or offer.</p>
                      <button onClick={() => setShowAddModal(true)} className="btn-secondary mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Offer
                      </button>
                    </div>
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* Status Confirmation Modal */
  }
      {statusConfirm && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
            <div className={`flex items-center gap-4 mb-4 ${statusConfirm.status === "Active" ? "text-rose-600" : "text-emerald-600"}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${statusConfirm.status === "Active" ? "bg-rose-100 shadow-white" : "bg-emerald-100 shadow-white"}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {statusConfirm.status === "Active" ? "Deactivate Offer?" : "Activate Offer?"}
                </h3>
              </div>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to {statusConfirm.status === "Active" ? "deactivate" : "activate"} <strong className="text-gray-900">{statusConfirm.name}</strong>?
              {statusConfirm.status === "Active" ? " Students will no longer be able to use it until you activate it again." : " Students will be able to apply it to their purchases immediately."}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
    onClick={() => setStatusConfirm(null)}
    className="px-5 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
  >
                Cancel
              </button>
              <button
    onClick={handleToggleStatus}
    className={`px-5 py-2.5 rounded-xl font-medium text-white shadow-lg transition-all hover:-translate-y-0.5 ${statusConfirm.status === "Active" ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30"}`}
  >
                Yes, {statusConfirm.status === "Active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>}

      {
    /* Delete Confirmation Modal */
  }
      {deleteConfirm && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 text-rose-600 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Offer?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this offer? This action cannot be undone, and users will no longer be able to apply it.
            </p>
            <div className="flex justify-end gap-3">
              <button
    onClick={() => setDeleteConfirm(null)}
    className="btn-secondary"
  >
                Cancel
              </button>
              <button
    onClick={() => handleDelete(deleteConfirm)}
    className="btn-primary bg-rose-600 hover:bg-rose-700"
  >
                Delete
              </button>
            </div>
          </div>
        </div>}

      {
    /* Add Offer Modal */
  }
      {showAddModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col my-8 overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/80 shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Create New Offer</h2>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <form id="addOfferForm" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Offer Name *</label>
                    <input
    type="text"
    required
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all bg-white text-gray-900 shadow-sm"
    placeholder="e.g. Summer Sale 2024"
  />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Offer Type *</label>
                    <CustomDropdown
    value={formData.offerType}
    onChange={(type) => {
      setFormData({
        ...formData,
        offerType: type,
        applicableType: type === "Course Offer" ? "Course" : type === "Category Offer" ? "Category" : "All Courses",
        code: type === "Coupon Code" ? formData.code : ""
      });
    }}
    placeholder="Select Offer Type"
    options={[
      { value: "Coupon Code", label: "Coupon Code" },
      { value: "Course Offer", label: "Course Offer (Automatic)" },
      { value: "Category Offer", label: "Category Offer (Automatic)" }
    ]}
    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all bg-white text-gray-900 shadow-sm"
  />
                  </div>
                </div>

                {formData.offerType === "Coupon Code" && <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Coupon Code *</label>
                    <input
    type="text"
    required
    value={formData.code}
    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all bg-white text-gray-900 shadow-sm font-mono uppercase tracking-wider"
    placeholder="E.G. SUMMER50"
  />
                    <p className="text-xs text-gray-500 mt-1.5">Students will need to enter this code at checkout.</p>
                  </div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Discount Type *</label>
                    <CustomDropdown
    value={formData.discountType}
    onChange={(val) => setFormData({ ...formData, discountType: val })}
    placeholder="Select Discount Type"
    options={[
      { value: "Percentage", label: "Percentage (%)" },
      { value: "Fixed Amount", label: "Fixed Amount (\u20B9)" }
    ]}
    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all bg-white text-gray-900 shadow-sm"
  />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Discount Value *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {formData.discountType === "Percentage" ? <span className="text-gray-500 sm:text-sm">%</span> : <IndianRupee className="w-4 h-4 text-gray-500" />}
                      </div>
                      <input
    type="number"
    required
    min="1"
    max={formData.discountType === "Percentage" ? "100" : ""}
    value={formData.discountValue}
    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all bg-white text-gray-900 shadow-sm"
    placeholder="e.g. 50"
  />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-black text-gray-900 mb-5 uppercase tracking-wider">Applicability</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Applicable To</label>
                      <CustomDropdown
    value={formData.applicableType}
    disabled={formData.offerType !== "Coupon Code"}
    onChange={(val) => setFormData({ ...formData, applicableType: val, targetId: "", targetName: "" })}
    placeholder="Select Applicability"
    options={[
      { value: "All Courses", label: "All Courses" },
      { value: "Category", label: "Specific Category" },
      { value: "Course", label: "Specific Course" }
    ]}
    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all bg-white text-gray-900 shadow-sm"
  />
                    </div>
                    
                    {formData.applicableType === "Course" && <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Select Course *</label>
                        <CustomDropdown
    value={formData.targetId}
    onChange={(val) => {
      const name = val === "course_1" ? "Advanced Web Development" : val === "course_2" ? "UI/UX Design Masterclass" : "";
      setFormData({ ...formData, targetId: val, targetName: name });
    }}
    placeholder="Choose a course..."
    options={[
      { value: "course_1", label: "Advanced Web Development" },
      { value: "course_2", label: "UI/UX Design Masterclass" }
    ]}
    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all bg-white text-gray-900 shadow-sm"
  />
                      </div>}
                    
                    {formData.applicableType === "Category" && <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Select Category *</label>
                        <CustomDropdown
    value={formData.targetId}
    onChange={(val) => {
      const name = val === "cat_1" ? "Development" : val === "cat_2" ? "Design" : val === "cat_3" ? "Business" : "";
      setFormData({ ...formData, targetId: val, targetName: name });
    }}
    placeholder="Choose a category..."
    options={[
      { value: "cat_1", label: "Development" },
      { value: "cat_2", label: "Design" },
      { value: "cat_3", label: "Business" }
    ]}
    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all bg-white text-gray-900 shadow-sm"
  />
                      </div>}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-black text-gray-900 mb-5 uppercase tracking-wider">Limits & Conditions</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Minimum Purchase Amount (₹)</label>
                      <input
    type="number"
    value={formData.minimumPurchaseAmount}
    onChange={(e) => setFormData({ ...formData, minimumPurchaseAmount: e.target.value })}
    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all bg-white text-gray-900 shadow-sm"
    placeholder="Leave blank for no minimum"
  />
                    </div>
                    {formData.discountType === "Percentage" && <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Maximum Discount (₹)</label>
                        <input
    type="number"
    value={formData.maximumDiscountAmount}
    onChange={(e) => setFormData({ ...formData, maximumDiscountAmount: e.target.value })}
    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all bg-white text-gray-900 shadow-sm"
    placeholder="Leave blank for no limit"
  />
                      </div>}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Total Usage Limit</label>
                      <input
    type="number"
    value={formData.usageLimit}
    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all bg-white text-gray-900 shadow-sm"
    placeholder="e.g. 100 (Blank for unlimited)"
  />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 pb-2">
                  <h3 className="text-sm font-black text-gray-900 mb-5 uppercase tracking-wider">Schedule</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Start Date & Time *</label>
                      <input
    type="datetime-local"
    required
    value={formData.startDate}
    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all bg-white text-gray-900 shadow-sm"
  />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">End Date & Time *</label>
                      <input
    type="datetime-local"
    required
    value={formData.endDate}
    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all bg-white text-gray-900 shadow-sm"
  />
                    </div>
                  </div>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/80 shrink-0">
              <button
    type="button"
    onClick={() => setShowAddModal(false)}
    className="px-6 py-2.5 rounded-xl font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm transition-all"
  >
                Cancel
              </button>
              <button
    type="submit"
    form="addOfferForm"
    className="px-6 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5"
  >
                Create Offer
              </button>
            </div>
          </div>
        </div>}

    </div>;
}
export {
  AdminOffers as default
};

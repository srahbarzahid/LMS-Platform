import { useState, useEffect } from "react";
import {
  Award,
  Search,
  Filter,
  Download,
  XCircle,
  Eye,
  Calendar,
  GraduationCap,
  User,
  BookOpen,
  Check
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
const AdminIssuedCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCert, setSelectedCert] = useState(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const fetchCertificates = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/certificates", { withCredentials: true });
      if (res.data.success) {
        setCertificates(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch issued certificates", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCertificates();
  }, []);
  const handleRevoke = async () => {
    if (!revokeReason.trim()) return toast.error("Please provide a reason for revocation.");
    try {
      await axios.put(`http://localhost:5000/api/admin/certificates/${selectedCert.id}/revoke`, { reason: revokeReason }, { withCredentials: true });
      setShowRevokeConfirm(false);
      setRevokeReason("");
      setCertificates((certs) => certs.map((c) => c.id === selectedCert.id ? { ...c, status: "Revoked", revokeReason } : c));
      setSelectedCert({ ...selectedCert, status: "Revoked", revokeReason });
    } catch (error) {
      console.error("Failed to revoke certificate", error);
    }
  };
  const handleDownload = async (certId) => {
    toast.success(`Downloading certificate ${certId}...`);
  };
  const filteredCerts = certificates.filter((c) => {
    const matchesSearch = c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || c.courseName.toLowerCase().includes(searchQuery.toLowerCase()) || c.certificateId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const validCount = certificates.filter((c) => c.status === "Valid").length;
  const revokedCount = certificates.filter((c) => c.status === "Revoked").length;
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Issued Certificates</h1>
          <p className="text-body mt-1">View and manage all generated certificates.</p>
        </div>
        <div className="relative flex items-center gap-3">
          <button
    onClick={() => setIsFilterOpen(!isFilterOpen)}
    className={`flex items-center gap-2 px-4 py-2 border ${isFilterOpen || statusFilter !== "All" ? "border-primary text-primary bg-primary/5" : "border-border text-heading bg-white"} rounded-lg hover:bg-gray-50 transition-all font-medium`}
  >
            <Filter className="w-4 h-4" />
            Filters {statusFilter !== "All" && <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px] ml-1">1</span>}
          </button>
          
          {isFilterOpen && <>
              <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-xl z-20 py-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 text-xs font-bold text-caption uppercase tracking-wider border-b border-border mb-1">
                  Status
                </div>
                {["All", "Valid", "Revoked"].map((status) => <button
    key={status}
    onClick={() => {
      setStatusFilter(status);
      setIsFilterOpen(false);
    }}
    className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors ${statusFilter === status ? "text-primary font-bold bg-primary/5" : "text-body hover:bg-gray-50"}`}
  >
                    <span>{status}</span>
                    {statusFilter === status && <Check className="w-4 h-4 text-primary" />}
                  </button>)}
              </div>
            </>}
        </div>
      </div>

      {
    /* Summary Cards */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-caption font-medium">Total Issued</p>
            <h3 className="text-2xl font-bold text-heading">{certificates.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-caption font-medium">Issued Today</p>
            <h3 className="text-2xl font-bold text-heading">12</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-caption font-medium">Valid</p>
            <h3 className="text-2xl font-bold text-heading">{validCount}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-caption font-medium">Revoked</p>
            <h3 className="text-2xl font-bold text-heading">{revokedCount}</h3>
          </div>
        </div>
      </div>

      {
    /* Main Content */
  }
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {
    /* Search */
  }
        <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50/50">
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-caption" />
            <input
    type="text"
    placeholder="Search by Student, Course or ID..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
  />
          </div>
        </div>

        {
    /* Table */
  }
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-gray-50 text-xs font-semibold text-caption uppercase tracking-wider">
                <th className="px-6 py-4">Certificate ID</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-heading divide-y divide-border">
              {isLoading ? <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-caption">Loading certificates...</td>
                </tr> : filteredCerts.length === 0 ? <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-caption">No certificates found.</td>
                </tr> : filteredCerts.map((cert) => <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-primary font-medium">
                      {cert.certificateId}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                          {cert.studentName.charAt(0)}
                        </div>
                        {cert.studentName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body" title={cert.courseName}>
                      <div className="line-clamp-1 max-w-[200px]">
                        {cert.courseName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body">
                      {new Date(cert.issueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cert.status === "Valid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
    onClick={() => setSelectedCert(cert)}
    className="p-2 text-caption hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
    title="View"
  >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
    onClick={() => handleDownload(cert.certificateId)}
    className="p-2 text-caption hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
    title="Download"
  >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* View Modal */
  }
      {selectedCert && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row">
            
            {
    /* Certificate Preview (Mini) */
  }
            <div className="w-full md:w-1/2 bg-gray-100 p-8 flex items-center justify-center border-r border-border">
              <div className="bg-white shadow-md p-6 w-full max-w-md text-center border-2 border-border/50 relative">
                <img src="https://placehold.co/50x50?text=Logo" alt="Logo" className="mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-1 font-serif">CERTIFICATE OF COMPLETION</h3>
                <p className="text-xs text-gray-500 mb-4 italic">This is proudly presented to</p>
                <h4 className="text-2xl font-bold text-primary mb-4">{selectedCert.studentName}</h4>
                <p className="text-xs text-gray-600 mb-4">for successfully completing</p>
                <h5 className="font-bold text-gray-800 mb-8">{selectedCert.courseName}</h5>
                <div className="flex justify-between items-end text-[10px] text-gray-500">
                  <span>{new Date(selectedCert.issueDate).toLocaleDateString()}</span>
                  <img src="https://placehold.co/40x40?text=Seal" alt="Seal" />
                  <span>{selectedCert.instructorName}</span>
                </div>
              </div>
            </div>

            {
    /* Details Section */
  }
            <div className="w-full md:w-1/2 p-8 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-heading">Certificate Details</h2>
                <button onClick={() => {
    setSelectedCert(null);
    setShowRevokeConfirm(false);
  }} className="text-caption hover:text-heading">×</button>
              </div>

              <div className="space-y-6 flex-1">
                {
    /* Status Badge */
  }
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-gray-50">
                  <div>
                    <p className="text-sm text-caption mb-1">Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${selectedCert.status === "Valid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {selectedCert.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-caption mb-1">Certificate ID</p>
                    <p className="font-mono font-bold text-primary">{selectedCert.certificateId}</p>
                  </div>
                </div>

                {
    /* Info List */
  }
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5"><User className="w-5 h-5 text-caption" /></div>
                    <div>
                      <p className="text-sm text-caption">Student Name</p>
                      <p className="font-medium text-heading">{selectedCert.studentName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5"><BookOpen className="w-5 h-5 text-caption" /></div>
                    <div>
                      <p className="text-sm text-caption">Course</p>
                      <p className="font-medium text-heading">{selectedCert.courseName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5"><User className="w-5 h-5 text-caption" /></div>
                    <div>
                      <p className="text-sm text-caption">Instructor</p>
                      <p className="font-medium text-heading">{selectedCert.instructorName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5"><Calendar className="w-5 h-5 text-caption" /></div>
                    <div>
                      <p className="text-sm text-caption">Issue Date</p>
                      <p className="font-medium text-heading">{new Date(selectedCert.issueDate).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {selectedCert.status === "Revoked" && selectedCert.revokeReason && <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-sm font-bold text-red-800 mb-1">Revocation Reason:</p>
                    <p className="text-sm text-red-600">{selectedCert.revokeReason}</p>
                  </div>}
              </div>

              {
    /* Actions */
  }
              <div className="mt-8 pt-6 border-t border-border">
                {showRevokeConfirm ? <div className="space-y-4">
                    <p className="text-sm font-bold text-red-600">Are you sure you want to revoke this certificate?</p>
                    <textarea
    placeholder="Reason for revocation (required)"
    value={revokeReason}
    onChange={(e) => setRevokeReason(e.target.value)}
    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-1 focus:ring-red-500 outline-none resize-none"
    rows={3}
  />
                    <div className="flex gap-3">
                      <button onClick={() => setShowRevokeConfirm(false)} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                      <button onClick={handleRevoke} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">Confirm Revoke</button>
                    </div>
                  </div> : <div className="flex gap-3">
                    <button
    onClick={() => handleDownload(selectedCert.certificateId)}
    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
  >
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                    {selectedCert.status === "Valid" && <button
    onClick={() => setShowRevokeConfirm(true)}
    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
  >
                        <XCircle className="w-4 h-4" /> Revoke
                      </button>}
                  </div>}
              </div>

            </div>
          </div>
        </div>}
    </div>;
};
var stdin_default = AdminIssuedCertificates;
export {
  stdin_default as default
};

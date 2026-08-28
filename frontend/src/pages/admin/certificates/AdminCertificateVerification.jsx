import { useState } from "react";
import { Search, CheckCircle, XCircle, ShieldCheck, User, BookOpen, Calendar } from "lucide-react";
import apiClient from "../../../api/client";
const AdminCertificateVerification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsVerifying(true);
    setResult(null);
    setError(null);
    try {
      const res = await apiClient.get(`/admin/certificate/verify/${searchQuery}`);
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Certificate not found or invalid");
    } finally {
      setIsVerifying(false);
    }
  };
  return <div className="space-y-8 max-w-4xl mx-auto">
      {
    /* Header */
  }
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-heading">Certificate Verification</h1>
        <p className="text-body max-w-xl mx-auto">
          Verify the authenticity of course completion certificates issued by the LMS platform.
        </p>
      </div>

      {
    /* Search Box */
  }
      <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
        <form onSubmit={handleVerify} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-caption" />
            <input
    type="text"
    placeholder="Enter Certificate ID or Student Name..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-12 pr-4 py-4 text-base border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-colors font-medium"
  />
          </div>
          <button
    type="submit"
    disabled={isVerifying || !searchQuery.trim()}
    className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
  >
            {isVerifying ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>

      {
    /* Results Section */
  }
      {error && <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Verification Failed</h2>
          <p className="text-red-600 text-lg">{error}</p>
        </div>}

      {result && <div className="bg-white rounded-2xl border-2 border-border shadow-lg overflow-hidden animate-fade-in">
          {
    /* Result Header */
  }
          <div className={`p-6 text-center ${result.status === "Valid" ? "bg-emerald-50 border-b border-emerald-100" : "bg-red-50 border-b border-red-100"}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${result.status === "Valid" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
              {result.status === "Valid" ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>
            <h2 className={`text-2xl font-bold mb-1 ${result.status === "Valid" ? "text-emerald-800" : "text-red-800"}`}>
              Certificate is {result.status}
            </h2>
            <p className={`font-medium ${result.status === "Valid" ? "text-emerald-600" : "text-red-600"}`}>
              ID: {result.certificateId}
            </p>
          </div>

          {
    /* Details */
  }
          <div className="p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 bg-gray-100 p-2 rounded-xl shrink-0 border border-border">
              {
    /* Mock QR Code for display */
  }
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${result.verificationUrl}`} alt="QR Code" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            
            <div className="flex-1 space-y-6 w-full">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-caption" />
                    <span className="text-sm text-caption">Student Name</span>
                  </div>
                  <p className="text-lg font-bold text-heading">{result.studentName}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-caption" />
                    <span className="text-sm text-caption">Issue Date</span>
                  </div>
                  <p className="text-lg font-bold text-heading">{new Date(result.issueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-caption" />
                  <span className="text-sm text-caption">Course Completed</span>
                </div>
                <p className="text-lg font-bold text-heading">{result.courseName}</p>
                <p className="text-body mt-1">Instructor: {result.instructorName}</p>
              </div>

              {result.status === "Revoked" && <div className="pt-6 border-t border-border">
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <p className="text-sm font-bold text-red-800 mb-1">Revocation Reason</p>
                    <p className="text-red-600 font-medium">{result.revokeReason}</p>
                  </div>
                </div>}
            </div>
          </div>
        </div>}
    </div>;
};
var stdin_default = AdminCertificateVerification;
export {
  stdin_default as default
};

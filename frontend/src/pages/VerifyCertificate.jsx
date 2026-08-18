import { useParams, Link } from "react-router-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
const mockVerificationData = {
  id: "CERT-IOT-123456",
  studentName: "John Doe",
  courseTitle: "IoT Fundamentals",
  instructorName: "Sarah Jenkins",
  completionDate: "2026-07-20T23:59:59Z",
  issuedDate: "2026-07-21T10:00:00Z",
  isValid: true
};
const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const isMatch = certificateId === mockVerificationData.id;
  return <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-sans">
      
      <div className="mb-8">
        <Link to="/" className="text-3xl font-heading font-black text-primary tracking-tight">
          LMS<span className="text-heading">Platform</span>
        </Link>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-border overflow-hidden">
        
        {
    /* Header Area */
  }
        <div className={`p-8 md:p-12 text-center ${isMatch ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-emerald-100" : "bg-red-50 border-b border-red-100"}`}>
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            {isMatch ? <CheckCircle2 className="w-10 h-10 text-emerald-500" /> : <AlertCircle className="w-10 h-10 text-red-500" />}
          </div>
          <h1 className="text-3xl font-heading font-bold text-heading mb-2">
            {isMatch ? "Certificate Verified" : "Invalid Certificate"}
          </h1>
          <p className="text-body font-medium">
            {isMatch ? "This is a valid certificate issued by LMSPlatform." : "We could not find a certificate matching this ID."}
          </p>
        </div>

        {
    /* Details Area */
  }
        {isMatch && <div className="p-8 md:p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              
              <div className="w-full bg-gray-50 rounded-2xl p-6 border border-border">
                <div className="text-caption text-xs font-bold uppercase tracking-wider mb-1">Presented To</div>
                <div className="text-2xl font-bold text-heading">{mockVerificationData.studentName}</div>
              </div>

              <div className="space-y-1">
                <div className="text-caption text-xs font-bold uppercase tracking-wider">For successfully completing</div>
                <div className="text-xl font-heading font-bold text-primary">{mockVerificationData.courseTitle}</div>
                <div className="text-sm font-medium text-caption pt-1">Instructor: {mockVerificationData.instructorName}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-border">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-caption text-[10px] font-bold uppercase tracking-wider mb-1">Issued On</div>
                  <div className="font-bold text-heading text-sm">{new Date(mockVerificationData.issuedDate).toLocaleDateString()}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-caption text-[10px] font-bold uppercase tracking-wider mb-1">Certificate ID</div>
                  <div className="font-bold text-heading font-mono text-xs break-all">{mockVerificationData.id}</div>
                </div>
              </div>

            </div>
          </div>}

      </div>

      <div className="mt-8 text-center text-sm text-caption">
        Want to build your own skills? <Link to="/login" className="text-primary font-bold hover:underline">Explore our courses</Link>
      </div>
    </div>;
};
var stdin_default = VerifyCertificate;
export {
  stdin_default as default
};

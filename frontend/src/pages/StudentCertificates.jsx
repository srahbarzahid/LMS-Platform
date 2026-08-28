import { useState, useEffect } from "react";
import { Award, Download, ExternalLink, CheckCircle2, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import { studentApi } from "../api/studentApi";

const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const response = await studentApi.getCertificates();
        if (response.success && Array.isArray(response.data)) {
          setCertificates(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch student certificates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <div className="flex py-20 items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading mb-2">My Certificates</h1>
          <p className="text-caption">View, download, and verify your course completion certificates.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Award className="w-5 h-5" /> {certificates.length} Earned
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Earned Certificates */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-heading font-bold text-heading">Earned Certificates</h2>

          {certificates.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-border border-dashed text-center">
              <Award className="w-16 h-16 text-caption mx-auto mb-4 opacity-50" />
              <h3 className="font-heading font-bold text-lg text-heading mb-2">No certificates yet</h3>
              <p className="text-caption max-w-sm mx-auto">
                Complete 100% of all lessons, quizzes, and assignments in a course to earn your verified certificate of completion!
              </p>
              <Link
                to="/student/my-courses"
                className="mt-4 inline-block bg-primary text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-secondary transition-colors"
              >
                Go to My Courses
              </Link>
            </div>
          ) : (
            certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow group flex flex-col sm:flex-row"
              >
                {/* Visual Preview */}
                <div className="sm:w-64 bg-slate-800 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Award className="w-32 h-32 text-white" />
                  </div>
                  <Award className="w-12 h-12 text-primary mb-3 relative z-10" />
                  <div className="text-white font-heading font-bold text-lg mb-1 relative z-10">{cert.courseTitle}</div>
                  <div className="text-slate-400 text-xs relative z-10">Certificate of Completion</div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                      <span className="text-caption text-xs font-mono">{cert.serialNumber}</span>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-heading">{cert.courseTitle}</h3>
                    <p className="text-xs text-caption mt-1">Instructor: {cert.instructorName}</p>
                    <p className="text-xs text-caption">Issued Date: {cert.issueDate}</p>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center gap-3">
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-secondary transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Verification Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-border shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-lg text-heading">Certificate Verification</h3>
            <p className="text-xs text-caption leading-relaxed">
              All certificates issued by Pi Tech LMS are digitally signed and contain a unique serial number. Anyone can verify the authenticity of a certificate using our public verification portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCertificates;

import { useState } from 'react';
import { Award, Download, ExternalLink, CheckCircle2, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockCertificates = [
  {
    id: 'CERT-IOT-123456',
    courseTitle: 'IoT Fundamentals',
    instructorName: 'Sarah Jenkins',
    completionDate: '2026-07-20T23:59:59Z',
    issuedDate: '2026-07-21T10:00:00Z',
    status: 'Verified',
    pdfUrl: '#',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example.com/verify/CERT-IOT-123456',
    verificationUrl: '/verify-certificate/CERT-IOT-123456'
  }
];

const mockCoursesInProgress = [
  { id: 2, courseTitle: 'Advanced Robotics', progress: 85 }
];

const StudentCertificates = () => {
  return (
    <div className="space-y-8 pb-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading mb-2">My Certificates</h1>
          <p className="text-caption">View, download, and verify your course completion certificates.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Award className="w-5 h-5" /> {mockCertificates.length} Earned
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Earned Certificates */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-heading font-bold text-heading">Earned Certificates</h2>
          
          {mockCertificates.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-border border-dashed text-center">
              <Award className="w-16 h-16 text-caption mx-auto mb-4 opacity-50" />
              <h3 className="font-heading font-bold text-lg text-heading mb-2">No certificates yet</h3>
              <p className="text-caption">Complete all lessons, quizzes, and projects in a course to earn your first certificate!</p>
            </div>
          ) : (
            mockCertificates.map((cert) => (
              <div key={cert.id} className="bg-white rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow group flex flex-col sm:flex-row">
                
                {/* Visual Preview */}
                <div className="sm:w-64 bg-slate-800 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Award className="w-32 h-32 text-white" />
                  </div>
                  <Award className="w-12 h-12 text-primary mb-3 relative z-10" />
                  <div className="text-white font-heading font-bold text-lg mb-1 relative z-10">{cert.courseTitle}</div>
                  <div className="text-slate-400 text-xs relative z-10">Certificate of Completion</div>
                </div>

                {/* Details & Actions */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-heading font-bold text-xl text-heading mb-1">{cert.courseTitle}</h3>
                      <p className="text-sm font-medium text-primary">Instructor: {cert.instructorName}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {cert.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                      <div className="text-caption text-xs uppercase tracking-wider font-bold mb-1">Issued Date</div>
                      <div className="font-medium text-heading">{new Date(cert.issuedDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-caption text-xs uppercase tracking-wider font-bold mb-1">Certificate ID</div>
                      <div className="font-medium text-heading font-mono text-xs bg-gray-50 px-2 py-1 rounded">{cert.id}</div>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:bg-secondary transition-colors shadow-lg shadow-primary/20">
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                    <Link to={cert.verificationUrl} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-border text-heading font-bold text-sm rounded-lg hover:bg-gray-100 transition-colors">
                      <ExternalLink className="w-4 h-4 text-caption" /> Verification Page
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Progress */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-heading font-bold text-heading">In Progress</h2>
          
          <div className="bg-white rounded-3xl p-6 border border-border shadow-sm">
            {mockCoursesInProgress.length === 0 ? (
              <p className="text-caption text-sm text-center">No courses currently in progress.</p>
            ) : (
              <div className="space-y-6">
                {mockCoursesInProgress.map(course => (
                  <div key={course.id}>
                    <div className="flex justify-between items-end mb-2">
                      <div className="font-bold text-heading text-sm">{course.courseTitle}</div>
                      <div className="text-xs font-bold text-primary">{course.progress}%</div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <p className="text-xs text-caption mt-2">Finish remaining modules and projects to earn your certificate.</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 border border-blue-100">
            <QrCode className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-heading font-bold text-heading mb-2">Easily Verifiable</h3>
            <p className="text-sm text-body leading-relaxed">
              Every certificate has a unique QR code and verification URL. You can share it on LinkedIn or with employers to prove your skills!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentCertificates;

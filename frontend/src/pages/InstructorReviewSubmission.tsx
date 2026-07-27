import { useState } from 'react';
import { ArrowLeft, CheckCircle2, MessageSquare, Download, Link as LinkIcon, RefreshCcw } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const mockSubmission = {
  id: 101,
  studentName: 'John Doe',
  course: 'IoT Fundamentals',
  projectTitle: 'Build a Weather Station',
  submittedDate: '2026-07-18T10:30:00Z',
  status: 'Under Review',
  file: 'weather_station_code.zip',
  link: 'https://github.com/johndoe/weather-station',
  note: 'I used a DHT22 instead of DHT11 for better accuracy as requested.',
  maxMarks: 100
};

const InstructorReviewSubmission = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleGrade = (action: 'GRADE' | 'RESUBMIT') => {
    alert(action === 'GRADE' ? 'Grades saved successfully!' : 'Resubmission requested!');
    navigate('/instructor/projects');
  };

  return (
    <div className="space-y-8 pb-8 max-w-5xl mx-auto">
      
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <Link to="/instructor/projects" className="inline-flex items-center gap-2 text-caption hover:text-primary transition-colors font-medium mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Project
          </Link>
          <div className="text-primary font-bold text-sm tracking-wider uppercase mb-2">
            Review Submission
          </div>
          <h1 className="text-3xl font-heading font-bold text-heading mb-1">{mockSubmission.studentName}</h1>
          <p className="text-caption font-medium">{mockSubmission.projectTitle} • {mockSubmission.course}</p>
        </div>
        
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold text-sm">
          Status: {mockSubmission.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Student's Work */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm space-y-6">
          <h2 className="text-xl font-heading font-bold text-heading border-b border-border pb-4">Student's Work</h2>
          
          <div className="space-y-1">
            <span className="text-xs font-bold text-caption uppercase tracking-wider">Submitted On</span>
            <p className="font-medium">{new Date(mockSubmission.submittedDate).toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-caption uppercase tracking-wider">Submitted File</span>
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-border rounded-xl">
              <span className="font-medium text-sm truncate">{mockSubmission.file}</span>
              <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline shrink-0">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-caption uppercase tracking-wider">Submitted Link</span>
            <div className="flex items-center p-4 bg-gray-50 border border-border rounded-xl">
              <LinkIcon className="w-4 h-4 text-caption shrink-0 mr-3" />
              <a href={mockSubmission.link} target="_blank" rel="noreferrer" className="text-primary font-medium text-sm truncate hover:underline">
                {mockSubmission.link}
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-caption uppercase tracking-wider">Student Note</span>
            <div className="p-4 bg-gray-50 border border-border rounded-xl text-sm leading-relaxed text-body italic">
              "{mockSubmission.note}"
            </div>
          </div>
        </div>

        {/* Right: Grading Form */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm space-y-6">
          <h2 className="text-xl font-heading font-bold text-heading border-b border-border pb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" /> Grading & Feedback
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-bold text-heading">Marks Obtained (Out of {mockSubmission.maxMarks})</label>
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="e.g. 95" 
                className="w-32 px-4 py-3 bg-gray-50 border border-border rounded-xl text-lg font-bold outline-none focus:border-primary transition-colors text-center"
              />
              <span className="text-caption font-bold">/ {mockSubmission.maxMarks}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-heading flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Instructor Feedback
            </label>
            <textarea 
              rows={6} 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide constructive feedback to the student..." 
              className="w-full p-4 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors custom-scrollbar"
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => handleGrade('GRADE')}
              className="flex-1 py-3.5 bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> Mark as Graded
            </button>
            <button 
              onClick={() => handleGrade('RESUBMIT')}
              className="flex-1 py-3.5 bg-orange-100 text-orange-700 font-bold rounded-xl hover:bg-orange-200 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-5 h-5" /> Request Resubmission
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default InstructorReviewSubmission;

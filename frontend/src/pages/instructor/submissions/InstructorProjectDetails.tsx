import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Code, MonitorPlay, ExternalLink, Check } from 'lucide-react';
import { useState } from 'react';

const InstructorProjectDetails = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [marks, setMarks] = useState('85');
  const [feedback, setFeedback] = useState('Great use of whitespace and typography. The dashboard looks clean and modern. I noticed a few contrast issues on the sidebar icons, but otherwise a very solid submission.');

  // Simulated Graded State
  const isGraded = true;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white border border-border rounded-xl text-caption hover:text-heading hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-heading font-bold text-heading">Project Submission</h1>
          <div className="text-sm text-caption mt-1">Reviewing submission {submissionId}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
        
        {/* Submission Info */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6 mb-6">
          <div>
            <h2 className="text-xl font-bold text-heading">Mobile App Redesign</h2>
            <div className="text-sm font-medium text-primary mt-1">UI/UX Masterclass</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-heading">Bob Johnson</div>
            <div className="text-xs text-caption">Submitted: March 18, 2026</div>
            <span className="inline-flex mt-2 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
              Graded
            </span>
          </div>
        </div>

        {/* Student Content */}
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-sm font-bold text-heading mb-2">Student's Note</h3>
            <p className="text-sm text-body bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
              "Here is my final project. I focused heavily on accessibility and dark mode support. Included the Figma link and a brief Loom walkthrough."
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-heading mb-2">Submitted Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="#" className="flex items-center justify-between p-4 bg-gray-50 border border-border rounded-xl hover:bg-white hover:shadow-sm transition-all group">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-bold text-heading">GitHub Repository</span>
                </div>
                <ExternalLink className="w-4 h-4 text-caption group-hover:text-primary" />
              </a>
              <a href="#" className="flex items-center justify-between p-4 bg-gray-50 border border-border rounded-xl hover:bg-white hover:shadow-sm transition-all group">
                <div className="flex items-center gap-3">
                  <MonitorPlay className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-bold text-heading">YouTube Demo</span>
                </div>
                <ExternalLink className="w-4 h-4 text-caption group-hover:text-primary" />
              </a>
            </div>
          </div>
        </div>

        {/* Grading Section */}
        <div className={`border rounded-xl p-6 ${isGraded ? 'bg-green-50/30 border-green-100' : 'bg-gray-50 border-border'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-heading text-lg">Evaluation</h3>
            {isGraded && (
              <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Already Graded
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-heading mb-2">Marks (/100)</label>
              <input 
                type="number" 
                max="100"
                min="0"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full max-w-[200px] px-4 py-2 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-heading"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-heading mb-2">Feedback to Student</label>
              <textarea 
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y text-body"
              ></textarea>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-border">
            <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-secondary transition-colors cursor-pointer">
              <Check className="w-4 h-4" /> Update Grade
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstructorProjectDetails;

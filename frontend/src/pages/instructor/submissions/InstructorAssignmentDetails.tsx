import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Check, Save } from 'lucide-react';
import { useState } from 'react';

const InstructorAssignmentDetails = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');

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
          <h1 className="text-2xl font-heading font-bold text-heading">Assignment Submission</h1>
          <div className="text-sm text-caption mt-1">Reviewing submission {submissionId}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
        
        {/* Submission Info */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6 mb-6">
          <div>
            <h2 className="text-xl font-bold text-heading">User Persona Creation</h2>
            <div className="text-sm font-medium text-primary mt-1">UI/UX Masterclass</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-heading">Alice Smith</div>
            <div className="text-xs text-caption">Submitted: March 20, 2026</div>
            <span className="inline-flex mt-2 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
              Pending Review
            </span>
          </div>
        </div>

        {/* Student Content */}
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-sm font-bold text-heading mb-2">Student's Note</h3>
            <p className="text-sm text-body bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
              "Hi, I've attached my PDF with the 3 user personas based on the e-commerce brief. I struggled a bit with the psychographics for the third persona."
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-heading mb-2">Submitted Files</h3>
            <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="font-bold text-heading text-sm">alice_personas_final.pdf</div>
                  <div className="text-xs text-caption">2.4 MB</div>
                </div>
              </div>
              <button className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-white border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors shadow-sm cursor-pointer">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        </div>

        {/* Grading Section */}
        <div className="bg-gray-50 border border-border rounded-xl p-6">
          <h3 className="font-bold text-heading mb-4 text-lg">Evaluation</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-heading mb-2">Marks (/100)</label>
              <input 
                type="number" 
                max="100"
                min="0"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full max-w-[200px] px-4 py-2 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="e.g. 85"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-heading mb-2">Feedback to Student</label>
              <textarea 
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y"
                placeholder="Provide constructive feedback here..."
              ></textarea>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-border">
            <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-secondary transition-colors cursor-pointer">
              <Check className="w-4 h-4" /> Grade Assignment
            </button>
            <button className="flex items-center gap-2 bg-white border border-border text-heading px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <button className="flex items-center gap-2 bg-white border border-red-200 text-red-600 px-6 py-2.5 rounded-xl font-bold hover:bg-red-50 transition-colors shadow-sm ml-auto cursor-pointer">
              Request Resubmission
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstructorAssignmentDetails;

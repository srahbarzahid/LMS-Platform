import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, FileText, Download, Check, RefreshCcw } from "lucide-react";
import { instructorApi } from "../../../api/instructorApi";
import { getApiErrorMessage } from "../../../api/client";

const formatDate = (value) => {
  if (!value) return "Not submitted";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
};

const statusClass = (status = "") => {
  if (status === "Graded") return "bg-green-100 text-green-700";
  if (status === "Resubmission Requested") return "bg-red-100 text-red-700";
  if (status === "Under Review") return "bg-blue-100 text-blue-700";
  return "bg-yellow-100 text-yellow-700";
};

const InstructorAssignmentDetails = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadSubmission = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await instructorApi.getAssignmentSubmissionDetails(submissionId);
        const data = response.data || response;
        if (!isMounted) return;
        setSubmission(data);
        setMarks(data.marks ?? "");
        setFeedback(data.feedback || "");
      } catch (err) {
        if (isMounted) setError(getApiErrorMessage(err, "Failed to load assignment submission"));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSubmission();
    return () => {
      isMounted = false;
    };
  }, [submissionId]);

  const handleGrade = async () => {
    if (marks === "" || Number.isNaN(Number(marks))) {
      toast.error("Enter valid marks before grading");
      return;
    }

    try {
      setSaving(true);
      await instructorApi.gradeAssignmentSubmission(submissionId, { marks: Number(marks), feedback, status: "GRADED" });
      setSubmission((prev) => ({ ...prev, marks: Number(marks), feedback, status: "Graded" }));
      toast.success("Assignment graded");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to grade assignment"));
    } finally {
      setSaving(false);
    }
  };

  const handleRequestResubmission = async () => {
    try {
      setSaving(true);
      await instructorApi.requestAssignmentResubmission(submissionId, { feedback });
      setSubmission((prev) => ({ ...prev, feedback, status: "Resubmission Requested" }));
      toast.success("Resubmission requested");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to request resubmission"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto p-8 text-center text-caption">Loading assignment submission...</div>;
  }

  if (error || !submission) {
    return <div className="max-w-4xl mx-auto space-y-4 p-8 text-center">
      <p className="font-bold text-red-600">{error || "Assignment submission not found"}</p>
      <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white border border-border rounded-xl font-bold text-heading">
        Back
      </button>
    </div>;
  }

  return <div className="max-w-4xl mx-auto space-y-6 pb-8">
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
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6 mb-6">
          <div>
            <h2 className="text-xl font-bold text-heading">{submission.assignmentTitle}</h2>
            <div className="text-sm font-medium text-primary mt-1">{submission.course}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-heading">{submission.studentName}</div>
            <div className="text-xs text-caption">Submitted: {formatDate(submission.submissionDate)}</div>
            <span className={`inline-flex mt-2 px-2.5 py-1 rounded-full text-xs font-bold ${statusClass(submission.status)}`}>
              {submission.status}
            </span>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-sm font-bold text-heading mb-2">Student's Note</h3>
            <p className="text-sm text-body bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
              {submission.studentNote || "No note added by the student."}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-heading mb-2">Submitted Files</h3>
            {submission.file ? (
              <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-8 h-8 text-blue-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-heading text-sm truncate">{submission.file.name}</div>
                    <div className="text-xs text-caption">Uploaded file</div>
                  </div>
                </div>
                <a href={submission.file.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-white border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors shadow-sm cursor-pointer">
                  <Download className="w-4 h-4" /> Download
                </a>
              </div>
            ) : (
              <div className="bg-gray-50 border border-border rounded-xl p-4 text-sm text-caption">No file was attached.</div>
            )}
          </div>
        </div>

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
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-border">
            <button disabled={saving} onClick={handleGrade} className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-secondary transition-colors cursor-pointer disabled:opacity-60">
              <Check className="w-4 h-4" /> Grade Assignment
            </button>
            <button disabled={saving} onClick={handleRequestResubmission} className="flex items-center gap-2 bg-white border border-red-200 text-red-600 px-6 py-2.5 rounded-xl font-bold hover:bg-red-50 transition-colors shadow-sm ml-auto cursor-pointer disabled:opacity-60">
              <RefreshCcw className="w-4 h-4" /> Request Resubmission
            </button>
          </div>
        </div>
      </div>
    </div>;
};

export default InstructorAssignmentDetails;

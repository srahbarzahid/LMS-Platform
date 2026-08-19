import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Clock, Target, AlertTriangle } from "lucide-react";
import { instructorApi } from "../../../api/instructorApi";
import { getApiErrorMessage } from "../../../api/client";

const formatDate = (value) => {
  if (!value) return "Not attempted";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
};

const resultStatusClass = (status = "") => {
  if (status === "Pass") return "text-green-600";
  if (status === "Fail") return "text-red-600";
  return "text-caption";
};

const InstructorQuizResultDetails = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadResult = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await instructorApi.getQuizResultDetails(resultId);
        if (isMounted) setResult(response.data || response);
      } catch (err) {
        if (isMounted) setError(getApiErrorMessage(err, "Failed to load quiz result"));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadResult();
    return () => {
      isMounted = false;
    };
  }, [resultId]);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-8 text-center text-caption">Loading quiz result...</div>;
  }

  if (error || !result) {
    return <div className="max-w-4xl mx-auto space-y-4 p-8 text-center">
      <AlertTriangle className="w-8 h-8 mx-auto text-red-500" />
      <p className="font-bold text-red-600">{error || "Quiz result not found"}</p>
      <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white border border-border rounded-xl font-bold text-heading">
        Back
      </button>
    </div>;
  }

  const correctCount = result.questions.filter((question) => question.correct === true).length;
  const wrongCount = result.questions.filter((question) => question.correct === false).length;

  return <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white border border-border rounded-xl text-caption hover:text-heading hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-heading font-bold text-heading">Quiz Result</h1>
          <div className="text-sm text-caption mt-1">Reviewing result {resultId}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border bg-gray-50/50">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-heading">{result.quizName}</h2>
              <div className="text-sm font-medium text-primary mt-1">{result.course}</div>
              <div className="flex items-center gap-2 mt-4 text-sm text-body">
                <span className="font-bold text-heading">{result.studentName}</span>
                <span className="text-border">-</span>
                <span>{formatDate(result.date)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-white border border-border rounded-xl p-4 text-center min-w-[100px] shadow-sm">
                <div className="text-xs text-caption font-bold mb-1">SCORE</div>
                <div className="text-2xl font-heading font-bold text-heading">{result.score}/{result.totalQuestions}</div>
                <div className={`text-xs font-bold mt-1 ${resultStatusClass(result.status)}`}>
                  {result.percentage}% - {result.status}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-caption">Time Taken</div>
                <div className="font-bold text-heading text-sm">{result.timeTaken}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-caption">Attempt</div>
                <div className="font-bold text-heading text-sm">#{result.attemptNumber}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-caption">Correct</div>
                <div className="font-bold text-heading text-sm">{correctCount} Answers</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <XCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-caption">Wrong</div>
                <div className="font-bold text-heading text-sm">{wrongCount} Answers</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h3 className="font-bold text-heading text-lg mb-6">Question Breakdown</h3>

          <div className="space-y-6">
            {result.questions.length ? result.questions.map((question, idx) => {
              const answered = question.correct === true || question.correct === false;
              return <div key={question.id} className="border border-border rounded-xl overflow-hidden">
                <div className={`p-4 border-b border-border flex items-start gap-3 ${question.correct === true ? "bg-green-50/30" : question.correct === false ? "bg-red-50/30" : "bg-gray-50/50"}`}>
                  {question.correct === true && <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />}
                  {question.correct === false && <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                  {!answered && <Clock className="w-5 h-5 text-caption shrink-0 mt-0.5" />}
                  <div>
                    <div className="text-xs font-bold text-caption mb-1">Question {idx + 1}</div>
                    <div className="font-bold text-heading text-sm">{question.text}</div>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/50 text-sm">
                  <div>
                    <span className="text-caption text-xs block mb-1">Student's Answer</span>
                    <span className={`font-medium ${question.correct === true ? "text-green-700" : question.correct === false ? "text-red-700" : "text-caption"}`}>
                      {question.studentAnswer || "Not answered"}
                    </span>
                  </div>
                  <div>
                    <span className="text-caption text-xs block mb-1">Correct Answer</span>
                    <span className="font-medium text-green-700">
                      {question.correctAnswer || "Not configured"}
                    </span>
                  </div>
                </div>
              </div>;
            }) : (
              <div className="bg-gray-50 border border-border rounded-xl p-4 text-sm text-caption">No questions configured for this quiz.</div>
            )}
          </div>
        </div>
      </div>
    </div>;
};

export default InstructorQuizResultDetails;

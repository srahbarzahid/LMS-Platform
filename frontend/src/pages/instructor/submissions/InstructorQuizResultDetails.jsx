import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Clock, Target } from "lucide-react";
const InstructorQuizResultDetails = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const mockResult = {
    quizName: "UX Fundamentals",
    studentName: "Charlie Brown",
    course: "UI/UX Masterclass",
    score: 18,
    totalQuestions: 20,
    percentage: 90,
    status: "Pass",
    attemptNumber: 1,
    timeTaken: "14 mins 30 secs",
    date: "March 21, 2026",
    questions: [
      { id: 1, text: "What does UX stand for?", type: "multiple_choice", correct: true, studentAnswer: "User Experience", correctAnswer: "User Experience" },
      { id: 2, text: "Which color mode is best for print?", type: "multiple_choice", correct: false, studentAnswer: "RGB", correctAnswer: "CMYK" },
      { id: 3, text: "Describe a wireframe.", type: "true_false", correct: true, studentAnswer: "A low-fidelity structural design", correctAnswer: "A low-fidelity structural design" }
    ]
  };
  return <div className="max-w-4xl mx-auto space-y-6 pb-8">
      
      {
    /* Header */
  }
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
        
        {
    /* Top Info Area */
  }
        <div className="p-8 border-b border-border bg-gray-50/50">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-heading">{mockResult.quizName}</h2>
              <div className="text-sm font-medium text-primary mt-1">{mockResult.course}</div>
              <div className="flex items-center gap-2 mt-4 text-sm text-body">
                <span className="font-bold text-heading">{mockResult.studentName}</span>
                <span className="text-border">•</span>
                <span>{mockResult.date}</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white border border-border rounded-xl p-4 text-center min-w-[100px] shadow-sm">
                <div className="text-xs text-caption font-bold mb-1">SCORE</div>
                <div className="text-2xl font-heading font-bold text-heading">{mockResult.score}/{mockResult.totalQuestions}</div>
                <div className={`text-xs font-bold mt-1 ${mockResult.status === "Pass" ? "text-green-600" : "text-red-600"}`}>
                  {mockResult.percentage}% - {mockResult.status}
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
                <div className="font-bold text-heading text-sm">{mockResult.timeTaken}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-caption">Attempt</div>
                <div className="font-bold text-heading text-sm">#{mockResult.attemptNumber}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-caption">Correct</div>
                <div className="font-bold text-heading text-sm">{mockResult.score} Answers</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <XCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-caption">Wrong</div>
                <div className="font-bold text-heading text-sm">{mockResult.totalQuestions - mockResult.score} Answers</div>
              </div>
            </div>
          </div>
        </div>

        {
    /* Detailed Breakdown */
  }
        <div className="p-8">
          <h3 className="font-bold text-heading text-lg mb-6">Question Breakdown</h3>
          
          <div className="space-y-6">
            {mockResult.questions.map((q, idx) => <div key={q.id} className="border border-border rounded-xl overflow-hidden">
                <div className={`p-4 border-b border-border flex items-start gap-3 ${q.correct ? "bg-green-50/30" : "bg-red-50/30"}`}>
                  {q.correct ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                  <div>
                    <div className="text-xs font-bold text-caption mb-1">Question {idx + 1}</div>
                    <div className="font-bold text-heading text-sm">{q.text}</div>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/50 text-sm">
                  <div>
                    <span className="text-caption text-xs block mb-1">Student's Answer</span>
                    <span className={`font-medium ${q.correct ? "text-green-700" : "text-red-700"}`}>
                      {q.studentAnswer}
                    </span>
                  </div>
                  {!q.correct && <div>
                      <span className="text-caption text-xs block mb-1">Correct Answer</span>
                      <span className="font-medium text-green-700">
                        {q.correctAnswer}
                      </span>
                    </div>}
                </div>
              </div>)}
          </div>
        </div>

      </div>
    </div>;
};
var stdin_default = InstructorQuizResultDetails;
export {
  stdin_default as default
};

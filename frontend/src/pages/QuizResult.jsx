import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Clock, Award } from "lucide-react";
const mockQuizResult = {
  id: 1,
  title: "Embedded Systems Basics",
  course: "Mastering Embedded Systems & IoT",
  timeTaken: "24 mins 15 secs",
  score: 25,
  totalMarks: 30,
  passingMarks: 20,
  passed: true,
  questions: [
    {
      id: 1,
      text: "What is the primary function of a microcontroller?",
      options: ["To act as memory", "To process data and control devices", "To store power", "To display graphics"],
      correct: 1,
      selected: 1
    },
    {
      id: 2,
      text: "Which of the following is NOT a type of memory used in embedded systems?",
      options: ["RAM", "ROM", "EEPROM", "HDD"],
      correct: 3,
      selected: 2
      // Incorrect answer picked
    },
    {
      id: 3,
      text: "What does GPIO stand for?",
      options: ["General Purpose Input Output", "Global Position In Output", "Generated Power Internal Oscillator", "General Process Interruption Object"],
      correct: 0,
      selected: 0
    },
    {
      id: 4,
      text: "Which communication protocol uses a master-slave architecture with SDA and SCL lines?",
      options: ["SPI", "UART", "I2C", "CAN"],
      correct: 2,
      selected: 2
    },
    {
      id: 5,
      text: "What is the purpose of an ADC in an embedded system?",
      options: ["Convert AC to DC power", "Convert Analog signals to Digital numbers", "Amplify Digital Codes", "Automatically Detect Current"],
      correct: 1,
      selected: 1
    }
  ]
};
const QuizResult = () => {
  useParams();
  const percentage = Math.round(mockQuizResult.score / mockQuizResult.totalMarks * 100);
  return <div className="space-y-8 pb-8 max-w-4xl mx-auto">
      
      {
    /* Header */
  }
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm">
        <Link to="/student/quizzes" className="inline-flex items-center gap-2 text-caption hover:text-primary transition-colors font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Quizzes
        </Link>

        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
          <div>
            <div className="mb-2 text-sm font-bold tracking-wider text-primary uppercase">{mockQuizResult.course}</div>
            <h1 className="text-3xl font-heading font-bold text-heading mb-2">{mockQuizResult.title} - Results</h1>
          </div>
          
          <div className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 ${mockQuizResult.passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
            {mockQuizResult.passed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {mockQuizResult.passed ? "PASSED" : "FAILED"}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <div className="bg-gray-50 rounded-2xl p-4 border border-border text-center">
            <div className="text-caption text-xs font-medium mb-1 flex items-center justify-center gap-1.5">
              <Award className="w-4 h-4" /> Score
            </div>
            <div className="text-xl font-heading font-bold text-heading">{mockQuizResult.score} / {mockQuizResult.totalMarks}</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-border text-center">
            <div className="text-caption text-xs font-medium mb-1">Percentage</div>
            <div className="text-xl font-heading font-bold text-heading">{percentage}%</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-border text-center">
            <div className="text-caption text-xs font-medium mb-1">Passing Marks</div>
            <div className="text-xl font-heading font-bold text-heading">{mockQuizResult.passingMarks}</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-border text-center">
            <div className="text-caption text-xs font-medium mb-1 flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4" /> Time Taken
            </div>
            <div className="text-xl font-heading font-bold text-heading">{mockQuizResult.timeTaken}</div>
          </div>
        </div>
      </div>

      {
    /* Answers List */
  }
      <div className="space-y-6">
        {mockQuizResult.questions.map((q, idx) => {
    const isCorrect = q.selected === q.correct;
    return <div key={q.id} className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm">
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-border">
                <span className="font-bold text-heading">Question {idx + 1}</span>
                <span className={`text-sm font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 ${isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  {isCorrect ? <><CheckCircle2 className="w-4 h-4" /> Correct</> : <><XCircle className="w-4 h-4" /> Incorrect</>}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-heading mb-6">{q.text}</h3>

              <div className="space-y-3">
                {q.options.map((option, optIdx) => {
      const isSelected = q.selected === optIdx;
      const isActuallyCorrect = q.correct === optIdx;
      let optionStyle = "border-gray-200 bg-gray-50 text-gray-500";
      if (isSelected && isActuallyCorrect) {
        optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500 font-medium";
      } else if (isSelected && !isActuallyCorrect) {
        optionStyle = "border-red-500 bg-red-50 text-red-900 ring-1 ring-red-500 font-medium";
      } else if (!isSelected && isActuallyCorrect) {
        optionStyle = "border-emerald-500 bg-white text-emerald-700 font-medium border-dashed border-2";
      }
      return <div key={optIdx} className={`w-full p-4 rounded-xl border flex items-center gap-4 ${optionStyle}`}>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected && isActuallyCorrect ? "border-emerald-500 bg-emerald-500 text-white" : isSelected && !isActuallyCorrect ? "border-red-500 bg-red-500 text-white" : !isSelected && isActuallyCorrect ? "border-emerald-500 text-emerald-500" : "border-gray-300"}`}>
                        {isSelected && isActuallyCorrect && <CheckCircle2 className="w-4 h-4" />}
                        {isSelected && !isActuallyCorrect && <XCircle className="w-4 h-4" />}
                        {!isSelected && isActuallyCorrect && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <span>{option}</span>
                      
                      {
        /* Labels for clarity */
      }
                      {!isSelected && isActuallyCorrect && <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                          Correct Answer
                        </span>}
                      {isSelected && !isActuallyCorrect && <span className="ml-auto text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
                          Your Answer
                        </span>}
                      {isSelected && isActuallyCorrect && <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                          Your Answer
                        </span>}
                    </div>;
    })}
              </div>
            </div>;
  })}
      </div>

    </div>;
};
var stdin_default = QuizResult;
export {
  stdin_default as default
};

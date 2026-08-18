import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle2, XCircle, LayoutGrid, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
const mockQuizData = {
  id: 1,
  title: "Embedded Systems Basics",
  course: "Mastering Embedded Systems & IoT",
  instructions: "This quiz covers the fundamentals of embedded systems, microcontrollers, and basic electronics. Read each question carefully. You cannot pause the timer once started.",
  timeLimitMins: 30,
  passingMarks: 20,
  totalMarks: 30,
  questions: [
    { id: 1, text: "What is the primary function of a microcontroller?", options: ["To act as memory", "To process data and control devices", "To store power", "To display graphics"], correct: 1 },
    { id: 2, text: "Which of the following is NOT a type of memory used in embedded systems?", options: ["RAM", "ROM", "EEPROM", "HDD"], correct: 3 },
    { id: 3, text: "What does GPIO stand for?", options: ["General Purpose Input Output", "Global Position In Output", "Generated Power Internal Oscillator", "General Process Interruption Object"], correct: 0 },
    { id: 4, text: "Which communication protocol uses a master-slave architecture with SDA and SCL lines?", options: ["SPI", "UART", "I2C", "CAN"], correct: 2 },
    { id: 5, text: "What is the purpose of an ADC in an embedded system?", options: ["Convert AC to DC power", "Convert Analog signals to Digital numbers", "Amplify Digital Codes", "Automatically Detect Current"], correct: 1 }
  ]
};
const QuizPlayer = () => {
  useParams();
  const [quizState, setQuizState] = useState("PRE_QUIZ");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(mockQuizData.timeLimitMins * 60);
  const [showReview, setShowReview] = useState(false);
  useEffect(() => {
    let timer;
    if (quizState === "ACTIVE" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1e3);
    } else if (timeLeft === 0 && quizState === "ACTIVE") {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [quizState, timeLeft]);
  const handleOptionSelect = (optionIdx) => {
    if (showReview) return;
    setAnswers({
      ...answers,
      [currentQuestionIdx]: optionIdx
    });
  };
  const handleNext = () => {
    if (currentQuestionIdx < mockQuizData.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  };
  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };
  const handleSubmitClick = () => {
    setQuizState("SUBMIT_CONFIRM");
  };
  const handleSubmit = () => {
    setQuizState("RESULT");
  };
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };
  const calculateResult = () => {
    let correct = 0;
    mockQuizData.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correct++;
    });
    const score = correct / mockQuizData.questions.length * mockQuizData.totalMarks;
    const percentage = Math.round(correct / mockQuizData.questions.length * 100);
    const passed = score >= mockQuizData.passingMarks;
    const timeTaken = mockQuizData.timeLimitMins * 60 - timeLeft;
    return { correct, incorrect: mockQuizData.questions.length - correct, score, percentage, passed, timeTaken };
  };
  const currentQuestion = mockQuizData.questions[currentQuestionIdx];
  const isAnswered = (idx) => answers[idx] !== void 0;
  if (quizState === "PRE_QUIZ") {
    return <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="bg-white max-w-3xl w-full rounded-3xl p-8 lg:p-12 shadow-xl border border-border">
          <Link to="/student/quizzes" className="inline-flex items-center gap-2 text-caption hover:text-primary transition-colors font-medium mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Quizzes
          </Link>
          
          <div className="mb-2 text-sm font-bold tracking-wider text-primary uppercase">{mockQuizData.course}</div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-heading mb-6">{mockQuizData.title}</h1>
          
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-8 text-orange-800">
            <h3 className="font-bold flex items-center gap-2 mb-2"><AlertCircle className="w-5 h-5" /> Instructions</h3>
            <p className="text-sm leading-relaxed">{mockQuizData.instructions}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="text-caption text-xs font-medium mb-1">Questions</div>
              <div className="text-xl font-heading font-bold text-heading">{mockQuizData.questions.length}</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="text-caption text-xs font-medium mb-1">Time Limit</div>
              <div className="text-xl font-heading font-bold text-heading">{mockQuizData.timeLimitMins}m</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="text-caption text-xs font-medium mb-1">Total Marks</div>
              <div className="text-xl font-heading font-bold text-heading">{mockQuizData.totalMarks}</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="text-caption text-xs font-medium mb-1">Passing Marks</div>
              <div className="text-xl font-heading font-bold text-heading">{mockQuizData.passingMarks}</div>
            </div>
          </div>

          <button
      onClick={() => setQuizState("ACTIVE")}
      className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-secondary transition-colors shadow-lg shadow-primary/20"
    >
            Begin Quiz
          </button>
        </div>
      </div>;
  }
  if (quizState === "RESULT") {
    const res = calculateResult();
    return <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 py-12">
        <div className="bg-white max-w-2xl w-full rounded-3xl p-8 lg:p-12 shadow-xl border border-border text-center">
          
          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner ${res.passed ? "bg-emerald-100 text-emerald-500" : "bg-red-100 text-red-500"}`}>
            {res.passed ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
          </div>
          
          <h1 className="text-3xl font-heading font-bold text-heading mb-2">
            {res.passed ? "Congratulations! You Passed!" : "You did not pass this time."}
          </h1>
          <p className="text-body mb-10">You scored <span className="font-bold text-heading">{res.percentage}%</span>.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 text-left">
            <div className="bg-gray-50 rounded-2xl p-4 border border-border">
              <div className="text-caption text-xs font-medium mb-1">Score</div>
              <div className="text-lg font-heading font-bold text-heading">{res.score} / {mockQuizData.totalMarks}</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-border">
              <div className="text-caption text-xs font-medium mb-1">Correct</div>
              <div className="text-lg font-heading font-bold text-emerald-600">{res.correct}</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-border">
              <div className="text-caption text-xs font-medium mb-1">Incorrect</div>
              <div className="text-lg font-heading font-bold text-red-600">{res.incorrect}</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-border">
              <div className="text-caption text-xs font-medium mb-1">Time Taken</div>
              <div className="text-lg font-heading font-bold text-heading">{formatTime(res.timeTaken)}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
      onClick={() => {
        setShowReview(true);
        setQuizState("ACTIVE");
        setCurrentQuestionIdx(0);
      }}
      className="px-8 py-3.5 bg-gray-100 text-heading rounded-xl font-bold hover:bg-gray-200 transition-colors"
    >
              Review Answers
            </button>
            <Link to="/student/quizzes" className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-colors shadow-lg shadow-primary/20">
              Back to Quizzes
            </Link>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {
    /* Top Bar */
  }
      <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/student/quizzes" className="hidden sm:flex items-center gap-2 text-caption hover:text-primary transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Exit
          </Link>
          <div className="hidden sm:block w-px h-6 bg-border mx-2" />
          <h1 className="font-heading font-bold text-heading truncate max-w-md">{mockQuizData.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {showReview ? <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-sm font-bold border border-orange-200">Review Mode</span> : <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold border ${timeLeft < 300 ? "bg-red-50 text-red-600 border-red-200 animate-pulse" : "bg-gray-100 text-heading border-border"}`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>}
          {!showReview && <button onClick={handleSubmitClick} className="hidden sm:block px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-secondary transition-colors">
              Submit Quiz
            </button>}
        </div>
      </header>

      {
    /* Main Content */
  }
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        
        {
    /* Left Question Area */
  }
        <div className="flex-1 p-4 lg:p-8 flex flex-col">
          <div className="bg-white rounded-3xl p-6 lg:p-10 border border-border shadow-sm flex-1 flex flex-col">
            
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
              <span className="text-sm font-bold text-caption uppercase tracking-wider">Question {currentQuestionIdx + 1} of {mockQuizData.questions.length}</span>
              {showReview && <span className={`text-sm font-bold px-3 py-1 rounded-lg ${answers[currentQuestionIdx] === currentQuestion.correct ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  {answers[currentQuestionIdx] === currentQuestion.correct ? "Correct" : "Incorrect"}
                </span>}
            </div>

            <h2 className="text-xl lg:text-2xl font-heading font-bold text-heading mb-8 leading-relaxed">
              {currentQuestion.text}
            </h2>

            <div className="space-y-4 mb-12">
              {currentQuestion.options.map((option, idx) => {
    const isSelected = answers[currentQuestionIdx] === idx;
    let optionStyle = "border-gray-200 bg-white hover:border-primary/50 hover:bg-gray-50";
    if (isSelected && !showReview) {
      optionStyle = "border-primary bg-primary/5 ring-1 ring-primary";
    }
    if (showReview) {
      if (idx === currentQuestion.correct) {
        optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500";
      } else if (isSelected && idx !== currentQuestion.correct) {
        optionStyle = "border-red-500 bg-red-50 text-red-900 ring-1 ring-red-500 opacity-50";
      } else {
        optionStyle = "border-gray-200 bg-white opacity-50";
      }
    }
    return <button
      key={idx}
      onClick={() => handleOptionSelect(idx)}
      disabled={showReview}
      className={`w-full text-left p-4 lg:p-5 rounded-2xl border-2 transition-all flex items-center gap-4 group ${optionStyle} ${showReview ? "cursor-default" : "cursor-pointer"}`}
    >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected && !showReview ? "border-primary" : showReview && idx === currentQuestion.correct ? "border-emerald-500 bg-emerald-500 text-white" : showReview && isSelected && idx !== currentQuestion.correct ? "border-red-500 bg-red-500 text-white" : "border-gray-300"}`}>
                      {(isSelected && !showReview || showReview && idx === currentQuestion.correct) && !showReview && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                      {showReview && idx === currentQuestion.correct && <CheckCircle2 className="w-4 h-4 text-white" />}
                      {showReview && isSelected && idx !== currentQuestion.correct && <XCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className="font-medium text-heading text-lg">{option}</span>
                  </button>;
  })}
            </div>

            <div className="mt-auto flex justify-between items-center pt-6 border-t border-border">
              <button
    onClick={handlePrev}
    disabled={currentQuestionIdx === 0}
    className="px-6 py-3 border border-border bg-white text-heading rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
  >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
              
              {currentQuestionIdx === mockQuizData.questions.length - 1 && !showReview ? <button
    onClick={handleSubmitClick}
    className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-colors shadow-md"
  >
                  Finish
                </button> : <button
    onClick={handleNext}
    disabled={currentQuestionIdx === mockQuizData.questions.length - 1}
    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
  >
                  Next <ChevronRight className="w-5 h-5" />
                </button>}
            </div>
            
          </div>
        </div>

        {
    /* Right Navigation Panel */
  }
        <div className="w-full lg:w-80 p-4 lg:p-8 lg:pl-0 shrink-0">
          <div className="bg-white rounded-3xl border border-border shadow-sm p-6 sticky top-24">
            <h3 className="font-heading font-bold text-heading mb-6 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5" /> Quiz Navigation
            </h3>
            
            <div className="grid grid-cols-4 gap-2 mb-8">
              {mockQuizData.questions.map((q, idx) => {
    const isActive = currentQuestionIdx === idx;
    const answered = isAnswered(idx);
    let navStyle = "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-400";
    if (answered && !showReview) navStyle = "bg-primary/10 border-primary text-primary font-bold";
    if (isActive && !showReview) navStyle = "bg-primary text-white font-bold ring-2 ring-primary/20 ring-offset-2";
    if (showReview) {
      const isCorrect = answers[idx] === q.correct;
      if (isActive) {
        navStyle = "bg-gray-900 text-white font-bold ring-2 ring-gray-900/20 ring-offset-2 border-gray-900";
      } else if (answered) {
        navStyle = isCorrect ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-red-50 border-red-500 text-red-700";
      } else {
        navStyle = "bg-gray-50 border-gray-200 text-gray-500";
      }
    }
    return <button
      key={idx}
      onClick={() => setCurrentQuestionIdx(idx)}
      className={`aspect-square rounded-xl border-2 flex items-center justify-center text-sm transition-all ${navStyle}`}
    >
                    {idx + 1}
                  </button>;
  })}
            </div>

            <div className="space-y-3 mb-8 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-primary/10 border-2 border-primary" />
                <span className="text-caption">Answered</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-gray-50 border-2 border-gray-200" />
                <span className="text-caption">Unanswered</span>
              </div>
            </div>

            {!showReview ? <button onClick={handleSubmitClick} className="w-full sm:hidden px-5 py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary transition-colors">
                 Submit Quiz
               </button> : <Link to="/student/quizzes" className="block w-full text-center px-5 py-3 bg-gray-100 text-heading font-bold rounded-xl hover:bg-gray-200 transition-colors">
                 Exit Review
              </Link>}
          </div>
        </div>

      </div>

      {
    /* Submit Confirmation Modal */
  }
      {quizState === "SUBMIT_CONFIRM" && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-heading mb-2">Submit Quiz?</h3>
            <p className="text-body mb-8">
              {Object.keys(answers).length < mockQuizData.questions.length ? `You have ${mockQuizData.questions.length - Object.keys(answers).length} unanswered questions. Are you sure you want to submit?` : "You have answered all questions. Are you ready to submit?"}
            </p>
            <div className="flex gap-4">
              <button
    onClick={() => setQuizState("ACTIVE")}
    className="flex-1 py-3 bg-gray-100 text-heading font-bold rounded-xl hover:bg-gray-200 transition-colors"
  >
                Cancel
              </button>
              <button
    onClick={handleSubmit}
    className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary transition-colors shadow-md"
  >
                Submit
              </button>
            </div>
          </div>
        </div>}

    </div>;
};
var stdin_default = QuizPlayer;
export {
  stdin_default as default
};

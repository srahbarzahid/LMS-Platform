export const getAssignmentMock = async (submissionId: string) => {
  return {
    id: submissionId,
    assignmentTitle: 'User Persona Creation',
    studentName: 'Alice Smith',
    course: 'UI/UX Masterclass',
    submissionDate: 'March 20, 2026',
    status: 'Pending Review',
    studentNote: 'Hi, I attached my PDF with the 3 user personas...',
    file: { name: 'alice_personas_final.pdf', size: '2.4 MB' },
    marks: null,
    feedback: ''
  };
};

export const gradeAssignmentMock = async (submissionId: string, marks: number, feedback: string) => {
  return { success: true, message: 'Assignment graded successfully' };
};

export const requestResubmissionAssignmentMock = async (submissionId: string) => {
  return { success: true, message: 'Resubmission requested' };
};

export const getProjectMock = async (submissionId: string) => {
  return {
    id: submissionId,
    projectTitle: 'Mobile App Redesign',
    studentName: 'Bob Johnson',
    course: 'UI/UX Masterclass',
    submissionDate: 'March 18, 2026',
    status: 'Graded',
    studentNote: 'Here is my final project...',
    githubLink: 'https://github.com/example/repo',
    youtubeLink: 'https://youtube.com/watch?v=123',
    marks: 85,
    feedback: 'Great use of whitespace and typography.'
  };
};

export const gradeProjectMock = async (submissionId: string, marks: number, feedback: string) => {
  return { success: true, message: 'Project graded successfully' };
};

export const requestResubmissionProjectMock = async (submissionId: string) => {
  return { success: true, message: 'Resubmission requested' };
};

export const getQuizResultMock = async (resultId: string) => {
  return {
    id: resultId,
    quizName: 'UX Fundamentals',
    studentName: 'Charlie Brown',
    course: 'UI/UX Masterclass',
    score: 18,
    totalQuestions: 20,
    percentage: 90,
    status: 'Pass',
    attemptNumber: 1,
    timeTaken: '14 mins 30 secs',
    date: 'March 21, 2026',
    questions: [
      { id: 1, text: 'What does UX stand for?', correct: true, studentAnswer: 'User Experience', correctAnswer: 'User Experience' }
    ]
  };
};

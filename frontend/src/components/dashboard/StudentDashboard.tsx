import React from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from './DashboardCard';
import { 
  Brain,
  Trophy, 
  Clock,
  Search,
  Play,
  CheckCircle,
  Target,
  Award,
  Timer,
  Users,
  ArrowLeft,
  X,
  Check
} from 'lucide-react';

// Mock data
const mockAvailableQuizzes = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics',
    category: 'Programming',
    difficulty: 'easy' as const,
    organizerName: 'John Smith',
    questions: [
      { id: '1', question: 'What is a variable?', options: ['A container for storing data', 'A function', 'A loop', 'A condition'], correctAnswer: 0 },
      { id: '2', question: 'What is a function?', options: ['A variable', 'A reusable block of code', 'A data type', 'An operator'], correctAnswer: 1 }
    ],
    timeLimit: 30,
    participants: 25,
    isActive: true
  },
  {
    id: '2',
    title: 'React Components Quiz',
    description: 'Advanced React concepts and component patterns',
    category: 'Frontend',
    difficulty: 'hard' as const,
    organizerName: 'Sarah Johnson',
    questions: [
      { id: '3', question: 'What is JSX?', options: ['A JavaScript library', 'A syntax extension for JavaScript', 'A CSS framework', 'A database'], correctAnswer: 1 },
      { id: '4', question: 'What are hooks?', options: ['Functions that let you use state', 'CSS classes', 'JavaScript variables', 'React components'], correctAnswer: 0 }
    ],
    timeLimit: 45,
    participants: 18,
    isActive: true
  }
];

const mockCompletedQuizzes = [
  {
    id: '3',
    title: 'HTML & CSS Basics',
    description: 'Fundamental web development concepts',
    category: 'Web Development',
    difficulty: 'easy' as const,
    organizerName: 'Mike Davis',
    questions: 12,
    score: 10,
    percentage: 83,
    completedAt: '2024-01-20',
    timeSpent: 18
  },
  {
    id: '4',
    title: 'Python Fundamentals',
    description: 'Basic Python programming concepts',
    category: 'Programming',
    difficulty: 'medium' as const,
    organizerName: 'Emily Chen',
    questions: 20,
    score: 18,
    percentage: 90,
    completedAt: '2024-01-18',
    timeSpent: 35
  }
];

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [availableQuizzes] = React.useState(mockAvailableQuizzes);
  const [completedQuizzes] = React.useState(mockCompletedQuizzes);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedQuiz, setSelectedQuiz] = React.useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<number[]>([]);
  const [quizStarted, setQuizStarted] = React.useState(false);
  const [quizCompleted, setQuizCompleted] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(0);

  const filteredAvailableQuizzes = availableQuizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
    setQuizStarted(true);
    setQuizCompleted(false);
    setScore(0);
    setTimeLeft(quiz.timeLimit * 60); // Convert to seconds
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    let correctAnswers = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === selectedQuiz.questions[index].correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / selectedQuiz.questions.length) * 100);
    setScore(finalScore);
    setQuizCompleted(true);
  };

  const goBack = () => {
    if (quizStarted && !quizCompleted) {
      if (confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
        setQuizStarted(false);
        setSelectedQuiz(null);
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setTimeLeft(0);
      }
    } else {
      setQuizStarted(false);
      setSelectedQuiz(null);
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
      setTimeLeft(0);
      setQuizCompleted(false);
    }
  };

  // Timer effect
  React.useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, quizCompleted, timeLeft]);

  const stats = {
    availableQuizzes: availableQuizzes.length,
    averageScore: completedQuizzes.length > 0 ? Math.round(completedQuizzes.reduce((acc, quiz) => acc + quiz.percentage, 0) / completedQuizzes.length) : 0,
    completedQuizzes: completedQuizzes.length,
    totalPoints: completedQuizzes.reduce((acc, quiz) => acc + quiz.score, 0)
  };

  // Quiz taking interface
  if (quizStarted) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Timer className="h-5 w-5 text-red-500" />
                <span className="font-medium">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedQuiz.title}</h1>
          <p className="text-gray-600">{selectedQuiz.description}</p>
        </div>

        {/* Question */}
        {!quizCompleted && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {selectedQuiz.questions[currentQuestionIndex].question}
              </h2>
              
              <div className="space-y-3">
                {selectedQuiz.questions[currentQuestionIndex].options.map((option: string, index: number) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      checked={selectedAnswers[currentQuestionIndex] === index}
                      onChange={() => handleAnswerSelect(index)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswers[currentQuestionIndex] === index && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="text-gray-900">{option}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <button
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === -1}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {currentQuestionIndex === selectedQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
              </button>
            </div>
          </div>
        )}

        {/* Quiz Results */}
        {quizCompleted && (
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="mb-6">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
              <p className="text-gray-600 mb-4">Your score: {score}%</p>
              
              <div className="text-4xl font-bold text-blue-600 mb-6">
                {score}%
              </div>
              
              <div className="text-sm text-gray-500 mb-6">
                You answered {Math.round((score / 100) * selectedQuiz.questions.length)} out of {selectedQuiz.questions.length} questions correctly.
              </div>
            </div>
            
            <button
              onClick={goBack}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.profile.firstName}!
        </h1>
        <p className="text-gray-600">Ready to challenge yourself with some quizzes?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Available Quizzes"
          value={stats.availableQuizzes}
          icon={Brain}
          color="bg-blue-500"
          bgColor="bg-white"
        />
        <DashboardCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          icon={Trophy}
          color="bg-green-500"
          bgColor="bg-white"
        />
        <DashboardCard
          title="Quizzes Completed"
          value={stats.completedQuizzes}
          icon={CheckCircle}
          color="bg-purple-500"
          bgColor="bg-white"
        />
        <DashboardCard
          title="Total Points"
          value={stats.totalPoints}
          icon={Award}
          color="bg-orange-500"
          bgColor="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Quizzes */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Available Quizzes</h2>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                  />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAvailableQuizzes.map((quiz) => (
                  <div key={quiz.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {quiz.title}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {quiz.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${getDifficultyColor(quiz.difficulty)}`}>
                            {quiz.difficulty}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => startQuiz(quiz)}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Play className="h-4 w-4" />
                        <span>Start</span>
                      </button>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
                    <p className="text-gray-500 text-sm mb-4">by {quiz.organizerName}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">{quiz.questions.length} questions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Timer className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">{quiz.timeLimit} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">{quiz.participants} taken</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredAvailableQuizzes.length === 0 && (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Completed Quizzes */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Recent Results</h2>
            </div>
            <div className="p-6">
              {completedQuizzes.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results yet</h3>
                  <p className="text-gray-500 text-sm">Complete quizzes to see your results here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedQuizzes.map((quiz) => (
                    <div key={quiz.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm mb-1">
                            {quiz.title}
                          </h4>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {quiz.category}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${getDifficultyColor(quiz.difficulty)}`}>
                              {quiz.difficulty}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          quiz.percentage >= 80 
                            ? 'bg-green-100 text-green-800'
                            : quiz.percentage >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {quiz.percentage}%
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mb-2">by {quiz.organizerName}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Target className="h-3 w-3" />
                          <span>{quiz.score}/{quiz.questions}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{quiz.timeSpent}m</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(quiz.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

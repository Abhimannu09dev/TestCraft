import React from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from './DashboardCard';
import { 
  Brain,
  Trophy,
  Users, 
  Clock,
  Plus,
  Eye,
  Edit,
  Trash2,
  Play,
  BarChart3,
  X,
  Save,
  ArrowLeft
} from 'lucide-react';

// Mock data
const mockQuizzes = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics',
    category: 'Programming',
    difficulty: 'easy' as const,
    organizerId: '1',
    organizerName: 'John Smith', // whatever the name is the organization name
    questions: [
      { id: '1', question: 'What is a variable?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
      { id: '2', question: 'What is a function?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 }
    ],
    timeLimit: 30,
    participants: ['1', '2', '3'],
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'React Components Quiz',
    description: 'Advanced React concepts and component patterns',
    category: 'Frontend',
    difficulty: 'hard' as const,
    organizerId: '1',
    organizerName: 'John Smith',
    questions: [
      { id: '3', question: 'What is JSX?', options: ['A', 'B', 'C', 'D'], correctAnswer: 2 },
      { id: '4', question: 'What are hooks?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
      { id: '5', question: 'What is state?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 }
    ],
    timeLimit: 45,
    participants: ['1', '4'],
    isActive: false,
    createdAt: '2024-01-10'
  }
];

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizFormData {
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  questions: Question[];
}

const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = React.useState<any[]>(mockQuizzes);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [quizForm, setQuizForm] = React.useState<QuizFormData>({
    title: '',
    description: '',
    category: 'Programming',
    difficulty: 'easy',
    timeLimit: 30,
    questions: []
  });

  const stats = {
    totalQuizzes: quizzes.length,
    totalParticipants: quizzes.reduce((acc, quiz) => acc + quiz.participants.length, 0),
    totalQuestions: quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0),
    activeQuizzes: quizzes.filter(q => q.isActive).length
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    setQuizForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (questionId: string, field: keyof Question, value: any) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? {
          ...q,
          options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
        } : q
      )
    }));
  };

  const removeQuestion = (questionId: string) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (quizForm.questions.length === 0) {
      alert('Please add at least one question to the quiz.');
      return;
    }

    if (quizForm.questions.some(q => !q.question.trim() || q.options.some(opt => !opt.trim()))) {
      alert('Please fill in all questions and options.');
      return;
    }

    const newQuiz = {
      id: Date.now().toString(),
      title: quizForm.title,
      description: quizForm.description,
      category: quizForm.category,
      difficulty: quizForm.difficulty,
      organizerId: user?.id || '1',
      organizerName: `${user?.profile.firstName} ${user?.profile.lastName}`,
      questions: quizForm.questions,
      timeLimit: quizForm.timeLimit,
      participants: [],
      isActive: false,
      createdAt: new Date().toISOString()
    };

    setQuizzes(prev => [newQuiz, ...prev]);
    setShowCreateModal(false);
    setQuizForm({
      title: '',
      description: '',
      category: 'Programming',
      difficulty: 'easy',
      timeLimit: 30,
      questions: []
    });
  };

  const resetForm = () => {
    setQuizForm({
      title: '',
      description: '',
      category: 'Programming',
      difficulty: 'easy',
      timeLimit: 30,
      questions: []
    });
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.profile.firstName}!
            </h1>
            <p className="text-gray-600">Create engaging quizzes and track participant progress</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Quiz
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Quizzes"
          value={stats.totalQuizzes}
          icon={Brain}
          color="bg-blue-500"
          bgColor="bg-white"
        />
        <DashboardCard
          title="Total Participants"
          value={stats.totalParticipants}
          icon={Users}
          color="bg-green-500"
          bgColor="bg-white"
        />
        <DashboardCard
          title="Total Questions"
          value={stats.totalQuestions}
          icon={BarChart3}
          color="bg-purple-500"
          bgColor="bg-white"
        />
        <DashboardCard
          title="Active Quizzes"
          value={stats.activeQuizzes}
          icon={Trophy}
          color="bg-orange-500"
          bgColor="bg-white"
        />
      </div>

      {/* Quizzes */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Your Quizzes</h2>
        </div>

        <div className="p-6">
          {quizzes.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes yet</h3>
              <p className="text-gray-500 mb-4">Create your first quiz to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Quiz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
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
                    <div className="flex items-center space-x-2">
                      {quiz.isActive && (
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Participants:</span>
                      <span className="font-medium">{quiz.participants.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Questions:</span>
                      <span className="font-medium">{quiz.questions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Time Limit:</span>
                      <span className="font-medium">{quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className={`font-medium ${quiz.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                        {quiz.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`text-sm font-medium ${
                        quiz.isActive ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {quiz.isActive ? 'Active' : 'Pending Admin Approval'}
                      </span>
                    </div>
                    <button className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>View Analytics</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <h3 className="text-xl font-semibold text-gray-900">Create New Quiz</h3>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Quiz Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={quizForm.title}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter quiz title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select 
                    value={quizForm.category}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="General Knowledge">General Knowledge</option>
                    <option value="History">History</option>
                    <option value="Literature">Literature</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={quizForm.description}
                  onChange={(e) => setQuizForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter quiz description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty *
                  </label>
                  <select 
                    value={quizForm.difficulty}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quizForm.timeLimit}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="30"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Question</span>
                  </button>
                </div>
              </div>

              {/* Questions Section */}
              {quizForm.questions.length > 0 && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Questions ({quizForm.questions.length})</h4>
                  <div className="space-y-6">
                    {quizForm.questions.map((question, qIndex) => (
                      <div key={question.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium text-gray-900">Question {qIndex + 1}</h5>
                          <button
                            type="button"
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Question Text *
                            </label>
                            <input
                              type="text"
                              required
                              value={question.question}
                              onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter your question"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Options *
                            </label>
                            <div className="space-y-2">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center space-x-3">
                                  <input
                                    type="radio"
                                    name={`correct-${question.id}`}
                                    checked={question.correctAnswer === optIndex}
                                    onChange={() => updateQuestion(question.id, 'correctAnswer', optIndex)}
                                    className="text-blue-600 focus:ring-blue-500"
                                  />
                                  <input
                                    type="text"
                                    required
                                    value={option}
                                    onChange={(e) => updateQuestionOption(question.id, optIndex, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={`Option ${optIndex + 1}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">ℹ</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">Admin Approval Required</h4>
                    <p className="text-sm text-blue-700">
                      Your quiz will be reviewed by an administrator before it becomes available to students. 
                      You'll be notified once it's approved.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Create Quiz</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;

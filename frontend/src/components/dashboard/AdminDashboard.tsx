import React from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from './DashboardCard';
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  Search,
  MoreVertical,
  Check,
  X,
  Eye,
  Clock,
  Brain
} from 'lucide-react';

// Mock data
const mockUsers = [
  {
    id: '1',
    username: 'john_organizer',
    email: 'john@example.com',
    role: 'organizer',
    isValidated: false,
    profile: { firstName: 'John', lastName: 'Smith' },
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    username: 'sarah_taker',
    email: 'sarah@example.com',
    role: 'student',
    isValidated: true,
    profile: { firstName: 'Sarah', lastName: 'Johnson' },
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    username: 'mike_organizer',
    email: 'mike@example.com',
    role: 'organizer',
    isValidated: true,
    profile: { firstName: 'Mike', lastName: 'Davis' },
    createdAt: '2024-01-13'
  }
];

// Mock pending quizzes
const mockPendingQuizzes = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics',
    category: 'Programming',
    difficulty: 'easy',
    organizerName: 'John Smith',
    questions: [
      { id: '1', question: 'What is a variable?', options: ['A container for storing data', 'A function', 'A loop', 'A condition'], correctAnswer: 0 },
      { id: '2', question: 'What is a function?', options: ['A variable', 'A reusable block of code', 'A data type', 'An operator'], correctAnswer: 1 }
    ],
    timeLimit: 30,
    createdAt: '2024-01-15',
    status: 'pending'
  },
  {
    id: '2',
    title: 'React Components Quiz',
    description: 'Advanced React concepts and component patterns',
    category: 'Frontend',
    difficulty: 'hard',
    organizerName: 'Mike Davis',
    questions: [
      { id: '3', question: 'What is JSX?', options: ['A JavaScript library', 'A syntax extension for JavaScript', 'A CSS framework', 'A database'], correctAnswer: 1 },
      { id: '4', question: 'What are hooks?', options: ['Functions that let you use state', 'CSS classes', 'JavaScript variables', 'React components'], correctAnswer: 0 }
    ],
    timeLimit: 45,
    createdAt: '2024-01-14',
    status: 'pending'
  }
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [users, setUsers] = React.useState(mockUsers);
  const [pendingQuizzes, setPendingQuizzes] = React.useState(mockPendingQuizzes);
  const [activeTab, setActiveTab] = React.useState<'users' | 'quizzes'>('users');

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${u.profile.firstName} ${u.profile.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleValidateUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isValidated: true } : u
    ));
  };

  const handleRejectUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleApproveQuiz = (quizId: string) => {
    setPendingQuizzes(prev => prev.map(q => 
      q.id === quizId ? { ...q, status: 'approved' } : q
    ));
  };

  const handleRejectQuiz = (quizId: string) => {
    setPendingQuizzes(prev => prev.filter(q => q.id !== quizId));
  };

  const stats = {
    totalUsers: users.length,
    pendingValidations: users.filter(u => !u.isValidated && u.role === 'organizer').length,
    organizers: users.filter(u => u.role === 'organizer').length,
    students: users.filter(u => u.role === 'student').length,
    pendingQuizzes: pendingQuizzes.filter(q => q.status === 'pending').length
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.profile.firstName}!
        </h1>
        <p className="text-gray-600">Manage users and oversee TestCraft operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <DashboardCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
          bgColor="bg-white"
        />
        <DashboardCard
          title="Pending Validations"
          value={stats.pendingValidations}
          icon={UserCheck}
          color="bg-orange-500"
          bgColor="bg-white"
        />
        <DashboardCard
          title="Quiz Organizers"
          value={stats.organizers}
          icon={BookOpen}
          color="bg-purple-500"
          bgColor="bg-white"
        />
        <DashboardCard
          title="Quiz Takers"
          value={stats.students}
          icon={Users}
          color="bg-green-500"
          bgColor="bg-white"
        />
        <DashboardCard
          title="Pending Quizzes"
          value={stats.pendingQuizzes}
          icon={Brain}
          color="bg-red-500"
          bgColor="bg-white"
        />
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'quizzes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Quiz Approvals
            </button>
          </nav>
        </div>
      </div>

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((userData) => (
                  <tr key={userData.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {userData.profile.firstName[0]}{userData.profile.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userData.profile.firstName} {userData.profile.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{userData.username} • {userData.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        userData.role === 'organizer' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {userData.role === 'organizer' ? 'Quiz Organizer' : 'Quiz Taker'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        userData.isValidated 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {userData.isValidated ? 'Validated' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {!userData.isValidated && userData.role === 'organizer' && (
                          <>
                            <button
                              onClick={() => handleValidateUser(userData.id)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                              title="Validate User"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRejectUser(userData.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Reject User"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleRejectUser(userData.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No users found matching your search criteria.
            </div>
          )}
        </div>
      )}

      {/* Quiz Approvals Tab */}
      {activeTab === 'quizzes' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Quiz Approvals</h2>
            <p className="text-gray-600 mt-1">Review and approve quizzes created by organizers</p>
          </div>

          <div className="p-6">
            {pendingQuizzes.filter(q => q.status === 'pending').length === 0 ? (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending quizzes</h3>
                <p className="text-gray-500">All quizzes have been reviewed</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingQuizzes.filter(q => q.status === 'pending').map((quiz) => (
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
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                            quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {quiz.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
                    <p className="text-gray-500 text-sm mb-4">by {quiz.organizerName}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Questions:</span>
                        <span className="font-medium">{quiz.questions.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Time Limit:</span>
                        <span className="font-medium">{quiz.timeLimit} min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Created:</span>
                        <span className="font-medium">{new Date(quiz.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApproveQuiz(quiz.id)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                        >
                          <Check className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectQuiz(quiz.id)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

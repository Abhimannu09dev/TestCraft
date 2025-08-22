import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import OrganizerDashboard from './OrganizerDashboard';
import StudentDashboard from './StudentDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const goBack = () => {
    navigate('/');
  };

  return (
    <div>
      {/* Back Button */}
      <div className="bg-white border-b px-6 py-4">
        <button
          onClick={goBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Dashboard Content */}
      {(() => {
        switch (user.role) {
          case 'admin':
            return <AdminDashboard />;
          case 'organizer':
            return <OrganizerDashboard />;
          case 'student':
            return <StudentDashboard />;
          default:
            return (
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                  <p className="text-gray-600">Your account role is not recognized.</p>
                </div>
              </div>
            );
        }
      })()}
    </div>
  );
};

export default Dashboard;

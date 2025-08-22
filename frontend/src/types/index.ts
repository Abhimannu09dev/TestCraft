export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'organizer' | 'student';
  isValidated: boolean;
  profile: UserProfile;
  createdAt: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  organizerId: string;
  organizerName: string;
  thumbnail?: string;
  questions: Question[];
  timeLimit?: number;
  participants: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  answers: number[];
  score: number;
  percentage: number;
  timeSpent: number;
  completedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

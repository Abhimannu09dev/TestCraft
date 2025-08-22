import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import axios, { AxiosError } from 'axios'; // Import AxiosError
import { User, AuthState } from '../types';

// Define interfaces
interface UserData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  role: 'student' | 'organizer';
  orgCode?: string;
}

interface ProfileData {
  firstName?: string;
  lastName?: string;
  socialLinks?: Record<string, string>;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: UserData) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: ProfileData) => Promise<void>;
}

// Define Axios error response shape
interface ApiErrorResponse {
  message?: string;
}

// Create Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.post('/users/login', { email, password });
      const { token, data } = response.data;

      const user: User = {
        id: data.id || Date.now().toString(),
        username: data.userName,
        email: data.email,
        role: data.role,
        isValidated: data.role === 'student',
        profile: {
          firstName: data.firstName || 'User',
          lastName: data.lastName || 'Account',
          socialLinks: data.socialLinks || {},
        },
        createdAt: data.createdAt || new Date().toISOString(),
      };

      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData: UserData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      if (userData.role === 'organizer' && userData.orgCode?.toLowerCase() !== 'teach') {
        throw new Error('Invalid organization code. Only authorized individuals can register as teachers.');
      }

      const createResponse = await api.post('/users/create', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      });

      const { data: createdUser } = createResponse.data;

      const loginResponse = await api.post('/users/login', {
        email: userData.email,
        password: userData.password,
      });

      const { token } = loginResponse.data;

      const user: User = {
        id: createdUser.id,
        username: createdUser.userName,
        email: createdUser.email,
        role: createdUser.role,
        isValidated: userData.role === 'student',
        profile: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          socialLinks: {},
        },
        createdAt: createdUser.createdAt || new Date().toISOString(),
      };

      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (profileData: ProfileData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      if (!state.user) throw new Error('No user logged in');

      const response = await api.patch('/users/update', {
        userId: state.user.id,
        ...profileData,
      });

      const updatedUser: User = {
        ...state.user,
        profile: {
          ...state.user.profile,
          ...profileData,
        },
      };

      localStorage.setItem('userData', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || 'Profile update failed. Please try again.';
      throw new Error(message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginRequest, AuthResponse } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        console.log('Auth initialization - storedToken:', storedToken ? 'exists' : 'null');
        console.log('Auth initialization - storedUser:', storedUser ? 'exists' : 'null');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token is still valid by fetching profile
          try {
            console.log('Verifying token with getProfile API...');
            const response = await authAPI.getProfile();
            console.log('getProfile response:', response);
            
            if (response.success && response.data) {
              setUser(response.data);
              localStorage.setItem('user', JSON.stringify(response.data));
              console.log('Token is valid, user authenticated');
            } else {
              console.log('Token is invalid, clearing storage');
              // Token is invalid, clear storage
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setToken(null);
              setUser(null);
            }
          } catch (error) {
            console.error('Token verification failed:', error);
            // Token is invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        } else {
          console.log('No stored token or user found');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      const response: AuthResponse = await authAPI.login(credentials);

      if (response.success && response.data) {
        const { user: userData, token: userToken } = response.data;
        
        setUser(userData);
        setToken(userToken);
        
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  // Update user function
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }

    return <Component {...props} />;
  };
};

// Hook to check user permissions
export const usePermissions = () => {
  const { user } = useAuth();

  const hasRole = (role: string): boolean => {
    return user?.role_name === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role_name) : false;
  };

  const isAdmin = hasRole('admin');
  const isStudent = hasRole('student');
  const isMentor = hasRole('mentor');
  const isSupervisor = hasRole('supervisor');

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isStudent,
    isMentor,
    isSupervisor,
  };
};

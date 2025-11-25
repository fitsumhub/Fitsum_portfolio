import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth data on mount
    const storedToken = localStorage.getItem('adminToken');
    const storedUser = localStorage.getItem('adminUser');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      try {
        // Try to login via API
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ username, password })
        });

        if (response.ok) {
          const data = await response.json();
          const responseData = data.data || data;
          
          if (responseData.token) {
            const apiUser: User = {
              id: responseData.user?.id || responseData.user?._id || '1',
              username: responseData.user?.username || username,
              email: responseData.user?.email || `${username}@fitsum.com`,
              role: 'admin'
            };
            
            setUser(apiUser);
            setToken(responseData.token);
            localStorage.setItem('adminToken', responseData.token);
            localStorage.setItem('adminUser', JSON.stringify(apiUser));
            
            return true;
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || errorData.error || 'Login failed');
        }
      } catch (apiError) {
        // If API is not available, fall back to demo mode
        if (apiError instanceof TypeError || (apiError as Error).message.includes('fetch')) {
          console.warn('API not available, using demo mode');
          
          // Demo mode: accept admin/admin123
          if (username === 'admin' && password === 'admin123') {
            const mockUser: User = {
              id: '1',
              username: 'admin',
              email: 'admin@fitsum.com',
              role: 'admin'
            };
            const mockToken = 'demo-token-' + Date.now();
            
            setUser(mockUser);
            setToken(mockToken);
            localStorage.setItem('adminToken', mockToken);
            localStorage.setItem('adminUser', JSON.stringify(mockUser));
            
            return true;
          }
        }
        throw apiError;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


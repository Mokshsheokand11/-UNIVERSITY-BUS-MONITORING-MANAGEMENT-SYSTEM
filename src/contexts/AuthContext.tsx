import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../utils/demoData';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to student or admin demo user
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('ubmms_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default to student for initial preview
    return INITIAL_USERS[4]; // Priya Verma (STUDENT)
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ubmms_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ubmms_current_user');
    }
  }, [currentUser]);

  const login = (email: string, desiredRole?: UserRole): boolean => {
    const found = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || (desiredRole && u.role === desiredRole)
    );
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    // Revert to null or quick prompt
    setCurrentUser(INITIAL_USERS[0]); // fallback to admin or prompt
  };

  const switchRole = (newRole: UserRole) => {
    const found = INITIAL_USERS.find((u) => u.role === newRole);
    if (found) {
      setCurrentUser(found);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'STUDENT',
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

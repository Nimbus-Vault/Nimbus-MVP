import React, { createContext, useContext, useState, ReactNode } from 'react';

// Simple mock data interfaces
interface SimpleUser {
  id: string;
  email: string;
  fullName: string;
}

interface SimpleAppContextData {
  currentUser: SimpleUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const SimpleAppContext = createContext<SimpleAppContextData | undefined>(undefined);

export const useSimpleAppContext = () => {
  const context = useContext(SimpleAppContext);
  if (!context) {
    throw new Error('useSimpleAppContext must be used within a SimpleAppProvider');
  }
  return context;
};

export const SimpleAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<SimpleUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    // Mock login - just set a fake user
    setCurrentUser({
      id: '1',
      email,
      fullName: 'Demo User'
    });
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const contextValue: SimpleAppContextData = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <SimpleAppContext.Provider value={contextValue}>
      {children}
    </SimpleAppContext.Provider>
  );
};

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  uid: string | null;
  setUID: (uid: string | null) => void;
  user: any;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uid, setUID] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Load user data from localStorage on app start
  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    const userDataStr = localStorage.getItem('user');

    if (storedUid) {
      setUID(storedUid);
      try {
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setUser(userData);
          console.log("🔐 AuthContext: Restored user session:", userData);
        }
      } catch (e) {
        console.error("AuthContext: Failed to parse user data", e);
        setUser(userDataStr); // Fallback to raw string
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ uid, setUID, user, setUser }}>
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
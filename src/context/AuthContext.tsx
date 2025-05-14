import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [uid, setUID] = useState(null);

  // Load uid from localStorage on app start
  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      setUID(storedUid);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ uid, setUID }}>
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

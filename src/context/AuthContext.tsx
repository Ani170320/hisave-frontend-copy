import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [uid, setUID] = useState(null);
  const [user, setUser] = useState([])
  // Load uid from localStorage on app start
  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    const userData = localStorage.getItem('user')
    if (storedUid) {
      setUID(storedUid);
      setUser(userData);
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

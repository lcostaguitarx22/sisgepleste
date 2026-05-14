import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sisgep_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password) => {
    // Simple mock logic as per requirements
    if (username === 'admin' && password === 'admin') {
      const userData = { username: 'admin', role: 'admin' };
      setUser(userData);
      localStorage.setItem('sisgep_user', JSON.stringify(userData));
      return true;
    } else if (username === 'user' && password === 'user') {
      const userData = { username: 'user', role: 'standard' };
      setUser(userData);
      localStorage.setItem('sisgep_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sisgep_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

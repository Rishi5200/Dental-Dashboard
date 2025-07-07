import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const initialUsers = [
  { id: '1', role: 'Admin', email: 'admin@entnt.in', password: 'admin123' },
  { id: '2', role: 'Patient', email: 'john@entnt.in', password: 'patient123', patientId: 'p1' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
    const stored = localStorage.getItem('session');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users'));
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      localStorage.setItem('session', JSON.stringify(found));
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
};

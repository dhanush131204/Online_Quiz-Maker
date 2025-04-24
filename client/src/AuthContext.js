import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  });
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt_decode(token);
      if (decoded.exp * 1000 < Date.now()) {
        logout();
      } else {
        setAuthState({
          user: decoded.user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials) => {
    try {
      const res = await axios.post('/api/auth/login', credentials);
      const { token } = res.data;
      localStorage.setItem('token', token);
      const decoded = jwt_decode(token);
      setAuthState({
        user: decoded.user,
        token,
        isAuthenticated: true,
        isLoading: false
      });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      history.push('/dashboard');
    } catch (err) {
      throw err.response.data;
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      const { token } = res.data;
      localStorage.setItem('token', token);
      const decoded = jwt_decode(token);
      setAuthState({
        user: decoded.user,
        token,
        isAuthenticated: true,
        isLoading: false
      });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      history.push('/dashboard');
    } catch (err) {
      throw err.response.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
    history.push('/login');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

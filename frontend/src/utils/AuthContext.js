import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserProfile, logoutUser, refreshToken } from './api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserProfile()
        .then(userData => {
          setUser(userData);
        })
        .catch(async (error) => {
          if (error.response && error.response.status === 401) {
            try {
              await refreshToken();
              const userData = await getUserProfile();
              setUser(userData);
            } catch (refreshError) {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
            }
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.access_token);
    localStorage.setItem('refreshToken', userData.refresh_token);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
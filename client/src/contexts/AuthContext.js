import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useGoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem('token');
      
      if (token) {
        setAuthToken(token);
        try {
          const res = await api.get('/api/auth/me');
          setCurrentUser(res.data.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Authentication error:', err.response?.data || err.message);
          localStorage.removeItem('token');
          setAuthToken(null);
        }
      }
      
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const register = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.post('/api/auth/register', formData);
      
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setCurrentUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.post('/api/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setCurrentUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (credentialResponse) => {
    try {
      setLoading(true);
      setError(null);
      
      if (credentialResponse.credential) {
        const userInfo = jwtDecode(credentialResponse.credential);
        
        const res = await api.post('/api/auth/google', { 
          idToken: credentialResponse.credential,
          userInfo: userInfo 
        });
        
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
        setCurrentUser(res.data.user);
        setIsAuthenticated(true);
        
        return res.data;
      } 
      else {
        const res = await api.post('/api/auth/google', { 
          accessToken: credentialResponse.access_token 
        });
        
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
        setCurrentUser(res.data.user);
        setIsAuthenticated(true);
        
        return res.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { profilePicture, ...profileData } = formData;
      
      const res = await api.put('/api/users/profile', profileData);
      
      setCurrentUser(res.data.data);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfilePicture = (pictureUrl) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        profilePicture: pictureUrl
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAuthenticated,
        error,
        register,
        login,
        googleLogin,
        logout,
        updateProfile,
        updateProfilePicture
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
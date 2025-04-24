import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from './contexts/AuthContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Home from './pages/Home';
import PackageList from './pages/packages/PackageList';
import PackageDetails from './pages/packages/PackageDetails';
import Bookings from './pages/user/Bookings';
import Profile from './pages/user/Profile';

import Dashboard from './pages/admin/Dashboard';
import AdminPackageList from './pages/admin/PackageList';
import PackageForm from './pages/admin/PackageForm';
import AdminBookings from './pages/admin/Bookings';
import UserList from './pages/admin/UserList';
import UserDetails from './pages/admin/UserDetails';

import ProtectedRoute from './components/common/ProtectedRoute';

const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/packages" element={<PackageList />} />
              <Route path="/packages/:id" element={<PackageDetails />} />
              
              <Route 
                path="/bookings" 
                element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute adminOnly>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/packages" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPackageList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/packages/create" 
                element={
                  <ProtectedRoute adminOnly>
                    <PackageForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/packages/edit/:id" 
                element={
                  <ProtectedRoute adminOnly>
                    <PackageForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/bookings" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminBookings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute adminOnly>
                    <UserList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                  path="/admin/users/:id"
                  element={
                    <ProtectedRoute adminOnly>
                      <UserDetails />
                    </ProtectedRoute>
                  }
                />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="bottom-right" />
      </Router>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
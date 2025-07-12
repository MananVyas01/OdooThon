import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RequestList from './pages/RequestList';
import RequestForm from './pages/RequestForm';
import RequestDetails from './pages/RequestDetails';
import './index.css';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <Dashboard />
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/requests" element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <RequestList />
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/requests/new" element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <RequestForm />
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/requests/:id" element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <RequestDetails />
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/requests/:id/edit" element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <RequestForm />
                  </div>
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                        <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
                        <a href="/dashboard" className="text-primary-600 hover:text-primary-500">
                          Go to Dashboard
                        </a>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

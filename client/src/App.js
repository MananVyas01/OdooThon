import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ItemList from './pages/ItemList';
import ItemForm from './pages/ItemForm';
import ItemDetails from './pages/ItemDetails';
import MySwaps from './pages/MySwaps';
import CategoryView from './pages/CategoryView';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingItems from './pages/admin/PendingItems';
import ManageItems from './pages/admin/ManageItems';
import ManageUsers from './pages/admin/ManageUsers';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminProtectedRoute>
              } />
              
              <Route path="/admin/dashboard" element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminProtectedRoute>
              } />
              
              <Route path="/admin/pending-items" element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <PendingItems />
                  </AdminLayout>
                </AdminProtectedRoute>
              } />
              
              <Route path="/admin/items" element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <ManageItems />
                  </AdminLayout>
                </AdminProtectedRoute>
              } />
              
              <Route path="/admin/users" element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <ManageUsers />
                  </AdminLayout>
                </AdminProtectedRoute>
              } />
              
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
              
              <Route path="/items" element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <ItemList />
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/items/new" element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <ItemForm />
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/items/:id" element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <ItemDetails />
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/items/:id/edit" element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <ItemForm />
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/swaps" element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <MySwaps />
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/categories" element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <CategoryView />
                  </div>
                </ProtectedRoute>
              } />
              
              {/* Legacy redirects */}
              <Route path="/requests" element={<Navigate to="/items" replace />} />
              <Route path="/requests/new" element={<Navigate to="/items/new" replace />} />
              <Route path="/requests/:id" element={<Navigate to="/items/:id" replace />} />
              <Route path="/requests/:id/edit" element={<Navigate to="/items/:id/edit" replace />} />
              
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

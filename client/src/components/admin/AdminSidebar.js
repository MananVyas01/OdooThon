import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: '📊',
      exact: true
    },
    {
      name: 'Pending Items',
      path: '/admin/items/pending',
      icon: '⏳',
      badge: 'pending'
    },
    {
      name: 'All Items',
      path: '/admin/items',
      icon: '📦'
    },
    {
      name: 'User Management',
      path: '/admin/users',
      icon: '👥'
    },
    {
      name: 'Reports',
      path: '/admin/reports',
      icon: '📈'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-gray-600 mt-1">ReWear Management</p>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium mb-1 transition-colors ${
                isActive(item.path, item.exact)
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                  !
                </span>
              )}
            </Link>
          ))}
        </div>
        
        <div className="mt-8 px-3">
          <div className="border-t border-gray-200 pt-6">
            <Link
              to="/dashboard"
              className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <span className="mr-3 text-lg">🏠</span>
              <span>Back to Main App</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;

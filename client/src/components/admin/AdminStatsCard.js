import React from 'react';

const AdminStatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'blue', 
  trend = null, 
  isLoading = false 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="h-8 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon && (
            <div className="w-6 h-6 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.positive ? '+' : '-'}{trend.value}%
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value || '0'}
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        {title}
      </div>
    </div>
  );
};

export default AdminStatsCard;

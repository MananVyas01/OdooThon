import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { itemAPI, swapAPI } from '../utils/api';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import Button from '../components/Button';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentItems, setRecentItems] = useState([]);
  const [swapStats, setSwapStats] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch data with error handling for each endpoint
      const promises = [
        itemAPI.getDashboardStats().catch(err => {
          console.warn('Dashboard stats failed:', err);
          return { data: { data: { totalItems: 0, availableItems: 0, swappedItems: 0, hiddenItems: 0, totalLikes: 0, categoryStats: [] } } };
        }),
        itemAPI.getMyItems({ limit: 5, sort: 'createdAt', order: 'desc' }).catch(err => {
          console.warn('My items failed:', err);
          return { data: { data: [] } };
        }),
        swapAPI.getSwapStats().catch(err => {
          console.warn('Swap stats failed:', err);
          return { data: { data: { availablePoints: 0, activeSwaps: 0, completedSwaps: 0, pendingRequests: 0 } } };
        })
      ];

      const [statsResponse, itemsResponse, swapStatsResponse] = await Promise.all(promises);

      setStats(statsResponse.data);
      setRecentItems(itemsResponse.data.data || []);
      setSwapStats(swapStatsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      // Set default empty data
      setStats({ data: { totalItems: 0, availableItems: 0, swappedItems: 0, hiddenItems: 0, totalLikes: 0, categoryStats: [] } });
      setRecentItems([]);
      setSwapStats({ data: { availablePoints: 0, activeSwaps: 0, completedSwaps: 0, pendingRequests: 0 } });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="xl" />
      </div>
    );
  }

  const statusData = [
    { name: 'Available', value: stats?.data?.availableItems || 0, color: '#10b981' },
    { name: 'Swapped', value: stats?.data?.swappedItems || 0, color: '#3b82f6' },
    { name: 'Hidden', value: stats?.data?.hiddenItems || 0, color: '#6b7280' },
  ];

  const categoryData = stats?.data?.categoryStats?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const getStatusColor = (availability) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'swapped': return 'bg-blue-100 text-blue-800';
      case 'hidden': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like-new': return 'bg-emerald-100 text-emerald-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your garment listings and swap activity</p>
        </div>

        {/* Welcome Message for New Users */}
        {(!stats?.data?.totalItems || stats?.data?.totalItems === 0) && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">👋</span>
                </div>
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold mb-2">Welcome to StyleSwap!</h2>
                <p className="text-blue-100 mb-4">
                  Start your sustainable fashion journey by listing your first item or browsing what others have to offer.
                </p>
                <div className="flex space-x-4">
                  <Link to="/items/new">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">
                      📝 List Your First Item
                    </Button>
                  </Link>
                  <Link to="/items">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                      🔍 Browse Items
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">👗</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Listings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.data?.totalItems || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-semibold">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Available</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.data?.availableItems || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">🔄</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Swapped</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.data?.swappedItems || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-semibold">❤️</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Likes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.data?.totalLikes || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-sm p-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">💎</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white opacity-90">Available Points</p>
                <p className="text-2xl font-semibold text-white">{swapStats?.data?.availablePoints || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-sm p-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">🔄</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white opacity-90">Active Swaps</p>
                <p className="text-2xl font-semibold text-white">{swapStats?.data?.activeSwaps || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-sm p-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white opacity-90">Completed Swaps</p>
                <p className="text-2xl font-semibold text-white">{swapStats?.data?.completedSwaps || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-sm p-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">⏰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white opacity-90">Pending Requests</p>
                <p className="text-2xl font-semibold text-white">{swapStats?.data?.pendingRequests || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/items/new">
              <Button className="w-full">
                📝 List New Item
              </Button>
            </Link>
            <Link to="/items">
              <Button variant="outline" className="w-full">
                🔍 Browse Items
              </Button>
            </Link>
            <Link to="/swaps">
              <Button variant="outline" className="w-full">
                🔄 View My Swaps
              </Button>
            </Link>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Availability Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData.filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Listings</h3>
              <Link to="/items">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/items/${item._id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(item.condition)}`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.availability)}`}>
                        {item.availability}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.views || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {recentItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No items found</p>
              <Link to="/items/new">
                <Button className="mt-4">
                  Create Your First Listing
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

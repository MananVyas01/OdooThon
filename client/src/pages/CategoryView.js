import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { itemAPI } from '../utils/api';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import Button from '../components/Button';

const CategoryView = () => {
  const [categorizedItems, setCategorizedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const toast = useToast();

  const categoryInfo = {
    'tops': { name: 'Tops', icon: '👕', color: 'bg-blue-100 text-blue-800' },
    'bottoms': { name: 'Bottoms', icon: '👖', color: 'bg-purple-100 text-purple-800' },
    'outerwear': { name: 'Outerwear', icon: '🧥', color: 'bg-indigo-100 text-indigo-800' },
    'dresses': { name: 'Dresses', icon: '👗', color: 'bg-pink-100 text-pink-800' },
    'shoes': { name: 'Shoes', icon: '👠', color: 'bg-cyan-100 text-cyan-800' },
    'accessories': { name: 'Accessories', icon: '👜', color: 'bg-yellow-100 text-yellow-800' },
    'activewear': { name: 'Activewear', icon: '🏃', color: 'bg-green-100 text-green-800' },
    'formal': { name: 'Formal', icon: '🤵', color: 'bg-gray-100 text-gray-800' },
    'casual': { name: 'Casual', icon: '👔', color: 'bg-orange-100 text-orange-800' },
    'other': { name: 'Other', icon: '🛍️', color: 'bg-gray-100 text-gray-800' }
  };

  const fetchCategorizedItems = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching categorized items...');
      
      // For testing purposes, let's add a dummy token if none exists
      if (!localStorage.getItem('token')) {
        localStorage.setItem('token', 'dummy-token');
        localStorage.setItem('user', JSON.stringify({
          id: 'test-user',
          name: 'Test User',
          email: 'test@example.com'
        }));
      }
      
      const response = await itemAPI.getItems({ limit: 100, sort: 'category', order: 'asc' });
      console.log('Response:', response);
      const items = response.data.data;
      console.log('Items:', items);
      
      // Group items by category
      const grouped = items.reduce((acc, item) => {
        const category = item.category || 'other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        return acc;
      }, {});
      
      console.log('Grouped items:', grouped);
      setCategorizedItems(grouped);
      
      // Auto-expand categories with items
      const initialExpanded = {};
      Object.keys(grouped).forEach(category => {
        initialExpanded[category] = true;
      });
      setExpandedCategories(initialExpanded);
    } catch (error) {
      console.error('Error fetching categorized items:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      toast.error(`Failed to load categorized items: ${error.response?.data?.message || error.message}`);
      
      // Set empty state instead of failing completely
      setCategorizedItems({});
      setExpandedCategories({});
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategorizedItems();
  }, [fetchCategorizedItems]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="xl" />
      </div>
    );
  }

  const sortedCategories = Object.keys(categorizedItems).sort((a, b) => {
    const aInfo = categoryInfo[a] || { name: a };
    const bInfo = categoryInfo[b] || { name: b };
    return aInfo.name.localeCompare(bInfo.name);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse by Category</h1>
            <p className="text-gray-600 mt-2">Explore items organized by category</p>
          </div>
          <div className="flex space-x-2">
            <Link to="/items">
              <Button variant="outline">
                🔍 All Items
              </Button>
            </Link>
            <Link to="/items/new">
              <Button>
                <span className="mr-2">➕</span>
                List New Item
              </Button>
            </Link>
          </div>
        </div>

        {sortedCategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">👗</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">Be the first to list an item!</p>
            <Link to="/items/new">
              <Button>List Your First Item</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedCategories.map((category) => {
              const items = categorizedItems[category];
              const info = categoryInfo[category] || { name: category, icon: '🛍️', color: 'bg-gray-100 text-gray-800' };
              const isExpanded = expandedCategories[category];

              return (
                <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{info.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{info.name}</h3>
                          <p className="text-sm text-gray-600">{items.length} items</p>
                        </div>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${info.color}`}>
                          {info.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to filtered view
                            window.location.href = `/items?category=${category}`;
                          }}
                        >
                          View All
                        </Button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <svg 
                            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="border-t border-gray-200">
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {items.slice(0, 8).map((item) => (
                            <Link
                              key={item._id}
                              to={`/items/${item._id}`}
                              className="group block"
                            >
                              <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-square bg-gray-100 relative">
                                  {item.images && item.images.length > 0 ? (
                                    <img
                                      src={item.images[0].url}
                                      alt={item.images[0].alt || item.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <span className="text-4xl">👗</span>
                                    </div>
                                  )}
                                </div>
                                <div className="p-3">
                                  <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                                    {item.title}
                                  </h4>
                                  <div className="flex items-center justify-between">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(item.condition)}`}>
                                      {item.condition}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Size {item.size}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        {items.length > 8 && (
                          <div className="mt-4 text-center">
                            <Link
                              to={`/items?category=${category}`}
                              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                            >
                              View all {items.length} items in {info.name} →
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryView;

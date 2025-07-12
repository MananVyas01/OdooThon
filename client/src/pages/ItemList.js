import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { itemAPI } from '../utils/api';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import Button from '../components/Button';
import Select from '../components/Select';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Fuse from 'fuse.js';
import { Search, X } from 'lucide-react';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    condition: '',
    search: '',
    sort: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 12
  });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [deleting, setDeleting] = useState(false);
  const [searchParams] = useSearchParams();

  const toast = useToast();

  // Fuse.js configuration for fuzzy search
  const fuseOptions = {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'tags', weight: 0.2 },
      { name: 'brand', weight: 0.1 }
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2
  };

  // Use Fuse.js for fuzzy search
  const fuse = useMemo(() => new Fuse(items, fuseOptions), [items]);

  // Filter items based on search and other filters
  const filteredItems = useMemo(() => {
    let result = items;

    // Apply fuzzy search if search term exists
    if (filters.search.trim()) {
      const searchResults = fuse.search(filters.search);
      result = searchResults.map(result => result.item);
    }

    // Apply other filters
    if (filters.category) {
      result = result.filter(item => item.category === filters.category);
    }
    if (filters.size) {
      result = result.filter(item => item.size === filters.size);
    }
    if (filters.condition) {
      result = result.filter(item => item.condition === filters.condition);
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[filters.sort];
      const bValue = b[filters.sort];
      
      if (filters.order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [items, filters, fuse]);

  // Initialize filters from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilters(prev => ({
        ...prev,
        category: categoryParam
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemAPI.getItems(filters);
      setItems(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await itemAPI.deleteItem(deleteModal.item._id);
      toast.success('Item deleted successfully');
      setDeleteModal({ isOpen: false, item: null });
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    } finally {
      setDeleting(false);
    }
  };

  const handleLikeToggle = async (itemId) => {
    try {
      await itemAPI.toggleLike(itemId);
      fetchItems(); // Refresh to update like count
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'activewear', label: 'Activewear' },
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'other', label: 'Other' }
  ];

  const sizeOptions = [
    { value: '', label: 'All Sizes' },
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: 'One Size', label: 'One Size' }
  ];

  const conditionOptions = [
    { value: '', label: 'All Conditions' },
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'very-good', label: 'Very Good' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'category', label: 'Category (A-Z)' },
    { value: 'condition', label: 'Condition' },
    { value: 'likeCount', label: 'Most Liked' },
    { value: 'viewCount', label: 'Most Viewed' }
  ];

  const orderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' }
  ];

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like-new': return 'bg-emerald-100 text-emerald-800';
      case 'very-good': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'tops': 'bg-blue-100 text-blue-800',
      'bottoms': 'bg-purple-100 text-purple-800',
      'outerwear': 'bg-indigo-100 text-indigo-800',
      'dresses': 'bg-pink-100 text-pink-800',
      'shoes': 'bg-cyan-100 text-cyan-800',
      'accessories': 'bg-yellow-100 text-yellow-800',
      'activewear': 'bg-green-100 text-green-800',
      'formal': 'bg-gray-100 text-gray-800',
      'casual': 'bg-orange-100 text-orange-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
            <p className="text-gray-600 mt-2">Discover amazing garments from our community</p>
          </div>
          <Link to="/items/new">
            <Button>
              <span className="mr-2">➕</span>
              List New Item
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="flex items-center border rounded-md shadow-sm">
                <div className="p-2">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search items..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="border-0 focus:ring-0 focus:outline-none"
                />
                {filters.search && (
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="p-2"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select
                value={filters.category}
                onChange={(value) => handleFilterChange('category', value)}
                options={categoryOptions}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <Select
                value={filters.size}
                onChange={(value) => handleFilterChange('size', value)}
                options={sizeOptions}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <Select
                value={filters.condition}
                onChange={(value) => handleFilterChange('condition', value)}
                options={conditionOptions}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <Select
                value={filters.sort}
                onChange={(value) => handleFilterChange('sort', value)}
                options={sortOptions}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <Select
                value={filters.order}
                onChange={(value) => handleFilterChange('order', value)}
                options={orderOptions}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setFilters({
                category: '',
                size: '',
                condition: '',
                search: '',
                sort: 'createdAt',
                order: 'desc',
                page: 1,
                limit: 12
              })}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">👗</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">
              {Object.values(filters).some(v => v && v !== 1 && v !== 12) 
                ? 'Try adjusting your filters to see more items.'
                : 'Be the first to list an item!'
              }
            </p>
            <Link to="/items/new">
              <Button>List Your First Item</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Item Image */}
                  <div className="aspect-square bg-gray-100 relative">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0].url}
                        alt={item.images[0].alt || item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">👗</span>
                      </div>
                    )}
                    
                    {/* Like Button */}
                    <button
                      onClick={() => handleLikeToggle(item._id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                    >
                      <span className="text-red-500">
                        {item.likes && item.likes.length > 0 ? '❤️' : '🤍'}
                      </span>
                    </button>

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Size: {item.size}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(item.condition)}`}>
                        {item.condition}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-3">👁️ {item.views || 0}</span>
                        <span>❤️ {item.likes?.length || 0}</span>
                      </div>
                      {item.brand && (
                        <span className="text-xs text-gray-500">{item.brand}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span>📍 {item.location?.city}, {item.location?.state}</span>
                      </div>
                      <Link
                        to={`/items/${item._id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={pagination.page === page ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, item: null })}
          title="Delete Item"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{deleteModal.item?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setDeleteModal({ isOpen: false, item: null })}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ItemList;

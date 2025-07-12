import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { itemAPI } from '../utils/api';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import TextArea from '../components/TextArea';

const ItemForm = () => {
  const [item, setItem] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: 'good',
    tags: '',
    brand: '',
    originalPrice: '',
    location: {
      city: '',
      state: '',
      country: 'USA',
      zipCode: ''
    },
    swapPreferences: {
      preferredCategories: [],
      preferredSizes: [],
      notes: ''
    },
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const toast = useToast();

  useEffect(() => {
    if (isEditing) {
      fetchItem();
    }
  }, [id, isEditing]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await itemAPI.getItem(id);
      const itemData = response.data.data;
      
      setItem({
        ...itemData,
        tags: Array.isArray(itemData.tags) ? itemData.tags.join(', ') : itemData.tags || '',
        swapPreferences: {
          preferredCategories: itemData.swapPreferences?.preferredCategories || [],
          preferredSizes: itemData.swapPreferences?.preferredSizes || [],
          notes: itemData.swapPreferences?.notes || ''
        }
      });
    } catch (error) {
      console.error('Error fetching item:', error);
      toast.error('Failed to load item');
      navigate('/items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const itemData = {
        ...item,
        tags: item.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : undefined
      };

      if (isEditing) {
        await itemAPI.updateItem(id, itemData);
        toast.success('Item updated successfully');
      } else {
        await itemAPI.createItem(itemData);
        toast.success('Item created successfully');
      }
      
      navigate('/items');
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error(isEditing ? 'Failed to update item' : 'Failed to create item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setItem(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setItem(prev => ({ ...prev, [field]: value }));
    }
  };

  const categoryOptions = [
    { value: '', label: 'Select Category' },
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
    { value: '', label: 'Select Size' },
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: 'XXXL', label: 'XXXL' },
    { value: '0', label: '0' },
    { value: '2', label: '2' },
    { value: '4', label: '4' },
    { value: '6', label: '6' },
    { value: '8', label: '8' },
    { value: '10', label: '10' },
    { value: '12', label: '12' },
    { value: '14', label: '14' },
    { value: '16', label: '16' },
    { value: '18', label: '18' },
    { value: '20', label: '20' },
    { value: 'One Size', label: 'One Size' }
  ];

  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Item' : 'List New Item'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Update your item details' : 'Share your amazing garment with the community'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Vintage Denim Jacket"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <TextArea
                  value={item.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your item's condition, style, and any special features..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <Select
                  value={item.category}
                  onChange={(value) => handleInputChange('category', value)}
                  options={categoryOptions}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <Input
                  type="text"
                  value={item.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  placeholder="e.g., jacket, t-shirt, sneakers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size *
                </label>
                <Select
                  value={item.size}
                  onChange={(value) => handleInputChange('size', value)}
                  options={sizeOptions}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <Select
                  value={item.condition}
                  onChange={(value) => handleInputChange('condition', value)}
                  options={conditionOptions}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <Input
                  type="text"
                  value={item.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="e.g., Nike, Zara, H&M"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price ($)
                </label>
                <Input
                  type="number"
                  value={item.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <Input
                  type="text"
                  value={item.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="vintage, casual, summer (separated by commas)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add tags separated by commas to help others find your item
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <Input
                  type="text"
                  value={item.location.city}
                  onChange={(e) => handleInputChange('location.city', e.target.value)}
                  placeholder="New York"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <Input
                  type="text"
                  value={item.location.state}
                  onChange={(e) => handleInputChange('location.state', e.target.value)}
                  placeholder="NY"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <Input
                  type="text"
                  value={item.location.zipCode}
                  onChange={(e) => handleInputChange('location.zipCode', e.target.value)}
                  placeholder="10001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <Input
                  type="text"
                  value={item.location.country}
                  onChange={(e) => handleInputChange('location.country', e.target.value)}
                  placeholder="USA"
                />
              </div>
            </div>
          </div>

          {/* Swap Preferences */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Swap Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <TextArea
                  value={item.swapPreferences.notes}
                  onChange={(e) => handleInputChange('swapPreferences.notes', e.target.value)}
                  placeholder="What are you looking to swap for? Any specific preferences or requirements..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/items')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Item' : 'Create Item')
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;

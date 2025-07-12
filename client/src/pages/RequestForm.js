import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { requestAPI } from '../utils/api';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Loading from '../components/Loading';

const RequestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location: '',
    dueDate: '',
    status: 'pending'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchRequest();
    }
  }, [id, isEdit]);

  const fetchRequest = async () => {
    try {
      setInitialLoading(true);
      const response = await requestAPI.getRequest(id);
      const request = response.data.request;
      
      setFormData({
        title: request.title || '',
        description: request.description || '',
        category: request.category || '',
        priority: request.priority || 'medium',
        location: request.location || '',
        dueDate: request.dueDate ? new Date(request.dueDate).toISOString().split('T')[0] : '',
        status: request.status || 'pending'
      });
    } catch (error) {
      console.error('Error fetching request:', error);
      toast.error('Failed to load request');
      navigate('/requests');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.dueDate && new Date(formData.dueDate) <= new Date()) {
      newErrors.dueDate = 'Due date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const requestData = {
        ...formData,
        dueDate: formData.dueDate || undefined
      };
      
      if (isEdit) {
        await requestAPI.updateRequest(id, requestData);
        toast.success('Request updated successfully');
      } else {
        await requestAPI.createRequest(requestData);
        toast.success('Request created successfully');
      }
      
      navigate('/requests');
    } catch (error) {
      console.error('Error saving request:', error);
      const message = error.response?.data?.message || 'Failed to save request';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: 'technical', label: 'Technical' },
    { value: 'administrative', label: 'Administrative' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' },
    { value: 'other', label: 'Other' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Request' : 'Create New Request'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update your request details' : 'Fill in the details for your new request'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  placeholder="Enter request title"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`
                    w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                    focus:outline-none focus:ring-primary-500 focus:border-primary-500
                    ${errors.description ? 'border-red-500' : ''}
                  `}
                  placeholder="Provide detailed description of your request"
                  required
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <Select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  options={categoryOptions}
                  error={errors.category}
                  required
                />
              </div>

              <div>
                <Select
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  options={priorityOptions}
                  error={errors.priority}
                />
              </div>

              {isEdit && (
                <div>
                  <Select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={statusOptions}
                    error={errors.status}
                  />
                </div>
              )}

              <div>
                <Input
                  label="Location (Optional)"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  error={errors.location}
                  placeholder="Enter location"
                />
              </div>

              <div>
                <Input
                  label="Due Date (Optional)"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  error={errors.dueDate}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/requests')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                {isEdit ? 'Update Request' : 'Create Request'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;

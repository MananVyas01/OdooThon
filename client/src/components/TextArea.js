import React from 'react';

const TextArea = ({ 
  label,
  error,
  className = '',
  rows = 3,
  ...props 
}) => {
  const baseClasses = `
    w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 
    focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500
    ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={baseClasses.trim()}
        rows={rows}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default TextArea;

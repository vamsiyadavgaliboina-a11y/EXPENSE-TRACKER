import React from 'react';

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32 animate-pulse"></div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array(rows)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-12 animate-pulse"></div>
      ))}
  </div>
);

export const EmptyState = ({ icon: Icon, title, message, action }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
      {Icon && <Icon className="text-gray-400" size={32} />}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{message}</p>
    {action && <div>{action}</div>}
  </div>
);

export const ErrorState = ({ message, retry }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
      <span className="text-2xl">❌</span>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error</h3>
    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{message}</p>
    {retry && (
      <button
        onClick={retry}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

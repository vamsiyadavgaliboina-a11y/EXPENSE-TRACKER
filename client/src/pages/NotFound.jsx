import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="text-6xl font-bold text-primary">404</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
          Sorry, the page you're looking for doesn't exist. Let's get you back on track!
        </p>
        
        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Home size={20} />
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

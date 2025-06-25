import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Доступ запрещён</h2>
          <p className="text-gray-700 mb-6">Только администратор может просматривать эту страницу.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
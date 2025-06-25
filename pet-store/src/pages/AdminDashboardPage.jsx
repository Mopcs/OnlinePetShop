import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Добро пожаловать, администратор</h1>
        <p className="mb-8 text-gray-600">Выберите раздел слева для управления.</p>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboardPage;
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Панель администратора</h1>
        <p className="text-gray-600 mb-8">Выберите раздел для управления:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Управление товарами */}
          <Link to="/admin/products" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-between group border-l-4 border-green-600 hover:border-green-700">
            <div className="flex items-center">
              <svg className="w-10 h-10 text-green-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 100 0m0 0a2 2 0 100 0" />
              </svg>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Управление товарами</h2>
                <p className="text-sm text-gray-500 mt-1">Добавление, редактирование и удаление товаров</p>
              </div>
            </div>
            <svg className="w-6 h-6 text-green-600 group-hover:translate-x-1 transform transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Управление заказами */}
          <Link to="/admin/orders" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-between group border-l-4 border-blue-600 hover:border-blue-700">
            <div className="flex items-center">
              <svg className="w-10 h-10 text-blue-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 7h3m-3-14h3" />
              </svg>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Управление заказами</h2>
                <p className="text-sm text-gray-500 mt-1">Просмотр и изменение статусов заказов</p>
              </div>
            </div>
            <svg className="w-6 h-6 text-blue-600 group-hover:translate-x-1 transform transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Дополнительные разделы (необязательно) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/categories" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-yellow-500 hover:border-yellow-600 flex items-center">
            <svg className="w-10 h-10 text-yellow-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M7 7h.01M7 15h.01M12 7h.01M12 15h.01M17 7h.01M17 15h.01M2 12h20M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7M5 12l1 3h12l1-3M9 12V5a1 1 0 112 0v7M15 12V5a1 1 0 112 0v7" />
            </svg>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Категории</h2>
              <p className="text-sm text-gray-500 mt-1">Создание и управление категориями товаров</p>
            </div>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
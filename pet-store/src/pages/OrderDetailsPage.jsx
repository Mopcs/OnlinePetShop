import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_URL from '../config/config';

const OrderDetailsPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');
  const orderId = window.location.pathname.split('/').pop();

  // Перевод статуса заказа
  const getStatusLabel = (status) => {
    switch (status) {
      case 'CREATED': return { label: 'Создан', color: 'bg-blue-100 text-blue-800' };
      case 'PENDING': return { label: 'В обработке', color: 'bg-yellow-100 text-yellow-800' };
      case 'SHIPPED': return { label: 'Отправлен', color: 'bg-indigo-100 text-indigo-800' };
      case 'DELIVERED': return { label: 'Доставлен', color: 'bg-green-100 text-green-800' };
      case 'CANCELED': return { label: 'Отменён', color: 'bg-red-100 text-red-800' };
      default: return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Загрузка данных о заказе
  useEffect(() => {
    const fetchOrder = async () => {
      if (!token) {
        setError('Вы не авторизованы');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error(`Ошибка загрузки заказа: ${res.status}`);

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Сервер вернул не JSON");
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Не удалось загрузить данные заказа');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center h-full">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-md max-w-md w-full text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Ошибка</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Войти снова
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Заказ не найден
      </div>
    );
  }

  const { label, color } = getStatusLabel(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Заказ #{order.id}</h1>
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${color}`}>
                {label}
              </span>
            </div>

            {/* Информация о дате */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Создан: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Товары в заказе */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Товары:</h2>
            <ul className="space-y-3 mb-6">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100 transition">
                  <span className="font-medium text-gray-800">{item.productName}</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {item.quantity} × {item.price} ₽
                  </span>
                </li>
              ))}
            </ul>

            {/* Итоговая сумма */}
            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Итого:</span>
                <span>{order.totalAmount.toFixed(2)} ₽</span>
              </div>
            </div>

            {/* Дополнительные данные */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.address && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600">Адрес доставки</p>
                  <p className="mt-1 font-medium text-gray-800">{order.address}</p>
                </div>
              )}
              {order.phone && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600">Телефон</p>
                  <p className="mt-1 font-medium text-gray-800">{order.phone}</p>
                </div>
              )}
              {order.comment && (
                <div className="bg-gray-50 p-4 rounded-md col-span-1 md:col-span-2">
                  <p className="text-sm text-gray-600">Комментарий к заказу</p>
                  <p className="mt-1 font-medium text-gray-800">{order.comment}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
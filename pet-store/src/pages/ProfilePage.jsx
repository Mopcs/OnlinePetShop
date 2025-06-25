import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrderList from '../components/OrderList';
import API_URL from '../config/config';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // Состояние для тоста
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isErrorToast, setIsErrorToast] = useState(false);

  const token = localStorage.getItem('authToken');

  // Показываем тост
  const showToastMessage = (message, isError = false) => {
    setToastMessage(message);
    setIsErrorToast(isError);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Перевод статуса
  const getStatusLabel = (status) => {
    switch (status) {
      case 'CREATED': return 'Создан';
      case 'PENDING': return 'В обработке';
      case 'SHIPPED': return 'Отправлен';
      case 'DELIVERED': return 'Доставлен';
      case 'CANCELED': return 'Отменён';
      default: return status;
    }
  };

  // Загрузка данных пользователя и его заказов
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Вы не авторизованы');
        setLoading(false);
        return;
      }

      try {
        const userRes = await fetch(`${API_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!userRes.ok) throw new Error(await userRes.text() || 'Ошибка загрузки профиля');

        const userData = await userRes.json();
        setUser(userData);
        setFormData({
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone || '',
          address: userData.address || ''
        });

        const ordersRes = await fetch(`${API_URL}/orders/history`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!ordersRes.ok && ordersRes.status !== 404) {
          throw new Error('Не удалось загрузить историю заказов');
        }

        const data = await ordersRes.json();
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
  const res = await fetch(`${API_URL}/user/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Ошибка обновления профиля');
  }


  let updatedUser = {};
  if (res.status !== 204 && res.headers.get('content-type')?.includes('application/json')) {
    updatedUser = await res.json();
  } else {
    const refreshRes = await fetch(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!refreshRes.ok) {
      throw new Error('Не удалось загрузить обновлённые данные');
    }

    updatedUser = await refreshRes.json();
    }

    setUser(updatedUser);
    setFormData({
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone || '',
      address: updatedUser.address || ''
    });
    setEditing(false);
    showToastMessage('Профиль успешно обновлён!', false);
  } catch (err) {
    showToastMessage(err.message || 'Не удалось сохранить изменения', true);
  }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Загрузка...</div>
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
            <h2 className="text-xl font-bold text-gray-800 mb-2">Ошибка загрузки</h2>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Личный кабинет</h1>

        {/* Flexbox для независимых блоков */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Личные данные */}
          <div className="lg:w-[400px] shrink-0 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Личная информация</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-green-600 hover:text-green-800 transition"
                >
                  Редактировать
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 (999) 123-45-67"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="г. Москва, ул. Питомцев, д. 10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Сохранить
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p><strong>Имя:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                {user.phone && <p><strong>Телефон:</strong> {user.phone}</p>}
                {user.address && <p><strong>Адрес:</strong> {user.address}</p>}
              </div>
            )}
          </div>

          {/* История заказов */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ваши заказы</h2>
            <OrderList
              orders={orders}
              getStatusLabel={getStatusLabel}
              emptyMessage="У вас пока нет заказов"
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Toast уведомление */}
      {showToast && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white max-w-xs z-50 animate-fadeIn ${
            isErrorToast ? 'bg-red-600' : 'bg-green-600'
          }`}
          style={{
            animation: 'slideIn 0.3s ease forwards'
          }}
        >
          <p>{toastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
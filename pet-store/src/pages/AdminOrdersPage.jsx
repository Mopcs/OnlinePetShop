import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_URL from '../config/config';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Проверка роли
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      setError('Доступ запрещён: вы не администратор');
      setLoading(false);
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Вы не авторизованы');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Ошибка загрузки заказов');

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  };

  // Перевод статуса
  const getStatusLabel = (status) => {
    switch(status) {
      case 'CREATED':
        return 'Создан';
      case 'PENDING':
        return 'В обработке';
      case 'SHIPPED':
        return 'Отправлен';
      case 'DELIVERED':
        return 'Доставлен';
      case 'CANCELED':
        return 'Отменён';
      default:
        return status;
    }
  };

  // Обновление статуса
  const updateStatus = async (id, status, e) => {
    e.stopPropagation();

    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    if (role !== 'ADMIN') {
      alert('У вас нет прав для изменения статуса');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/orders/${id}/status?status=${status}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Ошибка изменения статуса');

      setOrders(prev =>
        prev.map(order => (order.id === id ? { ...order, status } : order))
      );
    } catch (err) {
      alert(err.message || 'Не удалось изменить статус');
    }
  };

  // Открытие деталей заказа
  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  // Закрытие модалки
  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Удаление заказа
  const handleDelete = async (id, e) => {
    e?.stopPropagation();

    if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) return;

    const token = localStorage.getItem('authToken');

    try {
      const res = await fetch(`${API_URL}/admin/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Ошибка:', text);
        throw new Error('Ошибка удаления заказа');
      }

      setOrders(prev => prev.filter(order => order.id !== id));
      setSelectedOrder(null);
    } catch (err) {
      alert(err.message || 'Не удалось удалить заказ');
    }
  };

  // Если загружается
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Загрузка...</div>
    );
  }

  // Если ошибка
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
    );
  }

  // Если заказов нет
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Управление заказами</h1>
          <p className="text-center text-gray-500">Нет заказов</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Управление заказами</h1>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Обновить список
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Подробнее
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Удалить
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.userEmail || 'user@example.com'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={order.status || ''}
                      onChange={(e) => updateStatus(order.id, e.target.value, e)}
                      className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500"
                    >
                      <option value="CREATED">Создан</option>
                      <option value="PENDING">В обработке</option>
                      <option value="SHIPPED">Отправлен</option>
                      <option value="DELIVERED">Доставлен</option>
                      <option value="CANCELED">Отменён</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {order.totalAmount} ₽
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openOrderDetails(order);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 underline"
                    >
                      Подробнее
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(order.id, e)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Модалка с деталями заказа */}
        {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-4xl w-full rounded-lg shadow-xl overflow-hidden animate-fadeIn">
            {/* Заголовок модалки */}
            <div className="relative border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 p-6">Заказ #{selectedOrder.id}</h2>
              <button
                onClick={closeOrderDetails}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Контент модалки с прокруткой */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {/* Информация о клиенте */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">Информация о клиенте</h3>
                  <p><strong>Статус:</strong> {getStatusLabel(selectedOrder.status)}</p>
                  <p><strong>Email:</strong> {selectedOrder.userEmail}</p>
                  <p><strong>Телефон:</strong> {selectedOrder.phone || '—'}</p>
                  <p><strong>Адрес:</strong> {selectedOrder.address || '—'}</p>
                  <p><strong>Комментарий:</strong> {selectedOrder.comment || 'Нет комментария'}</p>
                </div>
              </div>

              {/* Товары в заказе */}
              <h3 className="font-semibold text-gray-800 mb-3">Товары в заказе</h3>
              <div className="overflow-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-4 text-left text-sm font-medium uppercase tracking-wider text-gray-500">Товар</th>
                      <th className="py-2 px-4 text-left text-sm font-medium uppercase tracking-wider text-gray-500">Цена</th>
                      <th className="py-2 px-4 text-left text-sm font-medium uppercase tracking-wider text-gray-500">Количество</th>
                      <th className="py-2 px-4 text-right text-sm font-medium uppercase tracking-wider text-gray-500">Сумма</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="py-3 px-4">{item.productName}</td>
                        <td className="py-3 px-4">{item.price} ₽</td>
                        <td className="py-3 px-4">{item.quantity} шт.</td>
                        <td className="py-3 px-4 text-right font-semibold">
                          {(item.price * item.quantity).toFixed(2)} ₽
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="py-3 px-4 text-right font-bold">Итого:</td>
                      <td className="py-3 px-4 text-right font-bold text-green-600">
                        {selectedOrder.totalAmount} ₽
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Кнопки действий */}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={closeOrderDetails}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  Закрыть
                </button>
                <button
                  onClick={(e) => handleDelete(selectedOrder.id, e)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  Удалить заказ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminOrdersPage;
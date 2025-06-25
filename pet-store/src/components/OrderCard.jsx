import React from 'react';
import { Link } from 'react-router-dom';

const OrderCard = ({ order }) => {
  const token = localStorage.getItem('authToken');

  // Перевод статуса
  const getStatusLabel = (status) => {
    switch (status) {
      case 'CREATED':
        return { label: 'Создан', color: 'bg-blue-100 text-blue-800' };
      case 'PENDING':
        return { label: 'В обработке', color: 'bg-yellow-100 text-yellow-800' };
      case 'SHIPPED':
        return { label: 'Отправлен', color: 'bg-indigo-100 text-indigo-800' };
      case 'DELIVERED':
        return { label: 'Доставлен', color: 'bg-green-100 text-green-800' };
      case 'CANCELED':
        return { label: 'Отменён', color: 'bg-red-100 text-red-800' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const { label, color } = getStatusLabel(order.status);

  // Подсчёт суммы
  const total = order.items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) ?? 0;

  // Показываем тост
  const showToast = (message, isError = false) => {
    const toast = document.getElementById('custom-toast');
    if (toast) {
      toast.textContent = message;
      toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white max-w-xs z-50 transition-opacity ${
        isError ? 'bg-red-600' : 'bg-green-600'
      } opacity-100`;
      setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => {
          toast.classList.remove('opacity-100');
        }, 300);
      }, 3000);
    } else {
      console.warn('Тост не найден');
    }
  };

  // Защита от гостей
  const handleDetailsClick = (e) => {
    if (!token) {
      e.preventDefault();
      showToast('Войдите, чтобы просмотреть заказ', true);
      window.location.href = '/login';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition group">
      {/* Заголовок и дата */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Заказ #{order.id}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
          {label}
        </span>
      </div>

      {/* Товары в заказе */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {order.items?.slice(0, 4).map(item => (
          <img
            key={item.productId}
            src={item.product.imageUrl || "https://placehold.co/100x100?text=No+Image"}
            alt={item.product.name}
            className="w-full h-16 object-cover rounded"
          />
        ))}
        {order.items?.length > 4 && (
          <div className="flex items-center justify-center bg-gray-100 rounded text-gray-500 text-sm">
            +{order.items.length - 4}
          </div>
        )}
      </div>

      {/* Сумма и ссылка */}
      <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="font-semibold text-gray-700">Итого: {total.toFixed(2)} ₽</div>
        {token ? (
          <Link
            to={`/orders/${order.id}`}
            onClick={handleDetailsClick}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Подробнее →
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              showToast('Войдите, чтобы просмотреть заказ', true);
              setTimeout(() => {
                window.location.href = '/login';
              }, 1000);
            }}
            className="text-green-600 hover:text-green-800 text-sm font-medium cursor-pointer"
          >
            Подробнее →
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
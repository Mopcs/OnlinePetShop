import React from 'react';
import { Link } from 'react-router-dom';

const OrderList = ({ orders, getStatusLabel, emptyMessage = "У вас пока нет заказов" }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="w-16 h-16 mx-auto text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 000 4h6a2 2 0 000-4M9 5a2 2 0 00-2 2h10a2 2 0 00-2-2M9 12h6m-6 5h6"
          />
        </svg>
        <p className="mt-2 text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Контейнер с прокруткой */}
      <div className="max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-green-300">
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">Заказ #{order.id}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'SHIPPED'
                      ? 'bg-indigo-100 text-indigo-800'
                      : order.status === 'CANCELED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <p className="mt-2 text-sm">
                Сумма: <span className="font-semibold">{order.totalAmount} ₽</span>
              </p>

              <Link to={`/orders/${order.id}`} className="text-green-600 hover:text-green-800 block mt-2 text-sm font-medium">
                Подробнее →
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {orders.length > 6 && (
        <div className="absolute right-0 bottom-0 top-0 w-1 bg-green-200 rounded-full opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
      )}
    </div>
  );
};

export default OrderList;
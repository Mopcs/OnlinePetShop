import React from 'react';

const OrderItem = ({ item }) => {
  return (
    <div className="flex items-center border-b pb-4 border-gray-100 last:border-b-0 last:pb-0">
      <img
        src={item.product?.imageUrl || "https://placehold.co/60x60/98FB98/FFFFFF?text=No+Image"}
        alt={item.product?.name || 'Нет названия'}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-medium text-gray-800">{item.product?.name}</h3>
        <p className="text-sm text-gray-600">Цена: {item.price} ₽</p>
        <p className="text-sm text-gray-600">Количество: {item.quantity} шт.</p>
      </div>
      <div className="font-semibold text-gray-800">{(item.price * item.quantity).toFixed(2)} ₽</div>
    </div>
  );
};

export default OrderItem;
import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleIncrease = () => onUpdateQuantity(item.productId, item.quantity + 1);
  const handleDecrease = () => {
    if (item.quantity > 1) onUpdateQuantity(item.productId, item.quantity - 1);
  };

  return (
    <div className="flex items-center border-b pb-4">
      <img src={item.imageUrl} alt={item.productName} className="w-20 h-20 object-cover rounded" />
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-medium text-gray-800">{item.productName}</h3>
        <p className="text-sm text-gray-600">Цена: {item.pricePerUnit} ₽</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleDecrease}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={handleIncrease}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          +
        </button>
        <div className="font-semibold ml-4">
          {(item.pricePerUnit * item.quantity).toFixed(2)} ₽
        </div>
        <button
          onClick={() => onRemove(item.productId)}
          className="ml-4 text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CartItem;
import React from 'react';

const EmptyCart = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto text-center">
      <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13h4m-4 8a2 2 0 110-4 2 2 0 010 4zm10 0a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
      <h2 className="text-xl font-bold mt-4">Ваша корзина пуста</h2>
      <p className="text-gray-600 mt-2">Выберите товары, чтобы продолжить</p>
      <button
        onClick={() => window.location.href = '/products'}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        Перейти к товарам
      </button>
    </div>
  );
};

export default EmptyCart;
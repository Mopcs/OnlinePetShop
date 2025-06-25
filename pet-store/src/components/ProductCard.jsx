import React, { useState, useEffect } from 'react';
import API_URL from '../config/config';

const ProductCard = ({ product, onClick }) => {
  const token = localStorage.getItem('authToken');
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Локальное состояние для тоста
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isToastError, setIsToastError] = useState(false);

  // Показываем тост
  const showToastMessage = (message, isError = false) => {
    setToastMessage(message);
    setIsToastError(isError);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Проверка избранного при монтировании
  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/wishlist/check/${product.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setIsInWishlist(data.isInWishlist))
      .catch(() => setIsInWishlist(false));
  }, [product.id, token]);

  // Добавление / удаление из избранного
  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    if (!token) {
      showToastMessage('Войдите, чтобы добавить в избранное', true);
      return;
    }

    setWishlistLoading(true);

    try {
      const url = isInWishlist
        ? `${API_URL}/wishlist/remove/${product.id}`
        : `${API_URL}/wishlist/add/${product.id}`;

      const method = isInWishlist ? 'DELETE' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id })
      });

      if (!res.ok) throw new Error('Ошибка работы с избранным');

      setIsInWishlist(!isInWishlist);
      showToastMessage(isInWishlist ? 'Удалено из избранного' : 'Добавлено в избранное', false);
    } catch (err) {
      showToastMessage(err.message || 'Не удалось обновить избранное', true);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <>
      <div 
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105"
        onClick={() => onClick(product)}
      >
        {/* Изображение */}
        <div className="relative">
          <img
            src={product.imageUrl || "https://placehold.co/300x200/98FB98/FFFFFF?text=Нет+фото"}
            alt={product.name}
            className="w-full h-56 object-cover"
          />

          {/* Кнопка избранного */}
          <button
            onClick={handleAddToWishlist}
            disabled={wishlistLoading}
            className={`absolute top-2 right-2 p-2 rounded-full shadow-md flex items-center justify-center transition ${
              wishlistLoading ? 'opacity-70 bg-gray-200' : ''
            }`}
            aria-label={isInWishlist ? 'В избранном' : 'Добавить в избранное'}
          >
            {wishlistLoading ? (
              <svg className="animate-spin h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" fill="transparent" />
              </svg>
            ) : (
              <svg
                className={`w-5 h-5 ${isInWishlist ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}
                fill={isInWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>

          {/* Скидка или новинка */}
          {product.discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-{product.discount}%</span>
          )}
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">Новинка</span>
          )}
        </div>

        {/* Описание */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-lg font-bold text-green-700">{product.price} ₽</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick(product);
              }}
              className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
            >
              Подробнее →
            </button>
          </div>
        </div>
      </div>

      {/* Toast уведомление */}
      {showToast && (
        <div
          className="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white max-w-xs z-50 animate-fadeIn"
          style={{
            backgroundColor: isToastError ? '#ef4444' : '#10b981', 
            animation: 'slideIn 0.3s ease forwards'
          }}
        >
          <p>{toastMessage}</p>
        </div>
      )}
    </>
  );
};

export default ProductCard;
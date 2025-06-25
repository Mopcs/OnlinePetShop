import React, { useState, useEffect } from 'react';
import API_URL from '../config/config';

const AddToWishlistButton = ({ productId, onActionSuccess }) => {
  const token = localStorage.getItem('authToken');
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/wishlist/check/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) return;

        const data = await res.json();
        setIsInWishlist(data.isInWishlist);
      } catch (err) {
        console.error('Не удалось проверить избранное');
      }
    };

    if (token) checkWishlistStatus();
  }, [productId, token]);

  // Переключение избранного
  const handleToggleWishlist = async () => {
    if (!token) {
      onActionSuccess('Войдите, чтобы использовать избранное', true);
      return;
    }

    const url = isInWishlist
      ? `${API_URL}/wishlist/remove/${productId}`
      : `${API_URL}/wishlist/add/${productId}`;

    const method = isInWishlist ? 'DELETE' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Ошибка работы с избранным');

      setIsInWishlist(!isInWishlist);
      onActionSuccess(isInWishlist ? 'Удалено из избранного' : 'Добавлено в избранное', false);
    } catch (err) {
      onActionSuccess(err.message || 'Не удалось обновить избранное', true);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      className={`py-3 px-4 rounded-lg flex items-center gap-2 ${
        isInWishlist ? 'bg-pink-100 text-pink-600' : 'bg-pink-50 text-pink-500 hover:bg-pink-100'
      } transition-colors`}
    >
      <svg
        className="w-5 h-5"
        fill={isInWishlist ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {isInWishlist ? 'В избранном' : 'Избранное'}
    </button>
  );
};

export default AddToWishlistButton;
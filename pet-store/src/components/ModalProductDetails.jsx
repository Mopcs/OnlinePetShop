import React, { useState} from 'react';
import AddToWishlistButton from './AddToWishlistButton';
import API_URL from '../config/config';

const ModalProductDetails = ({ product, onClose }) => {
  const token = localStorage.getItem('authToken');
  const [cartLoading, setCartLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [imageError, setImageError] = useState(false);

  // Показываем тост
  const showToastMessage = (message, isError = false) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Добавление в корзину
  const addToCart = async () => {
    if (!token) {
      showToastMessage('Войдите, чтобы добавить товар в корзину', true);
      return;
    }

    setCartLoading(true);

    try {
      const res = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });

      if (!res.ok) throw new Error('Ошибка добавления в корзину');

      showToastMessage('Товар успешно добавлен в корзину!', false);
    } catch (err) {
      showToastMessage(err.message || 'Не удалось добавить товар в корзину', true);
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full relative animate-fadeIn transform transition-all duration-300 ease-in-out">
          {/* Изображение */}
          <div className="relative h-72 overflow-hidden md:h-80">
            <img
              src={product.imageUrl}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <svg className="w-16 h-16 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">Нет изображения</p>
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
              aria-label="Закрыть"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Контент */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description || 'Описание отсутствует'}</p>

            <div className="mb-4">
              <span className="text-xl font-semibold text-green-600">{product.price} ₽</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* В корзину */}
              <button
                onClick={addToCart}
                disabled={cartLoading}
                className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                  cartLoading ? 'bg-green-400 text-white cursor-not-allowed opacity-80' : 'bg-green-600 text-white hover:bg-green-700'
                } transition-colors`}
              >
                {cartLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" fill="transparent"></circle>
                    </svg>
                    Добавляем...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13h4m1 8a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                    В корзину
                  </>
                )}
              </button>

              <AddToWishlistButton productId={product.id} onActionSuccess={showToastMessage} />
            </div>
          </div>
        </div>
      </div>

      {/* Toast уведомление */}
      {showToast && (
        <div className="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white max-w-xs z-50 animate-fadeIn"
             style={{
               backgroundColor: toastMessage.includes('не') ? '#ef4444' : '#10b981',
               animation: 'slideIn 0.3s ease forwards'
             }}>
          <p>{toastMessage}</p>
        </div>
      )}
    </>
  );
};

export default ModalProductDetails;
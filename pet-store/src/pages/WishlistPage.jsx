import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_URL from '../config/config';

const WishlistPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');

  // Состояние для тоста
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isErrorToast, setIsErrorToast] = useState(false);

  // Показываем тост
  const showToastMessage = (message, isError = false) => {
    setToastMessage(message);
    setIsErrorToast(isError);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Если пользователь не авторизован
  useEffect(() => {
    if (!token) {
      setError('Вы должны войти, чтобы открыть избранное');
      setLoading(false);
    }
  }, [token]);

  // Загрузка избранного
  useEffect(() => {
    if (!token) return;

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${API_URL}/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Ошибка загрузки избранного');

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Не удалось загрузить избранное');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  // Удаление товара из избранного
  const handleRemoveFromWishlist = async (productId) => {
    if (!token) {
      showToastMessage('Войдите, чтобы управлять избранным', true);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Ошибка удаления из избранного');

      setProducts(products.filter(p => p.id !== productId));
      showToastMessage('Товар удалён из избранного', false);
    } catch (err) {
      showToastMessage(err.message || 'Не удалось удалить товар', true);
    }
  };

  // Очистка всего избранного
  const handleClearWishlist = async () => {
    if (!window.confirm('Вы уверены?')) return;
    if (!token) {
      showToastMessage('Войдите, чтобы очистить избранное', true);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/wishlist/clear`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Ошибка очистки избранного');

      setProducts([]);
      showToastMessage('Избранное очищено!', false);
    } catch (err) {
      showToastMessage(err.message || 'Не удалось очистить избранное', true);
    }
  };

  // Добавление в корзину
  const addToCart = async (product) => {
    if (!token) {
      showToastMessage('Войдите, чтобы добавить товар в корзину', true);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });

      if (!res.ok) throw new Error('Ошибка при добавлении в корзину');

      showToastMessage('Товар добавлен в корзину', false);
    } catch (err) {
      showToastMessage(err.message || 'Не удалось добавить в корзину', true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
          <svg className="w-20 h-20 text-green-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Избранное</h2>
          <p className="text-gray-600 mb-6">Войдите в аккаунт, чтобы увидеть избранные товары.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Войти
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M10 14l4 4m0 0l4-4m-4 4V6" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Ошибка</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Повторить попытку
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const totalItems = products.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Избранное</h1>

          {totalItems > 0 && (
            <button
              onClick={handleClearWishlist}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Очистить всё
            </button>
          )}
        </div>

        {totalItems === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-gray-600">Ваш список избранного пуст</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group relative">
                {/* Изображение */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Информация о товаре */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                  <p className="mt-2 font-bold text-green-600">{product.price} ₽</p>
                </div>

                {/* Кнопки действий */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-white bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <div className="flex justify-between">
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition"
                    >
                      В корзину
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="bg-pink-100 text-pink-600 px-3 py-2 rounded hover:bg-pink-200 transition"
                    >
                      Удалить
                    </button>
                  </div>
                </div>

                {/* Кнопка "Удалить из избранного" */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWishlist(product.id);
                  }}
                  title="Удалить из избранного"
                >
                </button>
              </div>
            ))}
          </div>
        )}
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

export default WishlistPage;
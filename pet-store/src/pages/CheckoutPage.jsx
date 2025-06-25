import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_URL from '../config/config';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');

  // Локальное состояние для тоста
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Показываем тост
  const showToastMessage = (message, isError = false) => {
    setToastMessage(message);
    setIsError(isError);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Загрузка товаров из корзины
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setError('Войдите, чтобы оформить заказ');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Ошибка загрузки корзины');

        const data = await res.json();
        setCartItems(data.items || []);
      } catch (err) {
        setError(err.message || 'Не удалось загрузить корзину');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  // Обработка оформления заказа
  const handlePlaceOrder = async () => {
    if (!token) {
      showToastMessage('Вы не авторизованы', true);
      setTimeout(() => window.location.href = '/login', 1500);
      return;
    }

    if (cartItems.length === 0) {
      showToastMessage('Добавьте товары в корзину', true);
      return;
    }

    if (!window.confirm('Вы уверены?')) return;

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Ошибка оформления заказа');
      }

      const orderData = await res.json();
      showToastMessage('Заказ оформлен!', false);
      setTimeout(() => {
        window.location.href = `/orders/${orderData.id}`;
      }, 1500);
    } catch (err) {
      showToastMessage(err.message || 'Не удалось оформить заказ', true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Загрузка...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13h4m-4 8a2 2 0 110-4 2 2 0 010 4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H2" />
          </svg>
          <p className="text-gray-600 mb-6">Ваша корзина пуста</p>
          <button
            onClick={() => window.location.href = '/products'}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Перейти к покупкам
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const total = cartItems.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Оформление заказа</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Список товаров */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <div className="flex items-center">
                  <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                    <p className="text-sm text-gray-600">{item.pricePerUnit} ₽ × {item.quantity} шт.</p>
                  </div>
                </div>
                <span className="font-bold text-gray-800">{(item.pricePerUnit * item.quantity).toFixed(2)} ₽</span>
              </div>
            ))}
          </div>

          {/* Итого и кнопка */}
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Итог</h2>
            <div className="mb-4 border-b pb-4">
              <div className="flex justify-between mb-2">
                <span>Сумма:</span>
                <span className="font-semibold text-lg">{total.toFixed(2)} ₽</span>
              </div>
              <div className="flex justify-between">
                <span>Доставка:</span>
                <span className="font-semibold text-lg">Бесплатно</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Оформить заказ
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Toast уведомление */}
      {showToast && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white max-w-xs z-50 animate-fadeIn ${
            isError ? 'bg-red-600' : 'bg-green-600'
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

export default CheckoutPage;
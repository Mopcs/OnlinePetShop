import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartItem from '../components/CartItem';
import API_URL from '../config/config';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
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

  // Загрузка корзины
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        window.location.href = '/login';
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
        setTotalAmount(data.totalPrice || 0);
      } catch (err) {
        showToastMessage(err.message || 'Не удалось загрузить корзину', true);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  // Обновление количества товара
  const updateQuantity = async (productId, quantity) => {
    if (!token) {
      showToastMessage('Войдите, чтобы изменить количество', true);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });

      if (!res.ok) throw new Error('Не удалось обновить количество');

      const contentType = res.headers.get("content-type");
      let updatedCart;
      if (contentType && contentType.includes("application/json")) {
        updatedCart = await res.json();
      } else {
        const cartRes = await fetch(`${API_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        updatedCart = await cartRes.json();
      }
      setCartItems(updatedCart.items);
      setTotalAmount(updatedCart.totalPrice);
      showToastMessage('Количество обновлено', false);
    } catch (err) {
      showToastMessage(err.message || 'Ошибка изменения количества', true);
    }
  };

  // Удаление товара из корзины
  const removeItem = async (productId) => {
    if (!token) {
      showToastMessage('Войдите, чтобы удалить товар', true);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Не удалось удалить товар');

      const contentType = res.headers.get("content-type");
      let updatedCart;

      if (contentType && contentType.includes("application/json")) {
        updatedCart = await res.json();
      } else {
        const refreshRes = await fetch(`${API_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        updatedCart = await refreshRes.json();
      }

      setCartItems(updatedCart.items);
      setTotalAmount(updatedCart.totalPrice);
      showToastMessage('Товар удалён из корзины', false);
    } catch (err) {
      showToastMessage(err.message || 'Ошибка при удалении товара', true);
    }
  };

  // Открытие формы оформления заказа
  const openCheckout = () => {
    if (cartItems.length === 0) {
      showToastMessage('Добавьте товары в корзину', true);
      return;
    }
    setCheckoutOpen(true);
  };

  // Форма оформления заказа
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    comment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      showToastMessage('Вы не авторизованы', true);
      window.location.href = '/login';
      return;
    }

    if (!formData.phone.trim() || !formData.address.trim()) {
      showToastMessage('Введите телефон и адрес', true);
      return;
    }

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
          })),
          phone: formData.phone,
          address: formData.address,
          comment: formData.comment
        })
      });

      if (!res.ok) throw new Error('Не удалось оформить заказ');

      showToastMessage('Заказ оформлен!', false);
      setTimeout(() => {
        window.location.href = '/profile';
      }, 1500);
    } catch (err) {
      showToastMessage(err.message || 'Ошибка оформления заказа', true);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Корзина</h1>

        {/* Таблица товаров */}
        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13h4m1 8a1 1 0 100-2 1 1 0 000 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m-8 4h6" />
            </svg>
            <p className="text-gray-600 mb-6">Ваша корзина пуста</p>
            <button
              onClick={() => window.location.href = '/products'}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Перейти к покупкам
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <CartItem
                    key={item.productId}
                    item={{
                      productId: item.productId,
                      productName: item.productName,
                      pricePerUnit: item.pricePerUnit,
                      quantity: item.quantity,
                      imageUrl: item.imageUrl
                    }}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>

            {/* Итого и оформление заказа */}
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md">
              <div>
                <p className="text-lg font-semibold">
                  Итого: <span className="text-green-600">{totalAmount.toFixed(2)} ₽</span>
                </p>
              </div>
              <button
                onClick={openCheckout}
                className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
              >
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </main>

      {/* Модалка оформления заказа */}
      {checkoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Оформление заказа</h2>
              <button
                onClick={() => setCheckoutOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (999) 123-45-67"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="г. Москва, ул. Питомцев, д. 10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Доставить после 18:00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setCheckoutOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Подтвердить заказ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast уведомление */}
      {showToast && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white max-w-xs z-50 animate-fadeIn`}
          style={{
            backgroundColor: isError ? '#ef4444' : '#10b981',
            animation: 'slideIn 0.3s ease forwards'
          }}
        >
          <p>{toastMessage}</p>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CartPage;
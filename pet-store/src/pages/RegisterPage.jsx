import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_URL from '../config/config';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Имя обязательно';
    if (!formData.email) errors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Неверный формат email';
    if (!formData.password) errors.password = 'Пароль обязателен';
    else if (formData.password.length < 6) errors.password = 'Пароль должен быть не короче 6 символов';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitStatus('loading');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const text = await response.text();
        let errorData;

        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = { message: 'Ошибка регистрации' };
        }

        throw new Error(errorData.message || 'Не удалось зарегистрироваться');
      }

      const data = await response.json();

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('role', data.role);

      setSubmitStatus('success');

      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      setFormErrors({ general: err.message });
      setSubmitStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-lg shadow-md p-6 mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Регистрация</h2>

            {/* Сообщения успеха или ошибки */}
            {submitStatus === 'success' && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Регистрация прошла успешно!
              </div>
            )}

            {submitStatus === 'error' && formErrors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {formErrors.general}
              </div>
            )}

            {/* Форма регистрации */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Имя */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ваше имя"
                  className={`w-full px-4 py-2 border ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ваш email"
                  className={`w-full px-4 py-2 border ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
              </div>

              {/* Пароль */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Введите пароль"
                  className={`w-full px-4 py-2 border ${
                    formErrors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {formErrors.password && <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>}
              </div>

              {/* Кнопка отправки */}
              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-70 mt-4"
              >
                {submitStatus === 'loading' ? (
                  <>
                    <svg className="animate-spin h-5 w-5 inline mr-2 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" fill="transparent"></circle>
                    </svg>
                    Загрузка...
                  </>
                ) : 'Зарегистрироваться'}
              </button>
            </form>

            {/* Ссылка на вход */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">Уже есть аккаунт?</p>
              <a href="/login" className="text-green-600 hover:text-green-800 underline">Войти</a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
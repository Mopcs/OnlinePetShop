import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_URL from '../config/config';

const LoginPage = () => {
  const [formData, setFormData] = useState({
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
    if (!formData.email) errors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Неверный формат email';
    if (!formData.password) errors.password = 'Пароль обязателен';
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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const text = await response.text();

        let errorData = {};
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData.message = 'Ошибка входа';
        }

        if (text.includes('Invalid credentials')) {
          errorData.message = 'Неверный email или пароль';
        }

        throw new Error(errorData.message || 'Ошибка входа');
      }

      const data = await response.json();

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('role', data.role);

      setSubmitStatus('success');

      setTimeout(() => {
        window.location.href = '/';
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
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Вход</h2>

          {submitStatus === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Вы успешно вошли!
            </div>
          )}

          {submitStatus === 'error' && formErrors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {formErrors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Ваш email"
              />
              {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  formErrors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Введите пароль"
              />
              {formErrors.password && <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={submitStatus === 'loading'}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-70"
            >
              {submitStatus === 'loading' ? 'Загрузка...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">Ещё нет аккаунта?</p>
            <a href="/register" className="text-green-600 hover:text-green-800 underline">Зарегистрироваться</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
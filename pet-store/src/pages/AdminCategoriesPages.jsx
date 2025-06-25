import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_URL from '../config/config';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const token = localStorage.getItem('authToken');

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Ошибка загрузки категорий');

        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  // Обработка формы
  const handleChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Введите название категории');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Ошибка создания категории');

      const newCategory = await res.json();
      setCategories([...categories, newCategory]);
      setFormData({ name: '' });
      setShowForm(false);
      alert('Категория создана!');
    } catch (err) {
      alert(err.message || 'Не удалось создать категорию');
    }
  };

  // Удаление категории
  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены?')) return;

    try {
      const res = await fetch(`${API_URL}/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Ошибка удаления категории');

      setCategories(categories.filter(c => c.id !== id));
      alert('Категория удалена');
    } catch (err) {
      alert(err.message || 'Не удалось удалить категорию');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Загрузка...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Категории</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Создать новую
          </button>
        </div>

        {/* Форма создания категории */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Создать новую категорию</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Название категории</label>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Например: Игрушки"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Сохранить
              </button>
            </div>
          </form>
        )}

        {/* Список категорий */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">Нет категорий</p>
          ) : (
            categories.map(cat => (
              <div key={cat.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition relative">
                <h3 className="text-lg font-semibold text-gray-800">{cat.name}</h3>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  aria-label="Удалить"
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminCategoriesPage;
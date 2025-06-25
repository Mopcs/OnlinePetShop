import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_URL from '../config/config';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const token = localStorage.getItem('authToken');

  // Форма добавления/редактирования товара
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    imageUrl: ''
  });

  // Загрузка товаров
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${API_URL}/products`;

        if (selectedCategory !== 'all') {
          url += `/category/${selectedCategory}`;
        }

        if (searchQuery) {
          url = `${API_URL}/products/search?name=${encodeURIComponent(searchQuery)}`;
        }

        const res = await fetch(url);

        if (!res.ok) throw new Error('Ошибка загрузки товаров');

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Не удалось загрузить товары');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) throw new Error('Ошибка загрузки категорий');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      categoryId: e.target.value
    }));
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setShowForm(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      categoryId: product.category.id,
      imageUrl: product.imageUrl
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setCurrentProduct(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      categoryId: '',
      imageUrl: ''
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Проверка длины описания
  if (formData.description.length > 255) {
    alert('Описание не должно превышать 255 символов');
    return;
  }

  try {
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    const res = await fetch(`${API_URL}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text.slice(0, 100));
    }

    const updatedProduct = await res.json();

    if (editMode) {
      setProducts(products.map(p => p.id === currentProduct.id ? updatedProduct : p));
      handleCancelEdit();
    } else {
      setProducts([...products, updatedProduct]);
      setFormData({
        name: '',
        price: '',
        description: '',
        categoryId: '',
        imageUrl: '',
        stock: ''
      });
      setShowForm(false);
    }

    alert(editMode ? 'Товар успешно обновлён!' : 'Новый товар добавлен!');
  } catch (err) {
    alert(`Ошибка: ${err.message}`);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return;

    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Ошибка удаления товара');

      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Фильтрация по категории
  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Фильтр для отображения
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || String(product.category.id) === String(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Товары</h1>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              {editMode ? 'Отмена редактирования' : 'Добавить товар'}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Обновить список
            </button>
          </div>
        </div>

        {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 animate-fadeIn">
          {error}
        </div>
      )}

        {/* Поиск */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Поиск товаров по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Фильтр по категории */}
        <div className="mb-6">
          <select
            value={selectedCategory}
            onChange={handleCategoryFilter}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Все категории</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Форма добавления/редактирования */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editMode ? `Редактировать "${currentProduct?.name}"` : 'Добавить новый товар'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleChange(e)}
                  rows="3"
                  className={`w-full px-4 py-2 border ${
                    formData.description.length > 255 ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-green-500`}
                />
                <p className={`text-xs mt-1 text-right w-full ${
                  formData.description.length > 255 ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {formData.description.length} / 255
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Изображение</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg  "
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  {editMode ? 'Обновить товар' : 'Сохранить товар'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Список товаров */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length === 0 && !loading ? (
            <p className="text-center col-span-full text-gray-500 py-4">Товаров не найдено</p>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover mb-4 rounded" />
                <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                <p className="mt-2 font-semibold text-green-600">{product.price} ₽</p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminProductsPage;
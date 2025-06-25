import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import ModalProductDetails from '../components/ModalProductDetails';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import API_URL from '../config/config';


function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    { id: 'all', name: 'Все категории' }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) throw new Error(`Ошибка загрузки категорий: ${res.status}`);
        const data = await res.json();
        const formatted = [
          { id: 'all', name: 'Все категории' },
          ...data.map(cat => ({ id: cat.id, name: cat.name }))
        ];
        setCategories(formatted);
      } catch (err) {
        console.error(err.message);
        setError('Не удалось загрузить категории');
      }
    };

    fetchCategories();
  }, []);

  // Загрузка товаров
  useEffect(() => {
    const fetchProducts = async () => {
      if (!showAllProducts && (activeCategory === 'all' && !debouncedSearchTerm)) return;

      setLoading(true);
      setError(null);

      try {
        let url;
        if (debouncedSearchTerm) {
          url = `${API_URL}/products/search?name=${encodeURIComponent(debouncedSearchTerm)}`;
        } else if (activeCategory !== 'all') {
          url = `${API_URL}/products/category/${activeCategory}`;
        } else {
          url = `${API_URL}/products`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Ошибка загрузки товаров: ${res.status}`);

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Сервер вернул не JSON');
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err.message);
        setError('Не удалось загрузить товары');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, debouncedSearchTerm, showAllProducts]);

  return (
    <div className="bg-green-50 text-gray-900">
      <Header />
      
      <Hero />

      {/* Фильтр по категориям */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Поиск */}
      <div className="py-6 bg-white border-b border-green-200">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="relative group">
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 bg-green-100 border-none rounded-md focus:ring-2 focus:ring-green-500 outline-none transition duration-200"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Управление отображением товаров */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowAllProducts(!showAllProducts)}
            className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            {showAllProducts ? 'Скрыть товары' : 'Посмотреть все товары'}
          </button>
        </div>

        {/* Только если пользователь нажал "Посмотреть все товары" */}
        {showAllProducts && (
          <>
            {loading ? (
              <p className="text-center text-green-600">Загрузка товаров...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : products.length === 0 ? (
              <p className="text-center text-gray-500">Нет товаров, соответствующих вашему запросу.</p>
            ) : (
              <ProductGrid
                products={products}
                onProductClick={setSelectedProduct}
              />
            )}
          </>
        )}

        {/* Кнопка показать товары снова */}
        {!showAllProducts && (
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Нажмите кнопку выше, чтобы увидеть все товары
            </p>
          </div>
        )}
      </section>

      {/* Отдельно: О нас */}
      <AboutSection />

      {/* Контакты */}
      <ContactSection />

      {/* Подвал */}
      <Footer />

      {/* Модальное окно с деталями товара */}
      {selectedProduct && (
        <ModalProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import ModalProductDetails from '../components/ModalProductDetails';
import API_URL from '../config/config';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    { id: 'all', name: 'Все товары' }
  ]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) throw new Error(`Ошибка загрузки категорий: ${res.status}`);
        const data = await res.json();
        const formatted = [
          { id: 'all', name: 'Все товары' },
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
      setLoading(true);
      setError(null);

      try {
        let url;
        if (activeCategory === 'all' && !debouncedSearchTerm) {
          url = `${API_URL}/products`;
        } else if (activeCategory !== 'all' && !debouncedSearchTerm) {
          url = `${API_URL}/products/category/${activeCategory}`;
        } else {
          url = `${API_URL}/products/search?name=${encodeURIComponent(debouncedSearchTerm)}`;
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
  }, [activeCategory, debouncedSearchTerm]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Градиентный Hero */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-extrabold mb-4">Товары</h1>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Выберите подходящий товар для вашего питомца
          </p>
        </div>
      </section>

      {/* Основной контент */}
      <main>
        <section className="py-8 bg-white shadow-sm">
          <div className="container mx-auto px-4">
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
          </div>
        </section>

        {/* Секция с товарами */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
                <span className="ml-3 text-gray-600">Загрузка товаров...</span>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center mb-6">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600">Нет товаров, соответствующих вашему запросу.</p>
              </div>
            ) : (
              <>
                <ProductGrid
                  products={products}
                  onProductClick={handleProductClick}
                />

                {/* Модалка с деталями товара */}
                {selectedProduct && (
                  <ModalProductDetails
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                  />
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_URL from '../config/config';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error('Ошибка загрузки товара');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Товар не найден</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={product.image || "https://placehold.co/600x400/indigo/purple?text=No+Image "}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <div className="mb-4">
                <span className="text-lg font-semibold text-gray-700">Категория:</span>{' '}
                <span className="text-gray-900">{product.category?.name || 'Без категории'}</span>
              </div>
              <div className="mb-6">
                <span className="text-lg font-bold text-indigo-600">{product.price} ₽</span>
              </div>
              <div className="flex space-x-4">
                <button className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
                  В корзину
                </button>
                <button className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition">
                  В избранное
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
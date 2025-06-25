import React from 'react';

export default function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-block p-3 rounded-full bg-green-100 mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H2" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">О нас</h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
          Мы продаем качественные товары для домашних животных уже 10 лет.
          Наша миссия — сделать жизнь ваших питомцев комфортнее и счастливее.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="text-green-600 text-3xl mb-4">🐾</div>
            <h3 className="font-semibold text-gray-800 mb-2">Любим ваши питомцы</h3>
            <p className="text-gray-600">Все товары разработаны с любовью к животным.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="text-green-600 text-3xl mb-4">🌱</div>
            <h3 className="font-semibold text-gray-800 mb-2">Экологичность</h3>
            <p className="text-gray-600">Используем безопасные материалы и упаковку.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="text-green-600 text-3xl mb-4">📦</div>
            <h3 className="font-semibold text-gray-800 mb-2">Быстрая доставка</h3>
            <p className="text-gray-600">Доставляем заказы по всей России за 3 дня.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
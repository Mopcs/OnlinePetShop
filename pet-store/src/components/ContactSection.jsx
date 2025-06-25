import React from 'react';

export default function ContactSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-block p-3 rounded-full bg-indigo-100 mb-6">
          <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">Свяжитесь с нами</h2>
        <p className="max-w-xl mx-auto text-gray-600 mb-8">
          Если у вас есть вопросы или вы хотите сотрудничать — напишите нам!
        </p>

        <div className="max-w-md mx-auto bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Ваше имя"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              rows="4"
              placeholder="Сообщение"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Отправить
            </button>
          </form>
        </div>

        <div className="mt-8 text-gray-600 space-y-2">
          <p>Телефон: +7 999 123-45-67</p>
          <p>Email: info@petshop.ru</p>
          <p>Адрес: г. Москва, ул. Питомцев, д. 10</p>
        </div>
      </div>
    </section>
  );
}
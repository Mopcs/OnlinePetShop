import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Добро пожаловать в наш магазин</h1>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Выбирайте лучшие товары для вашего питомца и дома.
        </p>
      </div>
    </section>
  );
};

export default Hero;
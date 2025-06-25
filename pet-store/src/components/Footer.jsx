import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-xl font-bold mb-2">PetShop</h2>
            <p className="text-sm text-green-200">Качественные товары для ваших питомцев</p>
          </div>

          <div className="mt-6 md:mt-0">
            <p className="text-sm">&copy; {new Date().getFullYear()} PetShop. Все права защищены.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
import React, { useRef } from 'react';

const CategoryFilter = ({ categories, activeCategory, setActiveCategory }) => {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-green-700 text-white py-4">
      <div className="container mx-auto px-4 relative">
        {/* Левая стрелка */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white text-green-700 p-2 rounded-full shadow hover:bg-gray-100 transition"
          aria-label="Предыдущие категории"
        >
          ←
        </button>

        {/* Блок с категориями по центру*/}
        <div className="flex justify-center">
          <div
            ref={scrollContainerRef}
            className="max-w-full overflow-x-auto scrollbar-hide flex items-center gap-2 py-2 px-6"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
          >
            <ul className="flex gap-2">
              {categories.map(category => (
                <li key={category.id} className="whitespace-nowrap">
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full transition ${
                      activeCategory === category.id
                        ? 'bg-white text-green-700 font-semibold'
                        : 'hover:bg-green-600'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Градиент слева (при скролле вправо) */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-green-700 to-transparent"></div>

          {/* Градиент справа (всегда виден) */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-green-700 to-transparent"></div>
        </div>

        {/* Правая стрелка */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white text-green-700 p-2 rounded-full shadow hover:bg-gray-100 transition"
          aria-label="Следующие категории"
        >
          →
        </button>

        {/* CSS для скрытия скроллбара */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default CategoryFilter;
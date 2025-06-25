import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../image/bone-svgrepo-com.svg";

const Header = () => {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL || '/api'}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Логотип и Название как ссылка */}
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img
            src={logo}
            alt="PetShop Logo"
            className="w-8 h-8 object-contain transition-transform duration-300 hover:scale-110"
          />
          <span className="text-xl font-bold text-gray-900">PetShop</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/products" className="text-gray-700 hover:text-green-600 transition">Товары</Link>

          {/* Корзина только для USER */}
          {role !== 'ADMIN' && (
            <>
              <Link to="/cart" className="text-gray-700 hover:text-green-600 transition">Корзина</Link>
              
              <Link to="/wishlist" className="relative group">
                <svg className="w-6 h-6 text-gray-700 group-hover:text-green-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="absolute bottom-6 left-0 w-32 text-xs text-center bg-gray-800 text-white py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Избранное
                </span>
              </Link>
            </>
          )}

          {/* Профиль и Админка */}
          {token && (
            <>
              {role === 'USER' && (
                <Link to="/profile" className="text-gray-700 hover:text-green-600 transition">Профиль</Link>
              )}
              
              {role === 'ADMIN' && (
                <Link to="/admin" className="text-gray-700 hover:text-green-600 transition">Админка</Link>
              )}

              <div className="relative group">
                <button className="text-gray-700 hover:text-green-600 transition">
                  Аккаунт ▾
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg hidden group-hover:block group-focus-within:block z-10">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 transition"
                  >
                    Выйти
                  </button>
                </div>
              </div>
            </>
          )}

          {!token && (
            <Link to="/login" className="text-green-600 hover:text-green-700 transition">Войти</Link>
          )}
        </nav>

        {/* Мобильное меню */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Мобильное меню контент */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-inner pb-4">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link to="/products" className="text-gray-700 hover:text-green-600">Товары</Link>

            {role !== 'ADMIN' && (
              <>
                <Link to="/cart" className="text-gray-700 hover:text-green-600">Корзина</Link>
                <Link to="/wishlist" className="text-gray-700 hover:text-green-600">Избранное</Link>
              </>
            )}

            {token && (
              <>
                {role === 'USER' && (
                  <Link to="/profile" className="text-gray-700 hover:text-green-600">Профиль</Link>
                )}
                
                {role === 'ADMIN' && (
                  <Link to="/admin" className="text-gray-700 hover:text-green-600">Админка</Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-left text-red-600 hover:text-red-800 transition"
                >
                  Выйти
                </button>
              </>
            )}

            {!token && (
              <Link to="/login" className="text-green-600 hover:text-green-700">Войти</Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
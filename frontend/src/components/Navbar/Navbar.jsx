import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import CategoryBar from '../CategorySidebar/CategorySidebar';

export default function Navbar({ category, onCategorySelect }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [search, setSearch] = useState('');

  // Keep input in sync with the URL param when on the home page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    setSearch(q);
  }, [location.search]);

  function handleLogout() { logout(); navigate('/login'); }

  function handleSearch(e) {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/?search=${encodeURIComponent(q)}` : '/');
  }

  return (
    <header>
    <nav className="bg-flipblue sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none shrink-0">
          <span className="text-white font-bold text-xl italic tracking-tight">Flipkart</span>
          <span className="text-yellow-300 text-[10px] font-medium italic">
            Explore&nbsp;<span className="text-yellow-300">Plus</span>&nbsp;✦
          </span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex flex-1 min-w-0 max-w-2xl">
          <div className="flex w-full rounded overflow-hidden shadow-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products, brands and more"
              className="flex-1 min-w-0 px-3 sm:px-4 py-2 text-sm text-gray-800 outline-none"
            />
            <button
              type="submit"
              className="bg-white px-4 text-flipblue font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              🔍
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">

          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-1 text-white text-sm font-medium px-3 py-1.5 rounded hover:bg-blue-600 transition-colors">
                <span>👤</span>
                <span className="hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                <span className="text-xs">▾</span>
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link to="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  📦 My Orders
                </Link>
                <hr className="border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-flipblue text-sm font-bold px-5 py-1.5 rounded hover:bg-gray-50 transition-colors"
            >
              Login
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="flex items-center gap-1.5 text-white text-sm font-medium px-3 py-1.5 rounded hover:bg-blue-600 transition-colors"
          >
            <span className="text-lg">🛒</span>
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="bg-fliporange text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>

    {/* Category bar — only shown on home page */}
    {location.pathname === '/' && onCategorySelect && (
      <CategoryBar selected={category} onSelect={onCategorySelect} />
    )}
    </header>
  );
}

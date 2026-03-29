import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard  from '../components/ProductCard/ProductCard';
import Loader       from '../components/Loader/Loader';
import { getProducts } from '../services/productService';
import dummyProducts   from '../data/dummyProducts';

const USE_API = true;

export default function HomePage({ category, onCategoryChange }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const [products, setProducts]     = useState([]);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  function clearSearch() { setSearchParams({}); }

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (USE_API) {
        const res = await getProducts({ search, category, page, limit: 12 });
        setProducts(res.data.products);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        let result = dummyProducts;
        if (category) result = result.filter((p) => p.category === category);
        if (search)   result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
        setProducts(result);
        setTotalPages(1);
      }
    } catch {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => { setPage(1); }, [search, category]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-flipbg">
      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* Active filter chips */}
        {(category || search) && (
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {category && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-flipblue text-xs font-semibold px-3 py-1 rounded-full">
                {category}
                <button onClick={() => onCategoryChange('')} className="ml-1 text-flipblue font-bold hover:text-blue-800">✕</button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-flipblue text-xs font-semibold px-3 py-1 rounded-full">
                "{search}"
                <button onClick={clearSearch} className="ml-1 text-flipblue font-bold hover:text-blue-800">✕</button>
              </span>
            )}
            {!loading && (
              <span className="text-xs text-flipgray ml-auto">{products.length} results</span>
            )}
          </div>
        )}

        {/* States */}
        {loading && <Loader />}

        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-red-500 mb-3">{error}</p>
            <button className="btn-primary" onClick={fetchProducts}>Retry</button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16 text-flipgray">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-lg font-medium text-gray-700">No products found{search ? ` for "${search}"` : ''}</p>
            {(search || category) && (
              <button
                className="mt-4 btn-primary"
                onClick={() => { clearSearch(); onCategoryChange(''); }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center items-center gap-1.5 mt-8 flex-wrap">
            <button
              className="px-3 py-1.5 border border-gray-300 rounded text-sm text-flipblue bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`px-3 py-1.5 rounded text-sm border transition-colors
                  ${page === n
                    ? 'bg-flipblue text-white border-flipblue'
                    : 'bg-white text-flipblue border-gray-300 hover:bg-gray-50'}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="px-3 py-1.5 border border-gray-300 rounded text-sm text-flipblue bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';

export default function SearchBar({ value, onSearch }) {
  const [input, setInput] = useState(value || '');

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(input.trim());
  }

  function handleClear() {
    setInput('');
    onSearch('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl">
      <div className="flex flex-1 bg-white rounded-l overflow-hidden border border-r-0 border-blue-300">
        <span className="flex items-center pl-3 text-flipgray text-sm">🔍</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for products, brands and more"
          className="flex-1 px-3 py-2 text-sm text-gray-800 outline-none"
        />
        {input && (
          <button
            type="button"
            onClick={handleClear}
            className="px-2 text-flipgray hover:text-gray-700 text-sm"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className="bg-flipblue text-white px-5 py-2 rounded-r text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
}

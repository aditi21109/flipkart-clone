const CATEGORIES = [
  { name: 'Mobiles',     icon: '📱' },
  { name: 'Laptops',     icon: '💻' },
  { name: 'Televisions', icon: '📺' },
  { name: 'Audio',       icon: '🎧' },
  { name: 'Cameras',     icon: '📷' },
  { name: 'Appliances',  icon: '🏠' },
  { name: 'Fashion',     icon: '👗' },
  { name: 'Books',       icon: '📚' },
];

// Horizontal category bar — sits below the Navbar
export default function CategoryBar({ selected, onSelect }) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-14 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center overflow-x-auto scrollbar-hide gap-1">

          <li
            onClick={() => onSelect('')}
            className={`flex flex-col items-center gap-1 px-3 sm:px-5 py-2 sm:py-3 cursor-pointer shrink-0 border-b-2 transition-colors
              ${selected === ''
                ? 'border-flipblue text-flipblue'
                : 'border-transparent text-gray-600 hover:text-flipblue'}`}
          >
            <span className="text-2xl">🏪</span>
            <span className="text-[11px] font-medium whitespace-nowrap">All</span>
          </li>

          {CATEGORIES.map(({ name, icon }) => (
            <li
              key={name}
              onClick={() => onSelect(selected === name ? '' : name)}
              className={`flex flex-col items-center gap-1 px-3 sm:px-5 py-2 sm:py-3 cursor-pointer shrink-0 border-b-2 transition-colors
                ${selected === name
                  ? 'border-flipblue text-flipblue'
                  : 'border-transparent text-gray-600 hover:text-flipblue'}`}
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-[11px] font-medium whitespace-nowrap">{name}</span>
            </li>
          ))}

        </ul>
      </div>
    </div>
  );
}

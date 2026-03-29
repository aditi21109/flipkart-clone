export default function Loader({ text = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-9 h-9 border-4 border-gray-200 border-t-flipblue rounded-full animate-spin" />
      <p className="text-flipgray text-sm">{text}</p>
    </div>
  );
}

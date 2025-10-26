export default function Tab({ texto, activo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-semibold rounded-t-lg ${
        activo
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {texto}
    </button>
  );
}
export function Label({ texto, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block font-medium text-gray-700 mb-1 mt-3">
      {texto}
    </label>
  );
}

export function Input({ id, tipo = "text", placeholder }) {
  return (
    <input
      id={id}
      type={tipo}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export function Boton({ texto, onClick, color = "bg-blue-600" }) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition`}
    >
      {texto}
    </button>
  );
}

export function Tab({ texto, activo, onClick }) {
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

export function Tarjeta({ children }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mt-4">
      {children}
    </div>
  );
}

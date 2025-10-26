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

export function Ventana({ children, onClose }) {
  const handleVentanaClick = (e) => e.stopPropagation();
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={onClose} >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm"
        onClick={handleVentanaClick}>
        {children}
        <div className="mt-4 text-right">
            <button 
                onClick={onClose} 
                className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300" >
                Cerrar
            </button>
        </div>
      </div>
    </div>
  );
}
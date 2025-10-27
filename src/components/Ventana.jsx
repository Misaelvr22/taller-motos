function Ventana({ children, onClose }) {
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

export default Ventana;
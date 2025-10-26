export default function Boton({ texto, onClick, color = "bg-blue-600" }) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition`}
    >
      {texto}
    </button>
  );
}
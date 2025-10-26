export default function Input({ id, tipo = "text", placeholder }) {
  return (
    <input
      id={id}
      type={tipo}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
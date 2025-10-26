export default function Tarjeta({ children }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mt-4">
      {children}
    </div>
  );
}
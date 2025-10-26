
export default function Label({ texto, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block font-medium text-gray-700 mb-1 mt-3">
      {texto}
    </label>
  );
}
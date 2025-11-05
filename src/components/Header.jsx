// src/components/Header.jsx
import { getUsuario, logout } from "../services/AuthService.jsx";

function Header() {
    const user = getUsuario();

    const handleLogout = () => {
        logout();
        window.location.reload();
    };

    return (
        <header className="flex justify-between items-center bg-white shadow px-6 py-4">
            <div>
                <h1 className="text-xl font-bold">Sistema de Gestión - Taller</h1>
                <p className="text-gray-500 text-sm">Gestión de citas y servicios</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-medium">{user?.nombre_usuario}</p>
                    <p className="text-xs text-gray-500">@{user?.rol}</p>
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                >
                    Cerrar Sesión
                </button>
            </div>
        </header>
    );
}

export default Header;
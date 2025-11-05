// src/components/Navbar.jsx
import { getUsuario, logout } from "../services/AuthService.jsx";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    // Intentamos obtener el usuario, pero protegemos contra errores
    let user = null;
    try {
        user = getUsuario();
    } catch (error) {
        console.error("Error obteniendo usuario:", error);
        user = null;
    }

    const handleLogout = () => {
        try {
            logout();
        } catch (error) {
            console.error("Error cerrando sesión:", error);
        }
        window.location.href = "/"; // Redirige al login y recarga la página
    };

    return (
        <header className="flex justify-between items-center bg-white shadow px-6 py-4">
            <div>
                <h1 className="text-xl font-bold">Sistema de Gestión - Taller</h1>
                <p className="text-gray-500 text-sm">Gestión de citas y servicios</p>
            </div>

            {user ? (
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-medium">
                            {user.rol === "ADMINISTRADOR" ? "Administrador" : "Trabajador"}
                        </p>
                        <p className="text-xs text-gray-500">
                            @{user.nombre_usuario || user.usuario}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            ) : (
                <div className="text-gray-400 text-sm">
                    Usuario no autenticado
                </div>
            )}
        </header>
    );
}

export default Navbar;

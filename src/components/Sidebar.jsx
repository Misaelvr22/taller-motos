import { useNavigate, useLocation } from "react-router-dom";
import { Users, UserPlus, ClipboardList, Settings, Home } from "lucide-react";
import { getUsuario } from "../services/AuthService.jsx";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUsuario();

    const menuItems = [
        { path: "/dashboard", label: "Dashboard", icon: Home, roles: ["ADMINISTRADOR", "TRABAJADOR"] },
        { path: "/ConsultaClientes", label: "Clientes", icon: Users, roles: ["ADMINISTRADOR", "TRABAJADOR"] },
        { path: "/nuevo-cliente", label: "Nuevo Cliente", icon: UserPlus, roles: ["ADMINISTRADOR", "TRABAJADOR"] },
        { path: "/ordenes", label: "Órdenes", icon: ClipboardList, roles: ["ADMINISTRADOR", "TRABAJADOR"] },
        { path: "/usuarios", label: "Gestionar Usuarios", icon: Settings, roles: ["ADMINISTRADOR"] },
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <aside className="w-64 bg-white shadow-lg min-h-screen">
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Menú</h2>
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        // Verificar si el usuario tiene acceso a este item
                        if (!item.roles.includes(user?.rol)) {
                            return null;
                        }

                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.path}
                                onClick={() => handleNavigation(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                    isActive
                                        ? "bg-gray-900 text-white shadow-md"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}

export default Sidebar;

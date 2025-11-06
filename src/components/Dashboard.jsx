// src/components/Dashboard.jsx
import { getUsuario } from "../services/AuthService.jsx";
import Layout from "./Layout.jsx";

function Dashboard() {
    const user = getUsuario();

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Bienvenido, {user?.nombre_usuario}!</h2>
                    <p className="text-gray-600 mb-4">
                        Usa el menú lateral para navegar por el sistema de gestión del taller.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-blue-900 mb-2">📋 Clientes</h3>
                            <p className="text-sm text-blue-700">Gestiona la información de tus clientes</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h3 className="font-semibold text-green-900 mb-2">🛠 Órdenes</h3>
                            <p className="text-sm text-green-700">Administra las órdenes de servicio</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <h3 className="font-semibold text-purple-900 mb-2">🏍 Motocicletas</h3>
                            <p className="text-sm text-purple-700">Registra las motos de tus clientes</p>
                        </div>
                        {user?.rol === "ADMINISTRADOR" && (
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <h3 className="font-semibold text-red-900 mb-2">👥 Usuarios</h3>
                                <p className="text-sm text-red-700">Registra a tus trabajadores (solo admin)</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;
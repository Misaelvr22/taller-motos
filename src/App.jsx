import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Interfaces/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ConsultaClientes from "./Interfaces/ConsultaClientes.jsx";
import NuevoCliente from "./Interfaces/NuevoCliente.jsx";
import OrdenServicio from "./Interfaces/OrdenServicio.jsx";
import NuevoUsuario from "./Interfaces/NuevoUsuario.jsx";
import { getUsuario } from "./services/AuthService.jsx";

// Componente para proteger rutas
function ProtectedRoute({ children, requireAdmin = false }) {
    const user = getUsuario();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (requireAdmin && user.rol !== "ADMINISTRADOR") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const user = getUsuario();
        setIsAuthenticated(!!user);
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta pública - Login */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <Login onLogin={handleLogin} />
                        )
                    }
                />

                {/* Dashboard - Requiere autenticación */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Consulta Clientes - Requiere autenticación */}
                <Route
                    path="/ConsultaClientes"
                    element={
                        <ProtectedRoute>
                            <ConsultaClientes />
                        </ProtectedRoute>
                    }
                />

                {/* Nuevo Cliente - Requiere autenticación */}
                <Route
                    path="/nuevo-cliente"
                    element={
                        <ProtectedRoute>
                            <NuevoCliente />
                        </ProtectedRoute>
                    }
                />

                {/* Órdenes de Servicio - Requiere autenticación */}
                <Route
                    path="/ordenes"
                    element={
                        <ProtectedRoute>
                            <OrdenServicio />
                        </ProtectedRoute>
                    }
                />

                {/* Nuevo Usuario - Solo ADMIN */}
                <Route
                    path="/usuarios"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <NuevoUsuario />
                        </ProtectedRoute>
                    }
                />

                {/* Ruta por defecto - redirige al dashboard o login */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

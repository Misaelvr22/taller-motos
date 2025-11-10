import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import { Database, Users, Bike, Wrench, RefreshCw, Trash2, AlertTriangle, X } from "lucide-react";

function AdminPanel() {
    const [usuarios, setUsuarios] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [motocicletas, setMotocicletas] = useState([]);
    const [ordenes, setOrdenes] = useState([]);
    const [tabActiva, setTabActiva] = useState("usuarios");
    const [modalEliminar, setModalEliminar] = useState(null);

    useEffect(() => {
        cargarTodo();
    }, []);

    const cargarTodo = async () => {
        await Promise.all([
            cargarUsuariosTodos(),
            cargarClientesTodos(),
            cargarMotocicletasTodos(),
            cargarOrdenesTodos()
        ]);
    };

    const cargarUsuariosTodos = async () => {
        try {
            const response = await fetch("${API_BASE_URL}/usuarios/listar-todos", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const data = await response.json();
                setUsuarios(data);
            }
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    };

    const cargarClientesTodos = async () => {
        try {
            const response = await fetch("${API_BASE_URL}/clientes/listar-todos", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const data = await response.json();
                setClientes(data);
            }
        } catch (error) {
            console.error("Error al cargar clientes:", error);
        }
    };

    const cargarMotocicletasTodos = async () => {
        try {
            const response = await fetch("${API_BASE_URL}/motocicletas/listar-todos", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const data = await response.json();
                setMotocicletas(data);
            }
        } catch (error) {
            console.error("Error al cargar motocicletas:", error);
        }
    };

    const cargarOrdenesTodos = async () => {
        try {
            const response = await fetch("${API_BASE_URL}/orden/listar-todos", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const data = await response.json();
                setOrdenes(data);
            }
        } catch (error) {
            console.error("Error al cargar órdenes:", error);
        }
    };

    const reactivarUsuario = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/reactivar/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                toast.success("Usuario reactivado");
                cargarUsuariosTodos();
            }
        } catch (error) {
            toast.error("Error al reactivar usuario");
        }
    };
    
    const eliminarUsuarioPermanente = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/eliminar/${modalEliminar.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                toast.success("Usuario eliminado permanentemente");
                setModalEliminar(null);
                cargarUsuariosTodos();
            }
        } catch (error) {
            toast.error("Error al eliminar usuario");
        }
    };

    const reactivarCliente = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/reactivar/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                toast.success("Cliente reactivado");
                cargarClientesTodos();
            }
        } catch (error) {
            toast.error("Error al reactivar cliente");
        }
    };
    
    const eliminarClientePermanente = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/eliminar/${modalEliminar.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                toast.success("Cliente eliminado permanentemente");
                setModalEliminar(null);
                cargarClientesTodos();
            }
        } catch (error) {
            toast.error("Error al eliminar cliente");
        }
    };

    const reactivarOrden = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orden/reactivar/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                toast.success("Orden reactivada");
                cargarOrdenesTodos();
            }
        } catch (error) {
            toast.error("Error al reactivar orden");
        }
    };
    
    const eliminarOrdenPermanente = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/orden/eliminar/${modalEliminar.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                toast.success("Orden eliminada permanentemente");
                setModalEliminar(null);
                cargarOrdenesTodos();
            }
        } catch (error) {
            toast.error("Error al eliminar orden");
        }
    };
    
    const abrirModalEliminar = (tipo, id, nombre) => {
        setModalEliminar({ tipo, id, nombre });
    };
    
    const confirmarEliminacion = () => {
        if (modalEliminar.tipo === 'usuario') {
            eliminarUsuarioPermanente();
        } else if (modalEliminar.tipo === 'cliente') {
            eliminarClientePermanente();
        } else if (modalEliminar.tipo === 'orden') {
            eliminarOrdenPermanente();
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Database className="w-8 h-8" /> Panel de Administración
                    </h2>
                    <p className="text-gray-600">Visualiza y gestiona todos los registros de la base de datos</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-2 border-b border-gray-200">
                            <button
                                onClick={() => setTabActiva("usuarios")}
                                className={`px-4 py-2 font-medium transition-colors ${
                                    tabActiva === "usuarios"
                                        ? "border-b-2 border-gray-900 text-gray-900"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <Users className="w-4 h-4 inline mr-2" />
                                Usuarios ({usuarios.length})
                            </button>
                            <button
                                onClick={() => setTabActiva("clientes")}
                                className={`px-4 py-2 font-medium transition-colors ${
                                    tabActiva === "clientes"
                                        ? "border-b-2 border-gray-900 text-gray-900"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <Users className="w-4 h-4 inline mr-2" />
                                Clientes ({clientes.length})
                            </button>
                            <button
                                onClick={() => setTabActiva("motocicletas")}
                                className={`px-4 py-2 font-medium transition-colors ${
                                    tabActiva === "motocicletas"
                                        ? "border-b-2 border-gray-900 text-gray-900"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <Bike className="w-4 h-4 inline mr-2" />
                                Motocicletas ({motocicletas.length})
                            </button>
                            <button
                                onClick={() => setTabActiva("ordenes")}
                                className={`px-4 py-2 font-medium transition-colors ${
                                    tabActiva === "ordenes"
                                        ? "border-b-2 border-gray-900 text-gray-900"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <Wrench className="w-4 h-4 inline mr-2" />
                                Órdenes ({ordenes.length})
                            </button>
                        </div>
                        <button
                            onClick={cargarTodo}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Actualizar
                        </button>
                    </div>

                    {/* Tabla Usuarios */}
                    {tabActiva === "usuarios" && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {usuarios.map((u) => (
                                        <tr key={u.idUsuario} className={!u.activo ? "bg-red-50" : ""}>
                                            <td className="px-6 py-4 text-sm text-gray-900">{u.idUsuario}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.nombreUsuario}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{u.nombrePila} {u.apellidoCompleto}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    u.rol === 'ADMINISTRADOR' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {u.rol}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    u.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {u.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    {!u.activo && (
                                                        <button
                                                            onClick={() => reactivarUsuario(u.idUsuario)}
                                                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                                        >
                                                            Reactivar
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => abrirModalEliminar('usuario', u.idUsuario, u.nombreUsuario)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Eliminar permanentemente"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Tabla Clientes */}
                    {tabActiva === "clientes" && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {clientes.map((c) => (
                                        <tr key={c.idCliente} className={!c.activo ? "bg-red-50" : ""}>
                                            <td className="px-6 py-4 text-sm text-gray-900">{c.idCliente}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.nombreCliente}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{c.numeroCliente}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    c.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {c.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    {!c.activo && (
                                                        <button
                                                            onClick={() => reactivarCliente(c.idCliente)}
                                                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                                        >
                                                            Reactivar
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => abrirModalEliminar('cliente', c.idCliente, c.nombreCliente)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Eliminar permanentemente"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Tabla Motocicletas */}
                    {tabActiva === "motocicletas" && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Año</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {motocicletas.map((m) => (
                                        <tr key={m.idMotocicleta} className={!m.activo ? "bg-red-50" : ""}>
                                            <td className="px-6 py-4 text-sm text-gray-900">{m.idMotocicleta}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{m.marca}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{m.modelo}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{m.year}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{m.placa}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {m.cliente?.nombreCliente || 'Sin cliente'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    m.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {m.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Tabla Órdenes */}
                    {tabActiva === "ordenes" && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motocicleta</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {ordenes.map((o) => (
                                        <tr key={o.idOrden} className={!o.activo ? "bg-red-50" : ""}>
                                            <td className="px-6 py-4 text-sm text-gray-900">{o.idOrden}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {o.cliente?.nombreCliente || 'Sin cliente'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {o.motocicleta ? `${o.motocicleta.marca} ${o.motocicleta.modelo}` : 'Sin moto'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                {o.descripcionServicio}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                ${o.costo ? o.costo.toFixed(2) : '0.00'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    o.status === 'COMPLETADO' ? 'bg-green-100 text-green-800' :
                                                    o.status === 'EN_PROCESO' ? 'bg-blue-100 text-blue-800' :
                                                    o.status === 'CANCELADO' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    o.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {o.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    {!o.activo && (
                                                        <button
                                                            onClick={() => reactivarOrden(o.idOrden)}
                                                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                                        >
                                                            Reactivar
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => abrirModalEliminar('orden', o.idOrden, `Orden #${o.idOrden}`)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Eliminar permanentemente"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                
                {/* Modal de Confirmación */}
                {modalEliminar && (
                    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border-2 border-red-200 animate-in">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-red-100 rounded-full">
                                        <AlertTriangle className="w-6 h-6 text-red-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Confirmación</h2>
                                </div>
                                <button
                                    onClick={() => setModalEliminar(null)}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-gray-700 mb-4 text-lg">
                                    ¿Estás seguro de eliminar <span className="font-bold text-red-600">permanentemente</span> este registro?
                                </p>
                                
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
                                    <p className="text-sm font-medium text-red-800">
                                        {modalEliminar.nombre}
                                    </p>
                                    <p className="text-xs text-red-600 mt-1">
                                        ID: {modalEliminar.id}
                                    </p>
                                </div>
                                
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex gap-2">
                                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-yellow-800 mb-1">Advertencia</p>
                                            <p className="text-xs text-yellow-700">
                                                Esta acción eliminará el registro <strong>permanentemente</strong> de la base de datos y <strong>NO se puede deshacer</strong>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setModalEliminar(null)}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmarEliminacion}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium shadow-lg shadow-red-200 hover:shadow-red-300"
                                >
                                    Eliminar Permanentemente
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default AdminPanel;

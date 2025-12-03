import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import { Database, Users, Bike, Wrench, RefreshCw, Trash2, AlertTriangle, X } from "lucide-react";
import { API_BASE_URL } from "../config/api.js";

function AdminPanel() { //declarar variable de lista fija actualizada
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
            const response = await fetch(`${API_BASE_URL}/usuarios/listar-todos`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const data = await response.json();
                setUsuarios(data);
            }
        } catch (error) {
            toast.error(`Error al cargar usuarios: ${error.message || 'Error desconocido'}`);
        }
    };

    const cargarClientesTodos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/listar-todos`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const data = await response.json();
                setClientes(data);
            }
        } catch  {
            toast.error('Error al cargar clientes: ');
        }
    };

    const cargarMotocicletasTodos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/motocicletas/listar-todos`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const data = await response.json();
                setMotocicletas(data);
            }
        } catch {
            toast.error('Error al cargar motocicletas: ');
        }
    };

    const cargarOrdenesTodos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/orden/listar-todos`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const data = await response.json();
                setOrdenes(data);
            }
        } catch  {
            toast.error('Error al cargar motocicletas: ');
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
        } catch  {
            toast.error('Error al reactivar usuario: ');
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
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.message || `Error al eliminar usuario (${response.status})`);
                setModalEliminar(null);
            }
        } catch  {
            toast.error('Error al eliminar usuario: ');
            setModalEliminar(null);
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
        } catch  {
            toast.error('Error al reactivar cliente: ');
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
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.message || `Error al eliminar cliente (${response.status})`);
                setModalEliminar(null);
            }
        } catch  {
            toast.error('Error al eliminar cliente: ');
            setModalEliminar(null);
        }
    };

    const reactivarMotocicleta = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/motocicletas/reactivar/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                toast.success("Motocicleta reactivada");
                cargarMotocicletasTodos();
            }
        } catch {
            toast.error('Error al reactivar motocicleta:');
        }
    };

    const eliminarMotocicletaPermanente = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/motocicletas/eliminar/${modalEliminar.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                toast.success("Motocicleta eliminada permanentemente");
                setModalEliminar(null);
                cargarMotocicletasTodos();
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.message || `Error al eliminar motocicleta (${response.status})`);
                setModalEliminar(null);
            }
        } catch {
            toast.error('Error al eliminar motocicleta: ');
            setModalEliminar(null);
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
        } catch  {
            toast.error('Error al reactivar orden:');
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
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.message || `Error al eliminar orden (${response.status})`);
                setModalEliminar(null);
            }
        } catch {
            toast.error('Error al eliminar orden:ss');
            setModalEliminar(null);
        }
    };

    const abrirModalEliminar = (tipo, id, nombre) => {
        // ⭐ 1. Bloquear la eliminación del administrador por defecto (ID 1)
        if (tipo === 'usuario' && id === 1) {
            toast.error('No se puede eliminar el administrador por defecto del sistema (ID 1).');
            return;
        }

        // 2. Si es un usuario, verificar si es el último administrador activo (solo si el ID no es 1)
        if (tipo === 'usuario') {
            const usuario = usuarios.find(u => u.idUsuario === id);

            if (usuario && usuario.rol === 'ADMINISTRADOR') {
                const adminsActivos = usuarios.filter(u => u.rol === 'ADMINISTRADOR' && u.activo).length;
                if (adminsActivos <= 1) {
                    toast.error('No se puede eliminar el último administrador activo del sistema.');
                    return;
                }
            }
        }
        setModalEliminar({ tipo, id, nombre });
    };

    const confirmarEliminacion = () => {
        if (modalEliminar.tipo === 'usuario') {
            eliminarUsuarioPermanente();
        } else if (modalEliminar.tipo === 'cliente') {
            eliminarClientePermanente();
        } else if (modalEliminar.tipo === 'motocicleta') {
            eliminarMotocicletaPermanente();
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
                                {usuarios.map((u) => {
                                    const isDefaultAdmin = u.idUsuario === 1;
                                    const isAdmin = u.rol === 'ADMINISTRADOR';
                                    const activeAdminsCount = usuarios.filter(usr => usr.rol === 'ADMINISTRADOR' && usr.activo).length;
                                    const isLastAdmin = isAdmin && activeAdminsCount <= 1;
                                    const isDisabled = isDefaultAdmin || isLastAdmin;

                                    return (
                                        <tr key={u.idUsuario} className={!u.activo ? "bg-red-50" : ""}>
                                            <td className="px-6 py-4 text-sm text-gray-900">{u.idUsuario}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.nombreUsuario}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{u.nombrePila} {u.apellidoCompleto}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        isAdmin ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
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
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            isDisabled
                                                                ? 'text-gray-400 cursor-not-allowed'
                                                                : 'text-red-600 hover:bg-red-50'
                                                        }`}
                                                        title={isDefaultAdmin
                                                            ? 'No se puede eliminar el administrador por defecto (ID 1)'
                                                            : isLastAdmin
                                                                ? 'No se puede eliminar el último administrador activo'
                                                                : 'Eliminar permanentemente'}
                                                        disabled={isDisabled}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
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
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
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
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                {!m.activo && (
                                                    <button
                                                        onClick={() => reactivarMotocicleta(m.idMotocicleta)}
                                                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                                    >
                                                        Reactivar
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => abrirModalEliminar('motocicleta', m.idMotocicleta, `${m.marca} ${m.modelo} - ${m.placa}`)}
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

                {/* Modal Eliminar */}
                {modalEliminar && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                    <h2 className="text-2xl font-bold text-gray-900">Confirmar Eliminación</h2>
                                </div>
                                <button onClick={() => setModalEliminar(null)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-gray-600 mb-6">
                                ¿Estás seguro que deseas eliminar **permanentemente** el registro: **{modalEliminar.nombre}** (ID: {modalEliminar.id})? Esta acción no se puede deshacer.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setModalEliminar(null)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmarEliminacion}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Eliminar Ahora
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
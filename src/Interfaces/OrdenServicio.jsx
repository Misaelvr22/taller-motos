import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import { Wrench, Edit2, PlusCircle, Trash2 } from "lucide-react";
import { listarClientes } from "../services/ClienteService.jsx";
import { listarMotocicletas } from "../services/MotocicletaService.jsx";
import { crearOrden, listarOrdenes, editarOrden, eliminarOrden } from "../services/OrdenService.jsx";

function OrdenServicio() {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [motocicletas, setMotocicletas] = useState([]);
    const [motocicletaSeleccionada, setMotocicletaSeleccionada] = useState(null);
    const [ordenes, setOrdenes] = useState([]);
    const [editOrden, setEditOrden] = useState(null);
    const [ordenOriginal, setOrdenOriginal] = useState(null);
    const [editForm, setEditForm] = useState({
        idOrden: null,
        descripcionServicio: "",
        refacciones: "",
        fechaEntrega: "",
        costo: 0,
        status: "PENDIENTE"
    });
    
    // Estado para modal de confirmación
    const [modalConfirmar, setModalConfirmar] = useState(null);

    const [orden, setOrden] = useState({
        descripcionTrabajo: "",
        fechaIngreso: "",
        fechaEntrega: "",
        estado: "PENDIENTE",
        costo: "",
        observaciones: "",
        RefaccionesUtilizadas: ""
    });

    // ✅ Fecha mínima: Hoy
    const hoy = new Date().toISOString().split("T")[0];

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const data = await listarClientes();
                setClientes(data);
            } catch (error) {
                console.error("Error al cargar clientes:", error);
                toast.error("Error al cargar clientes");
            }
        };
        fetchClientes();
        cargarOrdenes();
    }, []);

    const cargarOrdenes = async () => {
        try {
            const data = await listarOrdenes();
            console.log("Órdenes recibidas del backend:", data);
            console.log("Primera orden completa:", data[0]);
            setOrdenes(data);
        } catch (error) {
            console.error("Error al cargar órdenes:", error);
            toast.error("Error al cargar órdenes");
        }
    };

    useEffect(() => {
        const fetchMotocicletas = async () => {
            if (clienteSeleccionado) {
                try {
                    const todasLasMotos = await listarMotocicletas();
                    // Filtrar motocicletas por cliente
                    const motosDelCliente = todasLasMotos.filter(
                        m => m.cliente?.idCliente === clienteSeleccionado.idCliente
                    );
                    setMotocicletas(motosDelCliente);
                } catch (error) {
                    console.error("Error al cargar motocicletas:", error);
                    toast.error("Error al cargar motocicletas");
                }
            }
        };
        fetchMotocicletas();
    }, [clienteSeleccionado]);

    const handleOrdenChange = (e) => {
        const { name, value } = e.target;
        setOrden(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!clienteSeleccionado || !motocicletaSeleccionada) {
            toast.error("Selecciona cliente y motocicleta antes de guardar la orden");
            return;
        }

        try {
            const ordenData = {
                descripcionTrabajo: orden.descripcionTrabajo,
                RefaccionesUtilizadas: orden.RefaccionesUtilizadas,
                fechaIngreso: orden.fechaIngreso,
                fechaEntrega: orden.fechaEntrega,
                estado: orden.estado,
                costo: orden.costo,
                idCliente: clienteSeleccionado.idCliente,
                idMotocicleta: motocicletaSeleccionada.idMotocicleta
            };

            await crearOrden(ordenData);
            toast.success("Orden registrada correctamente");
            
            // Limpiar formulario
            setOrden({
                descripcionTrabajo: "",
                fechaIngreso: "",
                fechaEntrega: "",
                estado: "PENDIENTE",
                costo: "",
                observaciones: "",
                RefaccionesUtilizadas: ""
            });
            setClienteSeleccionado(null);
            setMotocicletaSeleccionada(null);
            cargarOrdenes();
            
        } catch (error) {
            console.error("Error al registrar orden:", error);
            toast.error("Error al registrar la orden: " + error.message);
        }
    };

    const abrirEditar = (orden) => {
        setEditOrden(orden.idOrden);
        setOrdenOriginal(orden);
        setEditForm({
            idOrden: orden.idOrden,
            descripcionServicio: orden.descripcionServicio || "",
            refacciones: orden.refacciones || "",
            fechaEntrega: orden.fechaEntrega ? orden.fechaEntrega.split('T')[0] : "",
            costo: orden.costo || 0,
            status: orden.status || "PENDIENTE"
        });
    };

    const guardarEdicion = async () => {
        try {
            // Construir payload con los campos necesarios
            const payload = {
                idOrden: editForm.idOrden,
                descripcionServicio: editForm.descripcionServicio,
                refacciones: editForm.refacciones,
                fechaEntrega: editForm.fechaEntrega,
                costo: editForm.costo,
                status: editForm.status,
                idCliente: ordenOriginal.cliente?.idCliente || ordenOriginal.Cliente?.idCliente,
                idMotocicleta: ordenOriginal.motocicleta?.idMotocicleta || ordenOriginal.Motocicleta?.idMotocicleta
            };
            
            console.log("Payload de edición:", payload);
            await editarOrden(payload);
            toast.success("Orden actualizada correctamente");
            setEditOrden(null);
            setOrdenOriginal(null);
            cargarOrdenes();
        } catch (error) {
            console.error("Error al editar orden:", error);
            toast.error("Error al editar orden: " + error.message);
        }
    };

    const handleEliminar = (id) => {
        setModalConfirmar(id);
    };
    
    const confirmarEliminacion = async () => {
        try {
            await eliminarOrden(modalConfirmar);
            toast.success("Orden eliminada correctamente");
            cargarOrdenes();
        } catch (error) {
            console.error("Error al eliminar orden:", error);
            toast.error("Error al eliminar orden: " + error.message);
        }
        setModalConfirmar(null);
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Wrench className="w-8 h-8" /> Órdenes de Servicio
                    </h2>
                    <p className="text-gray-600">Crea y gestiona órdenes de trabajo para las motocicletas</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <PlusCircle className="w-6 h-6" /> Registrar Nueva Orden
                    </h3>

                    <div className="mb-6">
                        <label className="text-sm font-medium">Seleccionar Cliente</label>
                        <select
                            className="w-full mt-1 p-2 border rounded-lg"
                            value={clienteSeleccionado?.idCliente || ""}
                            onChange={e => {
                                const c = clientes.find(x => x.idCliente == e.target.value);
                                setClienteSeleccionado(c);
                                setMotocicletaSeleccionada(null);
                            }}
                        >
                            <option value="">-- Seleccionar --</option>
                            {clientes.map(c => (
                                <option key={c.idCliente} value={c.idCliente}>
                                    {c.nombreCliente} - {c.numeroCliente}
                                </option>
                            ))}
                        </select>
                    </div>

                    {clienteSeleccionado && (
                        <div className="mb-6">
                            <label className="text-sm font-medium">Motocicleta</label>
                            <select
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={motocicletaSeleccionada?.idMotocicleta || ""}
                                onChange={e => {
                                    const m = motocicletas.find(x => x.idMotocicleta == e.target.value);
                                    setMotocicletaSeleccionada(m);
                                }}
                            >
                                <option value="">-- Seleccionar --</option>
                                {motocicletas.map(m => (
                                    <option key={m.idMotocicleta} value={m.idMotocicleta}>
                                        {m.marca} {m.modelo} - {m.placa}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {motocicletaSeleccionada && (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div>
                                <label className="font-medium">Servicios realizados</label>
                                <textarea
                                    name="descripcionTrabajo"
                                    value={orden.descripcionTrabajo}
                                    onChange={handleOrdenChange}
                                    className="w-full mt-1 p-2 border rounded-lg"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div>
                                <label className="font-medium">Refacciones Utilizadas</label>
                                <textarea
                                    name="RefaccionesUtilizadas"
                                    value={orden.RefaccionesUtilizadas}
                                    onChange={handleOrdenChange}
                                    className="w-full mt-1 p-2 border rounded-lg"
                                    rows="3"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label>Fecha ingreso</label>
                                    <input
                                        type="date"
                                        name="fechaIngreso"
                                        value={orden.fechaIngreso}
                                        onChange={handleOrdenChange}
                                        className="w-full mt-1 p-2 border rounded-lg"
                                        required
                                        min={hoy}
                                    />
                                </div>

                                <div>
                                    <label>Fecha entrega</label>
                                    <input
                                        type="date"
                                        name="fechaEntrega"
                                        value={orden.fechaEntrega}
                                        onChange={handleOrdenChange}
                                        className="w-full mt-1 p-2 border rounded-lg"
                                        min={orden.fechaIngreso}
                                    />
                                </div>
                            </div>

                            <div>
                                <label>Costo Estimado</label>
                                <input
                                    type="number"
                                    name="costo"
                                    value={orden.costo}
                                    onChange={handleOrdenChange}
                                    className="w-full mt-1 p-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="font-medium">Estado de la Orden</label>
                                <select
                                    name="estado"
                                    value={orden.estado}
                                    onChange={handleOrdenChange}
                                    className="w-full mt-1 p-2 border rounded-lg"
                                >
                                    <option value="PENDIENTE">Pendiente</option>
                                    <option value="EN_PROCESO">En Proceso</option>
                                </select>
                            </div>

                            <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
                                <Wrench className="w-5 h-5" /> Guardar Orden
                            </button>
                        </form>
                    )}
                </div>

                {/* Tabla Órdenes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Órdenes Registradas</h3>

                    {ordenes.length === 0 ? (
                        <div className="text-center py-12">
                            <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No hay órdenes registradas</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motocicleta</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Ingreso</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Entrega</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {ordenes.map((orden) => (
                                        <tr key={orden.idOrden} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {orden.Cliente?.nombreCliente || orden.cliente?.nombreCliente || 'Sin asignar'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {(orden.Motocicleta || orden.motocicleta) ? `${(orden.Motocicleta || orden.motocicleta).marca} ${(orden.Motocicleta || orden.motocicleta).modelo} - ${(orden.Motocicleta || orden.motocicleta).placa}` : 'Sin asignar'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                {orden.descripcionServicio || 'Sin descripción'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {orden.fechaEntrada ? new Date(orden.fechaEntrada).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {orden.fechaEntrega ? new Date(orden.fechaEntrega).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                ${orden.costo ? orden.costo.toFixed(2) : '0.00'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    orden.status === 'COMPLETADO' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : orden.status === 'EN_PROCESO'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : orden.status === 'CANCELADO'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {orden.status === 'EN_PROCESO' ? 'EN PROCESO' : orden.status || 'PENDIENTE'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => abrirEditar(orden)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(orden.idOrden)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Eliminar"
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

                {/* Modal Editar */}
                {editOrden && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Orden de Servicio</h2>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Servicio</label>
                                    <textarea
                                        placeholder="Descripción del servicio"
                                        value={editForm.descripcionServicio}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                descripcionServicio: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                        rows="3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Refacciones Utilizadas</label>
                                    <textarea
                                        placeholder="Refacciones utilizadas"
                                        value={editForm.refacciones}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                refacciones: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                        rows="3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Entrega</label>
                                    <input
                                        type="date"
                                        value={editForm.fechaEntrega}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                fechaEntrega: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Costo</label>
                                    <input
                                        type="number"
                                        placeholder="Costo del servicio"
                                        value={editForm.costo}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                costo: parseFloat(e.target.value) || 0,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                    <select
                                        value={editForm.status}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                status: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    >
                                        <option value="PENDIENTE">Pendiente</option>
                                        <option value="EN_PROCESO">En Proceso</option>
                                        <option value="COMPLETADO">Completado</option>
                                        <option value="CANCELADO">Cancelado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setEditOrden(null)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={guardarEdicion}
                                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Modal de Confirmación */}
                {modalConfirmar && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                ¿Desactivar Orden de Servicio?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Esta orden de servicio se desactivará pero no se eliminará permanentemente. Solo los administradores pueden eliminarla de forma permanente.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setModalConfirmar(null)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmarEliminacion}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Desactivar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default OrdenServicio;

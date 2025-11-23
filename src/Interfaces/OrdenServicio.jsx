import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import { Wrench, Edit2, PlusCircle, Trash2, X } from "lucide-react";
import { listarClientes } from "../services/ClienteService.jsx";
import { listarMotocicletas } from "../services/MotocicletaService.jsx";
import { crearOrden, listarOrdenes, editarOrden, eliminarOrden } from "../services/OrdenService.jsx";

function OrdenServicio() {
    // FUNCIÓN CORREGIDA PARA OBTENER LA FECHA LOCAL (YYYY-MM-DD)
    const obtenerFechaLocalISO = () => {
        const d = new Date();
        const year = d.getFullYear();
        // getMonth() es base 0 (Enero=0). Le sumamos 1.
        const month = String(d.getMonth() + 1).padStart(2, '0');
        // getDate() es el día del mes.
        const day = String(d.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const hoy = obtenerFechaLocalISO(); // Usa la fecha local correcta

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
        status: "PENDIENTE",
        fechaEntradaOriginal: hoy // Asegura que tenga una fecha base
    });

    const [modalConfirmar, setModalConfirmar] = useState(null);

    // Inicializar fechaIngreso con el valor de 'hoy' (fecha local correcta)
    const [orden, setOrden] = useState({
        descripcionTrabajo: "",
        fechaIngreso: hoy, // <-- Usando la fecha local corregida
        fechaEntrega: "",
        estado: "PENDIENTE",
        costo: "",
        observaciones: "",
        RefaccionesUtilizadas: ""
    });

    useEffect(() => {
        const inicializar = async () => {
            try {
                const data = await listarClientes();
                setClientes(data);
            } catch  {
                toast.error('Error al cargar clientes');
            }

            try {
                const data = await listarOrdenes();
                setOrdenes(data);
            } catch  {
                toast.error('Error al cargar órdenes');
            }
        };

        inicializar();
    }, []);

    const cargarOrdenes = async () => {
        try {
            const data = await listarOrdenes();
            setOrdenes(data);
        } catch  {
            toast.error('Error al cargar órdenes');
        }
    };

    useEffect(() => {
        const fetchMotocicletas = async () => {
            if (clienteSeleccionado) {
                try {
                    const todasLasMotos = await listarMotocicletas();
                    const motosDelCliente = todasLasMotos.filter(
                        m => m.cliente?.idCliente === clienteSeleccionado.idCliente
                    );
                    setMotocicletas(motosDelCliente);
                } catch {
                    toast.error('Error al cargar motocicletas');
                }
            } else {
                setMotocicletas([]);
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

        // 1. Validaciones de Selección
        if (!clienteSeleccionado || !motocicletaSeleccionada) {
            toast.error("Selecciona cliente y motocicleta antes de guardar la orden");
            return;
        }

        // 2. Validaciones de Campos de Orden
        if (!orden.descripcionTrabajo.trim()) {
            toast.error("Describe el trabajo a realizar");
            return;
        }

        // ⭐ MODIFICACIÓN 1: Refacciones utilizadas es obligatorio
        if (!orden.RefaccionesUtilizadas.trim()) {
            toast.error("Ingresa las refacciones utilizadas o 'Ninguna' si no aplica");
            return;
        }

        if (!orden.fechaIngreso) {
            toast.error("Selecciona la fecha de ingreso");
            return;
        }

        // La fecha de entrega es obligatoria al crear
        if (!orden.fechaEntrega) {
            toast.error("Selecciona la fecha de entrega estimada");
            return;
        }

        // 3. Validaciones de Rango
        if (orden.fechaIngreso < hoy) {
            toast.error("La fecha de ingreso no puede ser anterior a hoy");
            return;
        }
        if (orden.fechaEntrega < orden.fechaIngreso) {
            toast.error("La fecha de entrega no puede ser anterior a la fecha de ingreso");
            return;
        }
        if (orden.costo === "" || isNaN(parseFloat(orden.costo)) || parseFloat(orden.costo) < 0) {
            toast.error("Ingresa un costo válido (mayor o igual a 0)");
            return;
        }

        try {
            const ordenData = {
                descripcionTrabajo: orden.descripcionTrabajo.trim(),
                RefaccionesUtilizadas: orden.RefaccionesUtilizadas.trim(), // Ya validamos que no esté vacío
                fechaIngreso: orden.fechaIngreso,
                fechaEntrega: orden.fechaEntrega,
                estado: orden.estado,
                costo: parseFloat(orden.costo) || 0,
                idCliente: clienteSeleccionado.idCliente,
                idMotocicleta: motocicletaSeleccionada.idMotocicleta
            };

            await crearOrden(ordenData);
            toast.success("Orden registrada correctamente");

            // Al resetear, volver a establecer 'hoy' como fechaIngreso
            setOrden({
                descripcionTrabajo: "",
                fechaIngreso: hoy, // <-- Resetear al día actual (fecha local corregida)
                fechaEntrega: "",
                estado: "PENDIENTE",
                costo: "",
                observaciones: "",
                RefaccionesUtilizadas: ""
            });
            setClienteSeleccionado(null);
            setMotocicletaSeleccionada(null);
            await cargarOrdenes();
        } catch {
            toast.error('Error al registrar la orden');
        }
    };

    const cerrarEditar = () => {
        setEditOrden(null);
        setOrdenOriginal(null);
    }

    const abrirEditar = (ordenItem) => {
        setEditOrden(ordenItem.idOrden);
        setOrdenOriginal(ordenItem);

        // Obtener la fecha de ingreso/entrada en formato YYYY-MM-DD local
        const getFechaInputFormat = (dateString) => {
            if (!dateString) return hoy;
            try {
                // Si ya es un string YYYY-MM-DD, lo usa
                if (typeof dateString === 'string' && dateString.length === 10) {
                    return dateString;
                }
                // Si es un objeto Date o string ISO, lo procesa
                const d = new Date(dateString);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            } catch {
                return hoy;
            }
        };

        // Usa la fecha de ingreso si existe, sino la fecha de hoy
        const fechaEntradaBase = getFechaInputFormat(ordenItem.fechaEntrada || ordenItem.fechaIngreso);

        setEditForm({
            idOrden: ordenItem.idOrden,
            descripcionServicio: ordenItem.descripcionServicio || "",
            refacciones: ordenItem.refacciones || "",
            fechaEntrega: ordenItem.fechaEntrega ? getFechaInputFormat(ordenItem.fechaEntrega) : "",
            costo: ordenItem.costo || 0,
            status: ordenItem.status || "PENDIENTE",
            fechaEntradaOriginal: fechaEntradaBase // Se usa para la validación de fecha de entrega en edición
        });
    };

    const guardarEdicion = async () => {
        // Obtenemos la fecha de ingreso base para la validación del mínimo de fechaEntrega
        const fechaEntradaBase = editForm.fechaEntradaOriginal || hoy;

        // 1. Validaciones de Campos de Edición
        if (!editForm.descripcionServicio.trim()) {
            toast.error("La descripción del servicio no puede estar vacía");
            return;
        }

        // ⭐ MODIFICACIÓN 2: Refacciones utilizadas es obligatorio en edición
        if (!editForm.refacciones.trim()) {
            toast.error("Ingresa las refacciones utilizadas o 'Ninguna' si no aplica");
            return;
        }

        // La fecha de entrega NO debe ser vacía.
        if (!editForm.fechaEntrega) {
            toast.error("Selecciona la fecha de entrega");
            return;
        }

        // 2. Validaciones de Rango y Costo
        if (editForm.fechaEntrega < fechaEntradaBase) {
            toast.error("La fecha de entrega no puede ser anterior a la fecha de ingreso");
            return;
        }
        if (editForm.costo === "" || isNaN(parseFloat(editForm.costo)) || parseFloat(editForm.costo) < 0) {
            toast.error("Ingresa un costo válido (mayor o igual a 0)");
            return;
        }

        try {
            const payload = {
                idOrden: editForm.idOrden,
                descripcionServicio: editForm.descripcionServicio.trim(),
                refacciones: editForm.refacciones.trim(), // Ya validamos que no esté vacío
                fechaEntrega: editForm.fechaEntrega,
                costo: parseFloat(editForm.costo) || 0,
                status: editForm.status,
                // Usamos los IDs del ordenOriginal
                idCliente: ordenOriginal.cliente?.idCliente,
                idMotocicleta: ordenOriginal.motocicleta?.idMotocicleta
            };

            await editarOrden(payload);
            toast.success("Orden actualizada correctamente");
            cerrarEditar();
            await cargarOrdenes();
        } catch {
            toast.error('Error al editar orden');
        }
    };

    const handleEliminar = (id) => {
        setModalConfirmar(id);
    };

    const confirmarEliminacion = async () => {
        try {
            await eliminarOrden(modalConfirmar);
            toast.success("Orden eliminada correctamente");
            await cargarOrdenes();
        } catch {
            toast.error('Error al eliminar orden');
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
                        <label className="text-sm font-medium">Seleccionar Cliente <span className="text-red-500">*</span></label>
                        <select
                            className="w-full mt-1 p-2 border rounded-lg"
                            value={clienteSeleccionado?.idCliente || ""}
                            onChange={e => {
                                const clienteId = parseInt(e.target.value);
                                const c = clientes.find(x => x.idCliente === clienteId);
                                setClienteSeleccionado(c || null);
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
                            <label className="text-sm font-medium">Motocicleta <span className="text-red-500">*</span></label>
                            <select
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={motocicletaSeleccionada?.idMotocicleta || ""}
                                onChange={e => {
                                    const motoId = parseInt(e.target.value);
                                    const m = motocicletas.find(x => x.idMotocicleta === motoId);
                                    setMotocicletaSeleccionada(m || null);
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
                        <div
                            onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                            className="space-y-6"
                        >
                            <div>
                                <label className="font-medium">Servicios realizados <span className="text-red-500">*</span></label>
                                <textarea
                                    name="descripcionTrabajo"
                                    value={orden.descripcionTrabajo}
                                    onChange={handleOrdenChange}
                                    className="w-full mt-1 p-2 border rounded-lg"
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="font-medium">Refacciones Utilizadas <span className="text-red-500">*</span></label>
                                <textarea
                                    name="RefaccionesUtilizadas"
                                    value={orden.RefaccionesUtilizadas}
                                    onChange={handleOrdenChange}
                                    className="w-full mt-1 p-2 border rounded-lg"
                                    rows="3"
                                    placeholder="Ej: Filtro de aceite, Bujía NGK. Escribe 'Ninguna' si no se usaron."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label>Fecha ingreso <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        name="fechaIngreso"
                                        value={orden.fechaIngreso}
                                        onChange={handleOrdenChange}
                                        className="w-full mt-1 p-2 border rounded-lg"
                                        min={hoy} // Mínimo: Día actual (evita el pasado)
                                        max={hoy} // Máximo: Día actual (evita el futuro)
                                        disabled
                                    />
                                </div>

                                <div>
                                    <label>Fecha entrega <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        name="fechaEntrega"
                                        value={orden.fechaEntrega}
                                        onChange={handleOrdenChange}
                                        className="w-full mt-1 p-2 border rounded-lg"
                                        min={orden.fechaIngreso || hoy}
                                    />
                                </div>
                            </div>

                            <div>
                                <label>Costo Estimado <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    name="costo"
                                    value={orden.costo}
                                    onChange={handleOrdenChange}
                                    className="w-full mt-1 p-2 border rounded-lg"
                                    min="0"
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

                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                            >
                                <Wrench className="w-5 h-5" /> Guardar Orden
                            </button>
                        </div>
                    )}
                </div>

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
                                {ordenes.map((ordenItem) => {
                                    const clienteNombre = ordenItem.cliente?.nombreCliente || ordenItem.cliente?.nombreCliente || "Sin asignar";
                                    const motoInfo = ordenItem.motocicleta || ordenItem.motocicleta;
                                    const motoTexto = motoInfo ? `${motoInfo.marca} ${motoInfo.modelo} - ${motoInfo.placa}` : "Sin asignar";

                                    // Función utilitaria para mostrar fechas en la tabla (usando fecha local)
                                    const formatDateForDisplay = (dateString) => {
                                        if (!dateString) return "N/A";
                                        try {
                                            return new Date(dateString).toLocaleDateString();
                                        } catch {
                                            return "N/A";
                                        }
                                    };

                                    return (
                                        <tr key={ordenItem.idOrden} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {clienteNombre}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {motoTexto}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                {ordenItem.descripcionServicio || ordenItem.descripcionTrabajo || "Sin descripción"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDateForDisplay(ordenItem.fechaEntrada || ordenItem.fechaIngreso)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDateForDisplay(ordenItem.fechaEntrega)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                ${ordenItem.costo ? Number(ordenItem.costo).toFixed(2) : "0.00"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    ordenItem.status === "COMPLETADO"
                                                        ? "bg-green-100 text-green-800"
                                                        : ordenItem.status === "EN_PROCESO"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : ordenItem.status === "CANCELADO"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                }`}>
                                                    {ordenItem.status === "EN_PROCESO" ? "EN PROCESO" : ordenItem.status || "PENDIENTE"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => abrirEditar(ordenItem)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(ordenItem.idOrden)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {editOrden && ordenOriginal && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Editar Orden de Servicio</h2>
                                <button onClick={cerrarEditar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Servicio <span className="text-red-500">*</span></label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Refacciones Utilizadas <span className="text-red-500">*</span></label>
                                    <textarea
                                        placeholder="Lista de refacciones utilizadas"
                                        value={editForm.refacciones}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                refacciones: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                        rows="2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Entrega <span className="text-red-500">*</span></label>
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
                                        min={editForm.fechaEntradaOriginal || hoy}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Costo Total <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={editForm.costo}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                costo: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                        min="0"
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
                                    onClick={cerrarEditar}
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

                {modalConfirmar && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">¿Desactivar Orden de Servicio?</h3>
                            <p className="text-gray-600 mb-6">
                                Esta orden de servicio se desactivará pero no se eliminará permanentemente. Solo los administradores pueden eliminarla de forma permanente.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setModalConfirmar(null)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmarEliminacion}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
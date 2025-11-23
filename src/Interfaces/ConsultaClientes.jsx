import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import { Users, Search, Edit2, Trash2, Plus, X } from "lucide-react";
import { listarClientes, eliminarCliente, editarCliente } from "../services/ClienteService.jsx";
import { listarMotocicletas, crearMotocicleta, editarMotocicleta, eliminarMotocicleta } from "../services/MotocicletaService.jsx";
import { listarOrdenes } from "../services/OrdenService.jsx";

// Constantes
const MARCAS_MOTOS = [
    "Honda", "Yamaha", "Suzuki", "Kawasaki",
    "Bajaj", "KTM", "Italika", "Otra"
];

const FILTROS = {
    TODOS: "todos",
    CON_ORDEN: "con-orden",
    SIN_ORDEN: "sin-orden"
};

// Constantes para el rango de año (Año actual dinámico)
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1900;

// --- Componentes Auxiliares ---

// InputField (Muestra errores de validación)
const InputField = ({ label, required, error, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            {...props}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
            }`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const Button = ({ variant = "primary", children, ...props }) => {
    const variants = {
        primary: "bg-gray-900 text-white hover:bg-gray-800",
        secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
        danger: "bg-red-600 text-white hover:bg-red-700",
        success: "bg-blue-600 text-white hover:bg-blue-700"
    };

    return (
        <button
            {...props}
            className={`px-6 py-2 rounded-lg transition-colors ${variants[variant]} ${props.className || ''}`}
        >
            {children}
        </button>
    );
};

// MotocicletaCard (Maneja errores y rango de año dinámico)
const MotocicletaCard = ({ moto, index, onChange, onDelete, errors = {} }) => (
    <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900">Motocicleta #{index + 1}</h4>
            <button
                onClick={onDelete}
                className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
            >
                <Trash2 className="w-4 h-4" />
                Eliminar
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                    Marca <span className="text-red-500">*</span>
                </label>
                <select
                    value={moto.marca}
                    onChange={(e) => onChange('marca', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 text-sm ${
                        errors.marca ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                >
                    <option value="">Seleccionar</option>
                    {MARCAS_MOTOS.map(marca => (
                        <option key={marca} value={marca}>{marca}</option>
                    ))}
                </select>
                {errors.marca && <p className="text-red-500 text-xs mt-1">{errors.marca}</p>}
            </div>
            <InputField
                label="Modelo"
                required
                type="text"
                value={moto.modelo}
                onChange={(e) => onChange('modelo', e.target.value)}
                placeholder="Ej: CBR 600"
                className="text-sm"
                error={errors.modelo}
            />
            <InputField
                label="Año"
                required
                type="number"
                value={moto.year}
                onChange={(e) => onChange('year', e.target.value)}
                placeholder={CURRENT_YEAR.toString()}
                min={MIN_YEAR}
                max={CURRENT_YEAR}
                className="text-sm"
                error={errors.year}
            />
            <InputField
                label="Placa"
                required
                type="text"
                value={moto.placa}
                onChange={(e) => onChange('placa', e.target.value.toUpperCase())}
                placeholder="ABC123"
                className="text-sm"
                error={errors.placa}
            />
        </div>
    </div>
);

// Componente: Modal de confirmación (sin cambios)
const ModalConfirmacion = ({ tipo, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
                {tipo === 'cliente' ? '¿Desactivar Cliente?' : '¿Desactivar Motocicleta?'}
            </h3>
            <p className="text-gray-600 mb-6">
                {tipo === 'cliente'
                    ? 'Este cliente se desactivará pero no se eliminará permanentemente. Solo los administradores pueden eliminarlo de forma permanente.'
                    : 'Esta motocicleta se desactivará pero no se eliminará permanentemente. Solo los administradores pueden eliminarla de forma permanente.'}
            </p>
            <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button variant="danger" onClick={onConfirm}>Desactivar</Button>
            </div>
        </div>
    </div>
);

// --- Hook para validaciones (Añadido: 10 dígitos para Teléfono) ---
const useValidaciones = () => {
    const validarCliente = useCallback((form) => {
        const errors = {};

        if (!form.nombreCliente?.trim()) {
            errors.nombreCliente = "El nombre no puede estar vacío";
        }

        // **VALIDACIÓN DE TELÉFONO ACTUALIZADA**
        const telefonoLimpio = form.numeroCliente?.trim();

        if (!telefonoLimpio) {
            errors.numeroCliente = "El teléfono no puede estar vacío";
        } else if (!/^\d+$/.test(telefonoLimpio)) {
            errors.numeroCliente = "El teléfono debe contener solo números";
        } else if (telefonoLimpio.length !== 10) {
            errors.numeroCliente = "El número debe tener exactamente 10 dígitos";
        }

        if (Object.keys(errors).length > 0) {
            throw { type: 'cliente', errors };
        }
    }, []);

    const validarMotocicletas = useCallback((motos) => {
        const motoErrors = [];
        const placasVistas = new Set();

        for (const [index, moto] of motos.entries()) {
            const errors = {};

            if (!moto.marca?.trim()) errors.marca = "Marca requerida";
            if (!moto.modelo?.trim()) errors.modelo = "Modelo requerido";
            if (!moto.placa?.trim()) errors.placa = "Placa requerida";

            const yearValue = parseInt(moto.year);

            if (!moto.year?.toString().trim() || isNaN(yearValue)) {
                errors.year = "Año requerido";
            } else if (yearValue < MIN_YEAR || yearValue > CURRENT_YEAR) {
                errors.year = `Debe ser entre ${MIN_YEAR} y ${CURRENT_YEAR}`;
            }

            // Validar placas duplicadas dentro del mismo formulario
            if (moto.placa?.trim()) {
                const placaLimpia = moto.placa.toLowerCase().trim();
                if (placasVistas.has(placaLimpia)) {
                    errors.placa = "Placa duplicada en este formulario";
                }
                placasVistas.add(placaLimpia);
            }

            if (Object.keys(errors).length > 0) {
                motoErrors[index] = errors;
            }
        }

        const hasErrors = motoErrors.some(err => err && Object.keys(err).length > 0);
        if (hasErrors) {
            throw { type: 'motos', errors: motoErrors };
        }
    }, []);

    const validarDuplicados = useCallback(async (form, motos, clientes, motocicletas) => {
        // Validar nombre duplicado (excluyendo el cliente actual)
        const nombreDup = clientes.find(
            c => c.idCliente !== form.idCliente &&
                c.nombreCliente?.toLowerCase().trim() === form.nombreCliente.toLowerCase().trim()
        );
        if (nombreDup) throw new Error("El nombre del cliente ya está registrado");

        // Validar teléfono duplicado (excluyendo el cliente actual)
        const telDup = clientes.find(
            c => c.idCliente !== form.idCliente &&
                c.numeroCliente?.trim() === form.numeroCliente.trim()
        );
        if (telDup) throw new Error("El número de teléfono ya está registrado");

        // Validar placas duplicadas (excluyendo la moto que se está editando)
        for (const moto of motos.filter(m => m.placa?.trim())) {
            const placaDup = motocicletas.find(
                m => m.idMotocicleta !== moto.idMotocicleta &&
                    m.placa?.toLowerCase().trim() === moto.placa?.toLowerCase().trim()
            );
            if (placaDup) throw new Error(`La placa "${moto.placa?.toUpperCase()}" ya está registrada en otro cliente.`);
        }
    }, []);

    return { validarCliente, validarMotocicletas, validarDuplicados };
};

function ConsultaClientes() {
    // Estados principales
    const [clientes, setClientes] = useState([]);
    const [ordenes, setOrdenes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroTipo, setFiltroTipo] = useState(FILTROS.TODOS);

    const [todasMotocicletas, setTodasMotocicletas] = useState([]);

    // Estados del modal de edición
    const [modalEditar, setModalEditar] = useState(null);
    const [editForm, setEditForm] = useState({
        idCliente: null,
        nombreCliente: "",
        numeroCliente: ""
    });
    const [motosEditar, setMotosEditar] = useState([]);

    // Estados para errores de validación
    const [validationErrors, setValidationErrors] = useState({});
    const [motoValidationErrors, setMotoValidationErrors] = useState([]);

    // Estado del modal de confirmación
    const [modalConfirmar, setModalConfirmar] = useState(null);

    const { validarCliente, validarMotocicletas, validarDuplicados } = useValidaciones();

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientesData, ordenesData, motosData] = await Promise.all([
                    listarClientes(),
                    listarOrdenes(),
                    listarMotocicletas()
                ]);
                setClientes(clientesData);
                setOrdenes(ordenesData);
                setTodasMotocicletas(motosData);
            } catch (error) {
                toast.error(`Error al cargar los datos: ${error.message || 'Error desconocido'}`);
            }
        };
        fetchData();
    }, []);

    // Mapa de Motocicletas agrupadas por Cliente
    const motosPorCliente = useMemo(() => {
        return todasMotocicletas.reduce((acc, moto) => {
            const idCliente = moto.cliente?.idCliente;
            if (idCliente) {
                if (!acc[idCliente]) {
                    acc[idCliente] = [];
                }
                acc[idCliente].push(moto);
            }
            return acc;
        }, {});
    }, [todasMotocicletas]);

    // Filtrado optimizado con useMemo
    const clientesFiltrados = useMemo(() => {
        return clientes.filter(cliente => {
            const matchSearch =
                cliente.nombreCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cliente.numeroCliente?.includes(searchTerm);

            if (filtroTipo === FILTROS.TODOS) return matchSearch;

            const tieneOrden = ordenes.some(o => o.cliente?.idCliente === cliente.idCliente);

            return matchSearch && (
                filtroTipo === FILTROS.CON_ORDEN ? tieneOrden : !tieneOrden
            );
        });
    }, [clientes, searchTerm, filtroTipo, ordenes]);

    // Handlers
    const handleEliminar = useCallback((idCliente) => {
        setModalConfirmar({ tipo: 'cliente', id: idCliente });
    }, []);

    const confirmarEliminacion = useCallback(async () => {
        const { tipo, id, index } = modalConfirmar;

        try {
            if (tipo === 'cliente') {
                await eliminarCliente(id);
                // Actualizar listas después de la eliminación
                const [clientesData, motosData] = await Promise.all([
                    listarClientes(),
                    listarMotocicletas()
                ]);
                setClientes(clientesData);
                setTodasMotocicletas(motosData);
                toast.success("Cliente eliminado correctamente");
            } else { // Eliminar motocicleta
                await eliminarMotocicleta(id);
                setMotosEditar(prev => prev.filter((_, i) => i !== index));
                const motosData = await listarMotocicletas();
                setTodasMotocicletas(motosData);
                toast.success("Motocicleta eliminada correctamente");
            }
        } catch (error) {
            toast.error(`Error al eliminar ${tipo === 'cliente' ? 'el cliente' : 'la motocicleta'}: ${error.message || 'Error desconocido'}`);
        }
        setModalConfirmar(null);
    }, [modalConfirmar]);

    const abrirEditar = useCallback(async (cliente) => {
        setEditForm({
            idCliente: cliente.idCliente,
            nombreCliente: cliente.nombreCliente,
            numeroCliente: cliente.numeroCliente
        });
        setValidationErrors({});
        setMotoValidationErrors([]);

        try {
            const todasMotos = todasMotocicletas.length > 0 ? todasMotocicletas : await listarMotocicletas();
            const motosDelCliente = Array.isArray(todasMotos)
                ? todasMotos.filter(m => m.cliente?.idCliente === cliente.idCliente)
                : [];
            setMotosEditar(motosDelCliente);
        } catch (error) {
            toast.error(`No se pudieron cargar las motocicletas: ${error.message || 'Error desconocido'}`);
            setMotosEditar([]);
        }

        setModalEditar(cliente.idCliente);
    }, [todasMotocicletas]);

    const guardarEdicion = useCallback(async () => {
        setValidationErrors({});
        setMotoValidationErrors([]);

        try {
            // 1. Validaciones de Formulario
            validarCliente(editForm);
            validarMotocicletas(motosEditar);

            // 2. Validaciones de Duplicados (Base de Datos)
            const [clientesExistentes, motocicletasExistentes] = await Promise.all([
                listarClientes(),
                listarMotocicletas()
            ]);

            await validarDuplicados(editForm, motosEditar, clientesExistentes, motocicletasExistentes);

            // 3. ACTUALIZACIÓN
            const clienteLimpio = {
                ...editForm,
                nombreCliente: editForm.nombreCliente.trim(),
                numeroCliente: editForm.numeroCliente.trim()
            };
            await editarCliente(clienteLimpio);

            await Promise.all(motosEditar.map(async (moto) => {
                const motoLimpia = {
                    ...moto,
                    marca: moto.marca?.trim(),
                    modelo: moto.modelo?.trim(),
                    year: moto.year ? parseInt(moto.year) : moto.year,
                    placa: moto.placa?.trim().toUpperCase(),
                    idCliente: editForm.idCliente
                };

                if (moto.idMotocicleta) {
                    await editarMotocicleta(motoLimpia);
                } else if (motoLimpia.marca && motoLimpia.modelo && motoLimpia.placa) {
                    await crearMotocicleta(motoLimpia, editForm.idCliente);
                }
            }));

            toast.success("Cliente y motocicletas actualizados correctamente");
            cerrarModal();

            // Recargar datos principales
            const [clientesData, motosData] = await Promise.all([
                listarClientes(),
                listarMotocicletas()
            ]);
            setClientes(clientesData);
            setTodasMotocicletas(motosData);

        } catch (error) {
            // Manejo de errores granular
            if (error.type === 'cliente') {
                setValidationErrors(error.errors);
                toast.error("Por favor, corrige los errores en la información del cliente.");
            } else if (error.type === 'motos') {
                setMotoValidationErrors(error.errors);
                toast.error("Por favor, corrige los errores en las motocicletas.");
            } else {
                toast.error(`Error al editar: ${error.message || 'Error desconocido'}`);
            }
        }
    }, [editForm, motosEditar, validarCliente, validarMotocicletas, validarDuplicados]);

    const handleMotoChange = useCallback((index, field, value) => {
        setMotosEditar(prev => {
            const nuevas = [...prev];
            const newValue = (field === 'year' && value === '') ? '' : value;
            nuevas[index] = { ...nuevas[index], [field]: newValue };
            return nuevas;
        });
        setMotoValidationErrors(prev => {
            const newErrors = [...prev];
            if (newErrors[index]) {
                newErrors[index] = { ...newErrors[index], [field]: undefined };
            }
            return newErrors;
        });
    }, []);

    const agregarNuevaMoto = useCallback(() => {
        setMotosEditar(prev => [...prev, {
            idMotocicleta: null,
            marca: "",
            modelo: "",
            year: "",
            placa: "",
            activo: true,
            idCliente: editForm.idCliente
        }]);
    }, [editForm.idCliente]);

    const eliminarMotoEditar = useCallback((index, idMotocicleta) => {
        if (idMotocicleta) {
            setModalConfirmar({ tipo: 'moto', id: idMotocicleta, index });
        } else {
            setMotosEditar(prev => prev.filter((_, i) => i !== index));
        }
    }, []);

    const cerrarModal = useCallback(() => {
        setModalEditar(null);
        setMotosEditar([]);
        setValidationErrors({});
        setMotoValidationErrors([]);
    }, []);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Consulta de Clientes</h2>
                    <p className="text-gray-600">Visualiza y gestiona la información de tus clientes</p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Lista de Clientes</h3>

                    {/* Filtros */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o teléfono..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent min-w-[200px]"
                        >
                            <option value={FILTROS.TODOS}>Todos los clientes</option>
                            <option value={FILTROS.CON_ORDEN}>Con órdenes de servicio</option>
                            <option value={FILTROS.SIN_ORDEN}>Sin órdenes de servicio</option>
                        </select>
                    </div>

                    {/* Tabla */}
                    {clientes.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">
                                No hay clientes registrados. Utiliza la pestaña "Nuevo Cliente" para registrar el primer cliente.
                            </p>
                        </div>
                    ) : clientesFiltrados.length === 0 ? (
                        <div className="text-center py-12">
                            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No se encontraron resultados para "{searchTerm}"</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motocicletas (Marca, Modelo, Placa)</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {clientesFiltrados.map((cliente) => {
                                        const motosDelCliente = motosPorCliente[cliente.idCliente] || [];
                                        const motosTexto = motosDelCliente.length > 0
                                            ? motosDelCliente.map(m => `${m.marca} ${m.modelo} (${m.placa})`).join(', ')
                                            : 'Sin motos registradas';

                                        return (
                                            <tr key={cliente.idCliente} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{cliente.nombreCliente}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{cliente.numeroCliente}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 max-w-sm truncate" title={motosTexto}>
                                                    {motosTexto}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => abrirEditar(cliente)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEliminar(cliente.idCliente)}
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
                            <div className="mt-4 text-sm text-gray-600">
                                Mostrando {clientesFiltrados.length} de {clientes.length} clientes
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal Editar */}
            {modalEditar && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Editar Cliente</h2>
                            <button onClick={cerrarModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Info Cliente */}
                        <div className="mb-6 border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="Nombre Completo"
                                    required
                                    type="text"
                                    value={editForm.nombreCliente}
                                    onChange={(e) => setEditForm({ ...editForm, nombreCliente: e.target.value })}
                                    placeholder="Ej: Juan Pérez"
                                    error={validationErrors.nombreCliente}
                                />
                                <InputField
                                    label="Número de Teléfono"
                                    required
                                    type="tel"
                                    value={editForm.numeroCliente}
                                    onChange={(e) => setEditForm({ ...editForm, numeroCliente: e.target.value })}
                                    placeholder="Ej: 3001234567"
                                    error={validationErrors.numeroCliente}
                                />
                            </div>
                        </div>

                        {/* Motocicletas */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Motocicletas Registradas</h3>
                                <Button variant="success" onClick={agregarNuevaMoto} className="flex items-center gap-2 text-sm">
                                    <Plus className="w-4 h-4" />
                                    Agregar Moto
                                </Button>
                            </div>

                            {motosEditar.length === 0 ? (
                                <p className="text-gray-500 text-sm">No hay motocicletas registradas</p>
                            ) : (
                                <div className="space-y-4">
                                    {motosEditar.map((moto, index) => (
                                        <MotocicletaCard
                                            key={moto.idMotocicleta || `new-${index}`}
                                            moto={moto}
                                            index={index}
                                            onChange={(field, value) => handleMotoChange(index, field, value)}
                                            onDelete={() => eliminarMotoEditar(index, moto.idMotocicleta)}
                                            errors={motoValidationErrors[index]}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={cerrarModal}>Cancelar</Button>
                            <Button variant="primary" onClick={guardarEdicion}>Guardar Cambios</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Confirmación */}
            {modalConfirmar && (
                <ModalConfirmacion
                    tipo={modalConfirmar.tipo}
                    onConfirm={confirmarEliminacion}
                    onCancel={() => setModalConfirmar(null)}
                />
            )}
        </Layout>
    );
}

export default ConsultaClientes;
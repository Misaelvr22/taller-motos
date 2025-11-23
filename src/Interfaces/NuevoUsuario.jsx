import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
// Importar iconos Eye y EyeOff
import { Users, Edit2, Trash2, PlusCircle, AlertTriangle, Shield, Eye, EyeOff, X } from "lucide-react";
import { crearUsuario, listarUsuarios, editarUsuario, eliminarUsuario } from "../services/UsuarioService.jsx";
import {API_BASE_URL} from "../config/api.js";

const NuevoUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);

    const [form, setForm] = useState({
        username: "",
        nombre: "",
        apellido: "",
        password: "",
        rol: "TRABAJADOR"
    });

    //  visibilidad de la contraseña en el formulario
    const [showPassword, setShowPassword] = useState(false);

    const [editUser, setEditUser] = useState(null);
    const [editForm, setEditForm] = useState({
        idUsuario: null,
        nombreUsuario: "",
        nombrePila: "",
        apellidoCompleto: "",
        password: "",
        rol: "TRABAJADOR",
        activo: true
    });

    // visibilidad de la contraseña en edición
    const [showEditPassword, setShowEditPassword] = useState(false);

    const [modalEliminar, setModalEliminar] = useState(null);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const data = await listarUsuarios();
            setUsuarios(data);
        } catch {
            toast.error('Error al cargar usuarios');
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const agregarUsuario = async (e) => {
        e.preventDefault();
        // Validación de campos vacíos (se añadió trim() a la contraseña también)
        if (!form.username.trim() || !form.nombre.trim() || !form.apellido.trim() || !form.password.trim()) {
            toast.error("Por favor completa todos los campos");
            return;
        }

        try {
            await crearUsuario(form);
            toast.success("Usuario creado correctamente");
            setForm({ username: "", nombre: "", apellido: "", password: "", rol: "TRABAJADOR" });
            cargarUsuarios();
        } catch (error){
            toast.error(error.message || 'Error al crear usuario');
        }
    };

    const abrirEditar = (usuario) => {
        setEditUser(usuario.idUsuario);
        setEditForm({
            idUsuario: usuario.idUsuario,
            nombreUsuario: usuario.nombreUsuario,
            nombrePila: usuario.nombrePila,
            apellidoCompleto: usuario.apellidoCompleto,
            // ⭐ Carga la contraseña existente para que el administrador la vea.
            password: usuario.password,
            rol: usuario.rol,
            activo: usuario.activo
        });
        // Reiniciar visibilidad al abrir modal
        setShowEditPassword(false);
    };

    const cerrarEditar = () => {
        setEditUser(null);
        setEditForm({
            idUsuario: null,
            nombreUsuario: "",
            nombrePila: "",
            apellidoCompleto: "",
            password: "",
            rol: "TRABAJADOR",
            activo: true
        });
    }

    const guardarEdicion = async () => {
        // Validación básica de edición
        if (!editForm.nombreUsuario.trim() || !editForm.nombrePila.trim() || !editForm.apellidoCompleto.trim()) {
            toast.error("Por favor completa al menos los campos de nombre y apellido");
            return;
        }

        let passwordParaGuardar = editForm.password.trim();

        // ⭐ Lógica para mantener la contraseña si el usuario la deja en blanco.
        if (!passwordParaGuardar) {
            // Buscamos el usuario original en el estado 'usuarios'
            const usuarioOriginal = usuarios.find(u => u.idUsuario === editForm.idUsuario);

            if (usuarioOriginal) {
                // Si el campo está vacío, usamos la contraseña existente.
                passwordParaGuardar = usuarioOriginal.password;
            } else {
                toast.error("Error: No se encontró el usuario original para mantener la contraseña.");
                return;
            }
        }
        // Fin de la lógica de preservación de contraseña

        // Construimos el objeto final para enviar, incluyendo la contraseña asegurada.
        const datosAEnviar = {
            idUsuario: editForm.idUsuario,
            nombreUsuario: editForm.nombreUsuario,
            nombrePila: editForm.nombrePila,
            apellidoCompleto: editForm.apellidoCompleto,
            password: passwordParaGuardar,
            rol: editForm.rol,
            activo: editForm.activo
        };

        try {
            await editarUsuario(datosAEnviar);
            toast.success("Usuario actualizado correctamente");
            cerrarEditar();
            cargarUsuarios();
        } catch (error) {
            toast.error(error.message || 'Error al editar usuario');
        }
    };

    const abrirModalEliminar = (id) => {
        setModalEliminar(id);
    };

    const handleEliminarLogico = async () => {
        // ⭐ No permitir desactivar al administrador por defecto
        if (modalEliminar === 1) {
            toast.error("No se puede desactivar al administrador por defecto.");
            setModalEliminar(null);
            return;
        }

        try {
            await eliminarUsuario(modalEliminar);
            toast.success("Usuario desactivado correctamente");
            setModalEliminar(null);
            cargarUsuarios();
        } catch {
            toast.error('Error al desactivar usuario');
        }
    };

    const handleEliminarFisico = async () => {
        // ⭐ No permitir eliminar físicamente al administrador por defecto
        if (modalEliminar === 1) {
            toast.error("No se puede eliminar permanentemente al administrador por defecto.");
            setModalEliminar(null);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/eliminar/${modalEliminar}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Error desconocido del servidor" }));
                throw new Error(errorData.message || "Error al eliminar usuario");
            }

            toast.success("⚠️ Usuario eliminado permanentemente");
            setModalEliminar(null);
            cargarUsuarios();
        } catch (error) {
            toast.error(`Error al eliminar usuario: ${error.message || 'Error de conexión'}`);
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Title Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Users className="w-8 h-8" /> Gestión de Usuarios
                    </h2>
                    <p className="text-gray-600">Administra los usuarios del sistema y sus permisos</p>
                </div>

                {/* Formulario */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <PlusCircle className="w-6 h-6" /> Registrar Nuevo Usuario
                    </h3>

                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre de Usuario <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Ej: jperez"
                                    value={form.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre(s) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Ej: Juan"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Apellidos <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="apellido"
                                    placeholder="Ej: Pérez González"
                                    value={form.apellido}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                                />
                            </div>

                            {/* CAMPO CONTRASEÑA CON TOGGLE (CREACIÓN) */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                                    title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rol <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="rol"
                                    value={form.rol}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                                >
                                    <option value="TRABAJADOR">Trabajador</option>
                                    <option value="ADMINISTRADOR">Administrador</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={agregarUsuario}
                                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Registrar Usuario
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabla Usuarios */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Usuarios Registrados</h3>

                    {usuarios.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No hay usuarios registrados</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre Completo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {usuarios.map((u) => (
                                    <tr key={u.idUsuario} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.nombreUsuario}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{u.nombrePila} {u.apellidoCompleto}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    u.rol === 'ADMINISTRADOR'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {u.rol === 'ADMINISTRADOR' ? 'Administrador' : 'Trabajador'}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => abrirEditar(u)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                {/* No permitir eliminar (desactivar) o modificar al admin por defecto (ID 1) */}
                                                {(u.rol !== 'ADMINISTRADOR' || u.idUsuario !== 1) ? (
                                                    <button
                                                        onClick={() => abrirModalEliminar(u.idUsuario)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <div
                                                        className="p-2 text-gray-400 cursor-not-allowed"
                                                        title="El administrador por defecto no puede ser eliminado ni desactivado."
                                                    >
                                                        <Shield className="w-4 h-4" />
                                                    </div>
                                                )}
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
                {editUser && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Editar Usuario</h2>
                                <button onClick={cerrarEditar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de Usuario</label>
                                    <input
                                        type="text"
                                        disabled={true}
                                        placeholder="Nombre de usuario"
                                        value={editForm.nombreUsuario}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                nombreUsuario: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre(s)</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre(s)"
                                        value={editForm.nombrePila}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                nombrePila: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                                    <input
                                        type="text"
                                        placeholder="Apellidos"
                                        value={editForm.apellidoCompleto}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                apellidoCompleto: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    />
                                </div>

                                {/* CAMPO CONTRASEÑA CON TOGGLE (EDICIÓN) */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña registrada</label>
                                    <input
                                        type={showEditPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={editForm.password}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                password: e.target.value,
                                            })
                                        }
                                        className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowEditPassword(!showEditPassword)}
                                        className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                                        title={showEditPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showEditPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                                    <select
                                        value={editForm.rol}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                rol: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                        // ⭐ RESTRICCIÓN: Deshabilita si es el administrador por defecto (ID 1)
                                        disabled={editForm.idUsuario === 1}
                                    >
                                        <option value="TRABAJADOR">Trabajador</option>
                                        <option value="ADMINISTRADOR">Administrador</option>
                                    </select>
                                    {editForm.idUsuario === 1 && (
                                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                            <Shield className="w-3 h-3"/> El rol del administrador por defecto no puede ser modificado.
                                        </p>
                                    )}
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

                {/* Modal Eliminar */}
                {modalEliminar && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                                    <h2 className="text-2xl font-bold text-gray-900">Eliminar Usuario</h2>
                                </div>
                                <button onClick={() => setModalEliminar(null)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-gray-600 mb-6">
                                ¿Cómo deseas eliminar este usuario?
                            </p>

                            <div className="space-y-3 mb-6">
                                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <h3 className="font-medium text-gray-900 mb-1">Desactivar (Recomendado)</h3>
                                    <p className="text-sm text-gray-600">
                                        El usuario se oculta pero sus datos se conservan. Puede reactivarse después.
                                    </p>
                                </div>
                                <div className="p-4 border border-red-200 rounded-lg bg-red-50/50">
                                    <h3 className="font-medium text-red-900 mb-1">Eliminar Permanentemente</h3>
                                    <p className="text-sm text-red-600">
                                        ⚠️ El usuario se elimina completamente de la base de datos. Esta acción no se puede deshacer.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleEliminarLogico}
                                    className="w-full px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                                >
                                    Desactivar Usuario
                                </button>
                                <button
                                    onClick={handleEliminarFisico}
                                    className="w-full px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Eliminar Permanentemente
                                </button>
                                <button
                                    onClick={() => setModalEliminar(null)}
                                    className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default NuevoUsuario;
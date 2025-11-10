import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import { Users, Edit2, Trash2, PlusCircle, AlertTriangle } from "lucide-react";
import { crearUsuario, listarUsuarios, editarUsuario, eliminarUsuario } from "../services/UsuarioService.jsx";

const NuevoUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);

    const [form, setForm] = useState({
        username: "",
        nombre: "",
        apellido: "",
        password: "",
        rol: "TRABAJADOR"
    });

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
    
    const [modalEliminar, setModalEliminar] = useState(null);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const data = await listarUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            toast.error("Error al cargar usuarios");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const agregarUsuario = async (e) => {
        e.preventDefault();
        if (!form.username.trim() || !form.nombre.trim() || !form.apellido.trim() || !form.password.trim()) {
            toast.error("Por favor completa todos los campos");
            return;
        }

        try {
            await crearUsuario(form);
            toast.success("Usuario creado correctamente");
            setForm({ username: "", nombre: "", apellido: "", password: "", rol: "TRABAJADOR" });
            cargarUsuarios();
        } catch (error) {
            console.error("Error al crear usuario:", error);
            toast.error("Error al crear usuario: " + error.message);
        }
    };

    const abrirEditar = (usuario) => {
        setEditUser(usuario.idUsuario);
        setEditForm({
            idUsuario: usuario.idUsuario,
            nombreUsuario: usuario.nombreUsuario,
            nombrePila: usuario.nombrePila,
            apellidoCompleto: usuario.apellidoCompleto,
            password: usuario.password,
            rol: usuario.rol,
            activo: usuario.activo
        });
    };

    const guardarEdicion = async () => {
        try {
            await editarUsuario(editForm);
            toast.success("Usuario actualizado correctamente");
            setEditUser(null);
            cargarUsuarios();
        } catch (error) {
            console.error("Error al editar usuario:", error);
            toast.error("Error al editar usuario: " + error.message);
        }
    };

    const abrirModalEliminar = (id) => {
        setModalEliminar(id);
    };
    
    const handleEliminarLogico = async () => {
        try {
            await eliminarUsuario(modalEliminar);
            toast.success("Usuario desactivado correctamente");
            setModalEliminar(null);
            cargarUsuarios();
        } catch (error) {
            console.error("Error al desactivar usuario:", error);
            toast.error("Error al desactivar usuario: " + error.message);
        }
    };
    
    const handleEliminarFisico = async () => {
        try {
            const response = await fetch(`http://localhost:8080/usuarios/eliminar/${modalEliminar}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            
            if (!response.ok) {
                throw new Error("Error al eliminar usuario");
            }
            
            toast.success("⚠️ Usuario eliminado permanentemente");
            setModalEliminar(null);
            cargarUsuarios();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            toast.error("Error al eliminar usuario: " + error.message);
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

                    <form onSubmit={agregarUsuario}>
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
                                    required
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
                                    required
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
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                                    required
                                />
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
                                type="submit"
                                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Registrar Usuario
                            </button>
                        </div>
                    </form>
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
                                                    <button
                                                        onClick={() => abrirModalEliminar(u.idUsuario)}
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
                {editUser && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Usuario</h2>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de Usuario</label>
                                    <input
                                        type="text"
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                                    <input
                                        type="password"
                                        placeholder="Nueva contraseña"
                                        value={editForm.password}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                password: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    />
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
                                    >
                                        <option value="TRABAJADOR">Trabajador</option>
                                        <option value="ADMINISTRADOR">Administrador</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setEditUser(null)}
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
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="w-8 h-8 text-yellow-500" />
                                <h2 className="text-2xl font-bold text-gray-900">Eliminar Usuario</h2>
                            </div>
                            
                            <p className="text-gray-600 mb-6">
                                ¿Cómo deseas eliminar este usuario?
                            </p>
                            
                            <div className="space-y-3 mb-6">
                                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <h3 className="font-medium text-gray-900 mb-1">Desactivar (Recomendado)</h3>
                                    <p className="text-sm text-gray-600">
                                        El usuario se oculta pero sus datos se conservan. Puede reactivarse después.
                                    </p>
                                </div>
                                <div className="p-4 border border-red-200 rounded-lg hover:bg-red-50">
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

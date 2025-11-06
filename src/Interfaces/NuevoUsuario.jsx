import { useState, useEffect } from "react";
import Layout from "../components/Layout.jsx";
import { Users, Edit2, Trash2, PlusCircle } from "lucide-react";
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

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const data = await listarUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            alert("Error al cargar usuarios: " + error.message);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const agregarUsuario = async (e) => {
        e.preventDefault();
        if (!form.username.trim() || !form.nombre.trim() || !form.apellido.trim() || !form.password.trim()) {
            alert("Por favor completa todos los campos");
            return;
        }

        try {
            await crearUsuario(form);
            alert("Usuario creado correctamente");
            setForm({ username: "", nombre: "", apellido: "", password: "", rol: "TRABAJADOR" });
            cargarUsuarios();
        } catch (error) {
            console.error("Error al crear usuario:", error);
            alert("Error al crear usuario: " + error.message);
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
            alert("Usuario actualizado correctamente");
            setEditUser(null);
            cargarUsuarios();
        } catch (error) {
            console.error("Error al editar usuario:", error);
            alert("Error al editar usuario: " + error.message);
        }
    };

    const handleEliminar = async (id) => {
        if (confirm("¿Estás seguro de eliminar este usuario?")) {
            try {
                await eliminarUsuario(id);
                alert("Usuario eliminado correctamente");
                cargarUsuarios();
            } catch (error) {
                console.error("Error al eliminar usuario:", error);
                alert("Error al eliminar usuario: " + error.message);
            }
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
                    <Users className="w-6 h-6" /> Gestión de Usuarios
                </h1>

                {/* Formulario */}
                <form
                    onSubmit={agregarUsuario}
                    className="bg-white p-6 rounded-xl shadow mb-8"
                >
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <PlusCircle className="w-5 h-5" /> Nuevo Usuario
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="Nombre de usuario"
                            value={form.username}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre(s)"
                            value={form.nombre}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            type="text"
                            name="apellido"
                            placeholder="Apellidos"
                            value={form.apellido}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />
                        <select
                            name="rol"
                            value={form.rol}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        >
                            <option value="USUARIO">Trabajador</option>
                            <option value="ADMINISTRADOR">Administrador</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Agregar Usuario
                    </button>
                </form>

                {/* Tabla Usuarios */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-4">Usuarios Registrados</h2>

                    <table className="w-full text-left border">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2">Usuario</th>
                            <th className="p-2">Nombre Completo</th>
                            <th className="p-2">Rol</th>
                            <th className="p-2 text-center">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {usuarios.map((u) => (
                            <tr key={u.idUsuario} className="border-b">
                                <td className="p-2">{u.nombreUsuario}</td>
                                <td className="p-2">{u.nombrePila} {u.apellidoCompleto}</td>
                                <td className="p-2">{u.rol}</td>
                                <td className="p-2 flex justify-center gap-2">
                                    <button
                                        onClick={() => abrirEditar(u)}
                                        className="text-blue-600"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(u.idUsuario)}
                                        className="text-red-600"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal Editar */}
                {editUser && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
                            <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>

                            <div className="flex flex-col gap-4 mb-4">
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
                                    className="border p-2 rounded"
                                />
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
                                    className="border p-2 rounded"
                                />
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
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Contraseña"
                                    value={editForm.password}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            password: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded"
                                />
                                <select
                                    value={editForm.rol}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            rol: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded"
                                >
                                    <option value="USUARIO">Usuario</option>
                                    <option value="ADMINISTRADOR">Administrador</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setEditUser(null)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={guardarEdicion}
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Guardar
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

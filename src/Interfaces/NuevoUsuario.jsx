import { useState } from "react";
import Layout from "../components/Layout.jsx";
import { Users, Edit2, Trash2, PlusCircle } from "lucide-react";

const NuevoUsuario = () => {
    const [usuarios, setUsuarios] = useState([
        { id: 1, username: "admin", password: "123456" },
    ]);

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [editUser, setEditUser] = useState(null);
    const [editForm, setEditForm] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const agregarUsuario = (e) => {
        e.preventDefault();
        if (!form.username.trim() || !form.password.trim()) return;

        setUsuarios([...usuarios, { id: Date.now(), ...form }]);
        setForm({ username: "", password: "" });
    };

    const abrirEditar = (usuario) => {
        setEditUser(usuario.id);
        setEditForm({
            username: usuario.username,
            password: usuario.password,
        });
    };

    const guardarEdicion = () => {
        setUsuarios(
            usuarios.map((u) =>
                u.id === editUser ? { ...u, ...editForm } : u
            )
        );
        setEditUser(null);
    };

    const eliminarUsuario = (id) => {
        setUsuarios(usuarios.filter((u) => u.id !== id));
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
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
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
                            <th className="p-2">Contraseña</th>
                            <th className="p-2 text-center">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {usuarios.map((u) => (
                            <tr key={u.id} className="border-b">
                                <td className="p-2">{u.username}</td>
                                <td className="p-2">{u.password}</td>
                                <td className="p-2 flex justify-center gap-2">
                                    <button
                                        onClick={() => abrirEditar(u)}
                                        className="text-blue-600"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => eliminarUsuario(u.id)}
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
                                    value={editForm.username}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            username: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="text" // 👀 se muestra la contraseña
                                    value={editForm.password}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            password: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded"
                                />
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

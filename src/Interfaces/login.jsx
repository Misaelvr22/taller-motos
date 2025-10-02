import { useState } from "react";
import { FaWrench, FaEye } from "react-icons/fa";

function Login() {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Usuario: ${user}\nContraseña: ${password}`);
    };

    const backgroundImageUrl = '/assets/taller.jpeg'; 

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4">

            <div
                className="absolute inset-0 bg-cover bg-center filter blur-sm -z-10"
                style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            ></div>

            <div className="bg-white shadow-2xl rounded-2xl flex w-full max-w-4xl overflow-hidden z-10">

                <div
                    className="hidden md:block md:w-1/2 bg-cover bg-center"
                    style={{ backgroundImage: `url(${backgroundImageUrl})` }}
                ></div>

                <div className="w-full md:w-1/2 p-10 space-y-6">

                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="bg-blue-600 rounded-full p-3 shadow-lg">
                            <FaWrench className="text-white text-2xl" />
                        </div>

                        <h2 className="text-xl font-semibold text-gray-800 mt-3">Taller de Motocicletas</h2>
                        <p className="text-sm text-gray-500 text-center">
                            Ingresa tus credenciales para acceder al sistema
                        </p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Usuario</label>
                            <input
                                type="text"
                                placeholder="Ingresa tu usuario"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Ingresa tu contraseña"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    <FaEye />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 mt-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 shadow-lg"
                        >
                            Iniciar Sesión
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default Login;

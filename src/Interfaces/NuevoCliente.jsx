import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { Bike, Plus } from "lucide-react";
import { crearCliente } from "../services/ClienteService.jsx";
import { crearMotocicleta } from "../services/MotocicletaService.jsx";

function NuevoCliente() {
    const navigate = useNavigate();

    // Estado del cliente
    const [cliente, setCliente] = useState({
        nombreCompleto: "",
        telefono: ""
    });

    // Estado de las motocicletas
    const [motocicletas, setMotocicletas] = useState([
        { id: 1, marca: "", modelo: "", anio: "", placa: "" }
    ]);

    const handleClienteChange = (e) => {
        const { name, value } = e.target;
        setCliente(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMotoChange = (id, field, value) => {
        setMotocicletas(prev => prev.map(moto =>
            moto.id === id ? { ...moto, [field]: value } : moto
        ));
    };

    const agregarMoto = () => {
        const nuevaId = Math.max(...motocicletas.map(m => m.id)) + 1;
        setMotocicletas(prev => [
            ...prev,
            { id: nuevaId, marca: "", modelo: "", anio: "", placa: "" }
        ]);
    };

    const eliminarMoto = (id) => {
        if (motocicletas.length > 1) {
            setMotocicletas(prev => prev.filter(moto => moto.id !== id));
        }
    };

    const limpiarFormulario = () => {
        setCliente({ nombreCompleto: "", telefono: "" });
        setMotocicletas([{ id: 1, marca: "", modelo: "", anio: "", placa: "" }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!cliente.nombreCompleto || !cliente.telefono) {
            alert("Por favor completa todos los campos del cliente");
            return;
        }

        // Validar motocicletas
        for (const moto of motocicletas) {
            if (!moto.marca || !moto.modelo || !moto.anio || !moto.placa) {
                alert("Por favor completa todos los campos de las motocicletas");
                return;
            }
        }

        try {
            // 1. Crear cliente
            const clienteCreado = await crearCliente(cliente);
            console.log("Cliente creado:", clienteCreado);

            // 2. Crear motocicletas asociadas al cliente
            for (const moto of motocicletas) {
                await crearMotocicleta(moto, clienteCreado.idCliente);
            }

            alert("Cliente y motocicletas registrados correctamente");
            limpiarFormulario();
            navigate("/ConsultaClientes");
        } catch (error) {
            console.error("Error al registrar cliente:", error);
            alert("Error al registrar el cliente: " + error.message);
        }
    };


    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Title Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Registro de Nuevo Cliente</h2>
                    <p className="text-gray-600">Completa la información del cliente y sus motocicletas</p>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-8">Registro de Nuevo Cliente</h3>

                    <form onSubmit={handleSubmit}>
                        {/* Información del Cliente */}
                        <div className="mb-8 border border-gray-200 rounded-lg p-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-6">Información del Cliente</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre Completo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nombreCompleto"
                                        value={cliente.nombreCompleto}
                                        onChange={handleClienteChange}
                                        placeholder="Ej: Juan Pérez González"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Número de Teléfono <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={cliente.telefono}
                                        onChange={handleClienteChange}
                                        placeholder="Ej: 3001234567"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Motocicletas */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Bike className="w-5 h-5 text-gray-700" />
                                    <h4 className="text-lg font-medium text-gray-900">Motocicletas</h4>
                                </div>
                                <button
                                    type="button"
                                    onClick={agregarMoto}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Agregar Moto</span>
                                </button>
                            </div>

                            {motocicletas.map((moto, index) => (
                                <div key={moto.id} className="border border-gray-200 rounded-lg p-6 mb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h5 className="font-medium text-gray-900">Motocicleta #{index + 1}</h5>
                                        {motocicletas.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => eliminarMoto(moto.id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Marca <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={moto.marca}
                                                onChange={(e) => handleMotoChange(moto.id, "marca", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                                                required
                                            >
                                                <option value="">Seleccionar marca</option>
                                                <option value="Honda">Honda</option>
                                                <option value="Yamaha">Yamaha</option>
                                                <option value="Suzuki">Suzuki</option>
                                                <option value="Kawasaki">Kawasaki</option>
                                                <option value="Bajaj">Bajaj</option>
                                                <option value="KTM">KTM</option>
                                                <option value="Italika">Italika</option>
                                                <option value="Otra">Otra</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Modelo <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={moto.modelo}
                                                onChange={(e) => handleMotoChange(moto.id, "modelo", e.target.value)}
                                                placeholder="Ej: CBR 600"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Año <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={moto.anio}
                                                onChange={(e) => handleMotoChange(moto.id, "anio", e.target.value)}
                                                placeholder="2025"
                                                min="1900"
                                                max="2100"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Placa <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={moto.placa}
                                                onChange={(e) => handleMotoChange(moto.id, "placa", e.target.value.toUpperCase())}
                                                placeholder="ABC123"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={limpiarFormulario}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Limpiar Formulario
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Registrar Cliente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoCliente;
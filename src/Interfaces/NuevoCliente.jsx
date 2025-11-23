import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import { Bike, Plus } from "lucide-react";
import { crearCliente, listarClientes } from "../services/ClienteService.jsx";
import { crearMotocicleta, listarMotocicletas } from "../services/MotocicletaService.jsx";

// Constantes
const MARCAS_MOTOS = [
    "Honda", "Yamaha", "Suzuki", "Kawasaki",
    "Bajaj", "KTM", "Italika", "Otra"
];

const MIN_YEAR = 1900;
const CURRENT_YEAR = new Date().getFullYear();

// Componente: InputField (sin cambios)
const InputField = ({ label, required, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            {...props}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50`}
        />
    </div>
);


function NuevoCliente() {
    const navigate = useNavigate();

    const [cliente, setCliente] = useState({
        nombreCompleto: "",
        telefono: ""
    });

    const [motocicletas, setMotocicletas] = useState([
        { id: Date.now(), marca: "", modelo: "", year: "", placa: "" }
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
        setMotocicletas(prev => [
            ...prev,
            { id: Date.now(), marca: "", modelo: "", year: "", placa: "" }
        ]);
    };

    const eliminarMoto = (id) => {
        if (motocicletas.length > 1) {
            setMotocicletas(prev => prev.filter(moto => moto.id !== id));
        }
    };

    const limpiarFormulario = () => {
        setCliente({ nombreCompleto: "", telefono: "" });
        setMotocicletas([{ id: Date.now(), marca: "", modelo: "", year: "", placa: "" }]);
    };

    const validarFormulario = (clienteData, motosData, clientesExistentes, motocicletasExistentes) => {

        const nombreLimpio = clienteData.nombreCompleto.trim();
        const telefonoLimpio = clienteData.telefono.trim();

        // 1. VALIDACIÓN DEL CLIENTE
        if (!nombreLimpio) {
            throw new Error("El nombre del cliente no puede estar vacío.");
        }
        if (!telefonoLimpio) {
            throw new Error("El número de teléfono no puede estar vacío.");
        }
        if (!/^\d+$/.test(telefonoLimpio)) {
            throw new Error("El teléfono debe contener solo números.");
        }

        // VALIDACIÓN DE 10 DÍGITOS
        if (telefonoLimpio.length !== 10) {
            throw new Error("El número de teléfono debe tener exactamente 10 dígitos.");
        }

        // 2. VALIDACIÓN DE MOTOCICLETAS (Campos y Rango de Año)
        const placasFormulario = [];

        for (const moto of motosData) {
            const marcaLimpia = moto.marca?.trim();
            const modeloLimpio = moto.modelo?.trim();
            const placaLimpia = moto.placa?.trim();
            const yearValue = parseInt(moto.year);

            if (!marcaLimpia) {
                throw new Error(`La motocicleta #${motosData.indexOf(moto) + 1} debe tener una marca seleccionada.`);
            }
            if (!modeloLimpio) {
                throw new Error(`El modelo de la motocicleta #${motosData.indexOf(moto) + 1} no puede estar vacío.`);
            }
            if (!placaLimpia) {
                throw new Error(`La placa de la motocicleta #${motosData.indexOf(moto) + 1} no puede estar vacía.`);
            }
            if (!moto.year.toString().trim() || isNaN(yearValue)) {
                throw new Error(`El año de la motocicleta #${motosData.indexOf(moto) + 1} no es válido.`);
            }
            if (yearValue < MIN_YEAR || yearValue > CURRENT_YEAR) {
                throw new Error(`El año de la motocicleta #${motosData.indexOf(moto) + 1} debe estar entre ${MIN_YEAR} y ${CURRENT_YEAR}.`);
            }

            // 3. VALIDACIÓN DE DUPLICADOS EN FORMULARIO
            const placaLowerCase = placaLimpia.toLowerCase();
            if (placasFormulario.includes(placaLowerCase)) {
                throw new Error(`No puedes registrar motocicletas con la misma placa ("${placaLimpia.toUpperCase()}") en el mismo formulario.`);
            }
            placasFormulario.push(placaLowerCase);
        }

        // 4. VALIDACIÓN DE DUPLICADOS EN BASE DE DATOS

        // Cliente (Nombre)
        if (clientesExistentes.some(c => c.nombreCliente?.toLowerCase().trim() === nombreLimpio.toLowerCase())) {
            throw new Error("El nombre del cliente ya está registrado en la base de datos.");
        }
        // Cliente (Teléfono)
        if (clientesExistentes.some(c => c.numeroCliente?.trim() === telefonoLimpio)) {
            throw new Error("El número de teléfono ya está registrado en la base de datos.");
        }
        // Motocicletas (Placa)
        for (const moto of motosData) {
            const placaLimpia = moto.placa.trim().toLowerCase();
            if (motocicletasExistentes.some(m => m.placa?.toLowerCase().trim() === placaLimpia)) {
                throw new Error(`La placa "${moto.placa.toUpperCase()}" ya está registrada en otro cliente.`);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Cargar datos existentes para validación
            const [clientesExistentes, motocicletasExistentes] = await Promise.all([
                listarClientes().catch(() => []),
                listarMotocicletas().catch(() => [])
            ]);

            // Ejecutar todas las validaciones
            validarFormulario(cliente, motocicletas, clientesExistentes, motocicletasExistentes);

            // Si todo es válido, proceder con el registro
            // CORRECCIÓN: Usamos los nombres de campo del ESTADO para enviar al servicio
            const clienteLimpio = {
                nombreCompleto: cliente.nombreCompleto.trim(), // Ajustado al nombre del estado
                telefono: cliente.telefono.trim() // Ajustado al nombre del estado
            };

            // Crear cliente
            // Si esto da error, es muy probable que tu API requiera nombreCliente/numeroCliente
            const clienteCreado = await crearCliente(clienteLimpio);

            // Crear motocicletas con valores limpios
            await Promise.all(motocicletas.map(async (moto) => {
                const motoLimpia = {
                    marca: moto.marca.trim(),
                    modelo: moto.modelo.trim(),
                    year: parseInt(moto.year),
                    placa: moto.placa.trim().toUpperCase()
                };
                await crearMotocicleta(motoLimpia, clienteCreado.idCliente);
            }));

            toast.success("Cliente y motocicletas registrados correctamente");
            limpiarFormulario();
            navigate("/ConsultaClientes");

        } catch (error) {
            // Si el error no es una validación, puede ser un error de la API
            toast.error(`Error al registrar el cliente: ${error.message || 'Error desconocido del servicio.'}`);
        }
    };

    // ... (El resto del componente de renderizado es el mismo)
    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Registro de Nuevo Cliente</h2>
                    <p className="text-gray-600">Completa la información del cliente y sus motocicletas</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-8">Registro de Nuevo Cliente</h3>

                    <form onSubmit={handleSubmit}>
                        {/* Información del Cliente */}
                        <div className="mb-8 border border-gray-200 rounded-lg p-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-6">Información del Cliente</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Nombre Completo"
                                    required
                                    type="text"
                                    name="nombreCompleto"
                                    value={cliente.nombreCompleto}
                                    onChange={handleClienteChange}
                                    placeholder="Ej: Juan Pérez González"
                                />
                                <InputField
                                    label="Número de Teléfono"
                                    required
                                    type="tel"
                                    name="telefono"
                                    value={cliente.telefono}
                                    onChange={handleClienteChange}
                                    placeholder="Ej: 3001234567"
                                    minLength="10"
                                    maxLength="10"
                                />
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
                                                {MARCAS_MOTOS.map(marca => (
                                                    <option key={marca} value={marca}>{marca}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <InputField
                                            label="Modelo"
                                            required
                                            type="text"
                                            value={moto.modelo}
                                            onChange={(e) => handleMotoChange(moto.id, "modelo", e.target.value)}
                                            placeholder="Ej: CBR 600"
                                        />
                                        <InputField
                                            label="Año"
                                            required
                                            type="number"
                                            value={moto.year}
                                            onChange={(e) => handleMotoChange(moto.id, "year", e.target.value)}
                                            placeholder={CURRENT_YEAR.toString()}
                                            min={MIN_YEAR}
                                            max={CURRENT_YEAR}
                                        />
                                        <InputField
                                            label="Placa"
                                            required
                                            type="text"
                                            value={moto.placa}
                                            onChange={(e) => handleMotoChange(moto.id, "placa", e.target.value.toUpperCase())}
                                            placeholder="ABC123"
                                        />
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
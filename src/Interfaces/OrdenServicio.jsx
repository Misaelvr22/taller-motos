import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { Wrench } from "lucide-react";
import { listarClientes } from "../services/ClienteService.jsx";
import { listarMotocicletas } from "../services/MotocicletaService.jsx";
import { crearOrden } from "../services/OrdenService.jsx";

function OrdenServicio() {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [motocicletas, setMotocicletas] = useState([]);
    const [motocicletaSeleccionada, setMotocicletaSeleccionada] = useState(null);

    const [orden, setOrden] = useState({
        descripcionTrabajo: "",
        fechaIngreso: "",
        fechaEntrega: "",
        estado: "Pendiente",
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
                alert("Error al cargar clientes: " + error.message);
            }
        };
        fetchClientes();
    }, []);

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
                    alert("Error al cargar motocicletas: " + error.message);
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
            alert("Selecciona cliente y motocicleta antes de guardar la orden");
            return;
        }

        try {
            const ordenData = {
                descripcionTrabajo: orden.descripcionTrabajo,
                RefaccionesUtilizadas: orden.RefaccionesUtilizadas,
                fechaIngreso: orden.fechaIngreso,
                fechaEntrega: orden.fechaEntrega,
                estado: orden.estado,
                idCliente: clienteSeleccionado.idCliente,
                idMotocicleta: motocicletaSeleccionada.idMotocicleta
            };

            await crearOrden(ordenData);
            alert("Orden registrada correctamente");
            
            // Limpiar formulario
            setOrden({
                descripcionTrabajo: "",
                fechaIngreso: "",
                fechaEntrega: "",
                estado: "Pendiente",
                costo: "",
                observaciones: "",
                RefaccionesUtilizadas: ""
            });
            setClienteSeleccionado(null);
            setMotocicletaSeleccionada(null);
            
        } catch (error) {
            console.error("Error al registrar orden:", error);
            alert("Error al registrar la orden: " + error.message);
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Órdenes de Servicio</h2>
                    <p className="text-gray-600">Crea y gestiona órdenes de trabajo para las motocicletas</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">

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

                            <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
                                <Wrench className="w-5 h-5" /> Guardar Orden
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default OrdenServicio;

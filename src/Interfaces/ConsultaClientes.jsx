import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import { Users, Search, Edit2, Trash2, Plus, X } from "lucide-react";
import { listarClientes, eliminarCliente, editarCliente } from "../services/ClienteService.jsx";
import { listarMotocicletas, crearMotocicleta, editarMotocicleta, eliminarMotocicleta } from "../services/MotocicletaService.jsx";

function ConsultaClientes() {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  
  // Estados para modal de editar
  const [modalEditar, setModalEditar] = useState(null);
  const [editForm, setEditForm] = useState({
    idCliente: null,
    nombreCliente: "",
    numeroCliente: ""
  });
  const [motosEditar, setMotosEditar] = useState([]);
  
  // Estado para modal de confirmación
  const [modalConfirmar, setModalConfirmar] = useState(null);

  useEffect(() => {
    // Cargar clientes desde tu backend
    const fetchClientes = async () => {
      try {
        const data = await listarClientes();
        setClientes(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        toast.error("Error al cargar los clientes");
      }
    };
    fetchClientes();
  }, []);

  // Función para filtrar clientes
  const clientesFiltrados = clientes.filter((cliente) => {
    const matchSearch =
        cliente.nombreCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.numeroCliente?.includes(searchTerm);
    return matchSearch;
  });

  // Función para eliminar cliente
  const handleEliminar = (idCliente) => {
    setModalConfirmar({ tipo: 'cliente', id: idCliente });
  };
  
  const confirmarEliminacion = async () => {
    const { tipo, id } = modalConfirmar;
    
    if (tipo === 'cliente') {
      try {
        await eliminarCliente(id);
        setClientes(clientes.filter(c => c.idCliente !== id));
        toast.success("Cliente eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        toast.error("Error al eliminar el cliente");
      }
    }
    
    setModalConfirmar(null);
  };

  // Función para abrir modal de editar
  const abrirEditar = async (cliente) => {
    setEditForm({
      idCliente: cliente.idCliente,
      nombreCliente: cliente.nombreCliente,
      numeroCliente: cliente.numeroCliente
    });
    
    // Cargar motocicletas del cliente
    try {
      console.log("Cargando motocicletas para cliente:", cliente.idCliente);
      const todasMotos = await listarMotocicletas();
      console.log("Todas las motos:", todasMotos);
      
      if (Array.isArray(todasMotos)) {
        const motosDelCliente = todasMotos.filter(m => {
          console.log("Verificando moto:", m);
          return m.cliente?.idCliente === cliente.idCliente;
        });
        console.log("Motos del cliente:", motosDelCliente);
        setMotosEditar(motosDelCliente);
      } else {
        console.error("La respuesta no es un array:", todasMotos);
        setMotosEditar([]);
      }
    } catch (error) {
      console.error("Error al cargar motocicletas:", error);
      toast.error("No se pudieron cargar las motocicletas");
      setMotosEditar([]);
    }
    
    setModalEditar(cliente.idCliente);
  };

  // Función para guardar edición
  const guardarEdicion = async () => {
    try {
      // Actualizar cliente
      await editarCliente(editForm);
      
      // Procesar motocicletas
      for (const moto of motosEditar) {
        if (moto.idMotocicleta) {
          // Actualizar moto existente
          await editarMotocicleta(moto);
        } else {
          // Crear nueva moto
          if (moto.marca && moto.modelo && moto.placa) {
            await crearMotocicleta(moto, editForm.idCliente);
          }
        }
      }
      
      toast.success("Cliente y motocicletas actualizados correctamente");
      setModalEditar(null);
      setMotosEditar([]);
      // Recargar clientes
      const data = await listarClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error al editar cliente:", error);
      toast.error("Error al editar el cliente");
    }
  };
  
  // Funciones para manejar motocicletas en el modal
  const handleMotoChange = (index, field, value) => {
    const nuevasMotos = [...motosEditar];
    nuevasMotos[index] = { ...nuevasMotos[index], [field]: value };
    setMotosEditar(nuevasMotos);
  };
  
  // Función para agregar nueva moto
  const agregarNuevaMoto = () => {
    setMotosEditar([...motosEditar, {
      marca: "",
      modelo: "",
      serie: "",
      year: "",
      placa: "",
      activo: true
    }]);
  };
  
  const eliminarMotoEditar = (index, idMotocicleta) => {
    if (idMotocicleta) {
      setModalConfirmar({ tipo: 'moto', id: idMotocicleta, index });
    } else {
      // Si no tiene ID, solo remover del array
      const nuevasMotos = motosEditar.filter((_, i) => i !== index);
      setMotosEditar(nuevasMotos);
    }
  };
  
  const confirmarEliminacionMoto = async () => {
    const { id, index } = modalConfirmar;
    try {
      await eliminarMotocicleta(id);
      const nuevasMotos = motosEditar.filter((_, i) => i !== index);
      setMotosEditar(nuevasMotos);
      toast.success("Motocicleta eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar motocicleta:", error);
      toast.error("Error al eliminar la motocicleta");
    }
    setModalConfirmar(null);
  };

  return (
      <Layout>
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Title Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Consulta de Clientes</h2>
            <p className="text-gray-600">Visualiza y gestiona la información de tus clientes</p>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Lista de Clientes</h3>
            </div>

            {/* Filtros y Búsqueda */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, teléfono o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="todos">Todos</option>
                <option value="cliente">Por Cliente</option>
                <option value="orden">Por Orden de Servicio</option>
              </select>
            </div>

            {clientes.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No hay clientes registrados. Utiliza la pestaña "Nuevo Cliente" para registrar el primer cliente.
                  </p>
                </div>
            ) : (
                <>
                  {clientesFiltrados.length === 0 ? (
                      <div className="text-center py-12">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No se encontraron resultados para "{searchTerm}"
                        </p>
                      </div>
                  ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                          </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                          {clientesFiltrados.map((cliente) => (
                              <tr key={cliente.idCliente} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{cliente.nombreCliente}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{cliente.numeroCliente}</td>
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
                          ))}
                          </tbody>
                        </table>
                      </div>
                  )}

                  {/* Contador de resultados */}
                  <div className="mt-4 text-sm text-gray-600">
                    Mostrando {clientesFiltrados.length} de {clientes.length} clientes
                  </div>
                </>
            )}
          </div>
        </div>

        {/* Modal Editar Cliente */}
        {modalEditar && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Editar Cliente</h2>
                <button
                  onClick={() => { setModalEditar(null); setMotosEditar([]); }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Información del Cliente */}
              <div className="mb-6 border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      value={editForm.nombreCliente}
                      onChange={(e) => setEditForm({ ...editForm, nombreCliente: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número de Teléfono</label>
                    <input
                      type="tel"
                      value={editForm.numeroCliente}
                      onChange={(e) => setEditForm({ ...editForm, numeroCliente: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Ej: 3001234567"
                    />
                  </div>
                </div>
              </div>

              {/* Motocicletas */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Motocicletas Registradas</h3>
                  <button
                    onClick={agregarNuevaMoto}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Moto
                  </button>
                </div>

                {motosEditar.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay motocicletas registradas</p>
                ) : (
                  <div className="space-y-4">
                    {motosEditar.map((moto, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-900">Motocicleta #{index + 1}</h4>
                          <button
                            onClick={() => eliminarMotoEditar(index, moto.idMotocicleta)}
                            className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Marca</label>
                            <select
                              value={moto.marca}
                              onChange={(e) => handleMotoChange(index, 'marca', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-sm"
                            >
                              <option value="">Seleccionar</option>
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
                            <label className="block text-xs font-medium text-gray-700 mb-1">Modelo</label>
                            <input
                              type="text"
                              value={moto.modelo}
                              onChange={(e) => handleMotoChange(index, 'modelo', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-sm"
                              placeholder="Ej: CBR 600"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Año</label>
                            <input
                              type="number"
                              value={moto.year}
                              onChange={(e) => handleMotoChange(index, 'year', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-sm"
                              placeholder="2025"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Placa</label>
                            <input
                              type="text"
                              value={moto.placa}
                              onChange={(e) => handleMotoChange(index, 'placa', e.target.value.toUpperCase())}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-sm"
                              placeholder="ABC123"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Serie</label>
                            <input
                              type="text"
                              value={moto.serie || ""}
                              onChange={(e) => handleMotoChange(index, 'serie', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-sm"
                              placeholder="XYZ123"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setModalEditar(null); setMotosEditar([]); }}
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
        
        {/* Modal de Confirmación */}
        {modalConfirmar && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {modalConfirmar.tipo === 'cliente' ? '¿Eliminar Cliente?' : '¿Eliminar Motocicleta?'}
              </h3>
              <p className="text-gray-600 mb-6">
                {modalConfirmar.tipo === 'cliente' 
                  ? 'Esta acción eliminará el cliente y toda su información asociada.'
                  : 'Esta acción eliminará la motocicleta de forma permanente.'}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalConfirmar(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={modalConfirmar.tipo === 'cliente' ? confirmarEliminacion : confirmarEliminacionMoto}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </Layout>
  );
}

export default ConsultaClientes;

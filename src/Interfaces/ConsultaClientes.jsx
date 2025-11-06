import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { Users, Search, Edit2, Trash2, Eye } from "lucide-react";
import { listarClientes, eliminarCliente } from "../services/ClienteService.jsx";

function ConsultaClientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  useEffect(() => {
    // Cargar clientes desde tu backend
    const fetchClientes = async () => {
      try {
        const data = await listarClientes();
        setClientes(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        alert("Error al cargar los clientes: " + error.message);
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
  const handleEliminar = async (idCliente) => {
    if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
      try {
        await eliminarCliente(idCliente);
        setClientes(clientes.filter(c => c.idCliente !== idCliente));
        alert("Cliente eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        alert("Error al eliminar el cliente: " + error.message);
      }
    }
  };

  // Función para editar cliente
  const handleEditar = (cliente) => {
    navigate(`/editar-cliente/${cliente.idCliente}`);
  };

  // Función para ver detalles
  const handleVerDetalles = (cliente) => {
    navigate(`/cliente/${cliente.idCliente}`);
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
                                        onClick={() => handleVerDetalles(cliente)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Ver detalles"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEditar(cliente)}
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
      </Layout>
  );
}

export default ConsultaClientes;
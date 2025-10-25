import React, { useState } from "react";
import { Tab, Tarjeta } from "../componentes.jsx";
import NuevoCliente from "./nuevoCliente.jsx";

function Menu() {
  const [tabActiva, setTabActiva] = useState("clientes");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra superior */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Sistema de Gestión - Taller</h1>
          <p className="text-gray-500 text-sm">Gestión de citas y servicios</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Administrador</span>
          <button className="border border-gray-300 px-3 py-1 rounded-lg text-sm hover:bg-gray-100">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-5xl mx-auto py-10 px-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Panel de Control</h2>
        <p className="text-gray-600 mb-6">
          Gestiona clientes, motocicletas y órdenes de servicio
        </p>

        {/* Pestañas */}
        <div className="flex space-x-2 mb-6">
          <Tab texto="Clientes" activo={tabActiva === "clientes"} onClick={() => setTabActiva("clientes")} />
          <Tab texto="Nuevo Cliente" activo={tabActiva === "nuevo"} onClick={() => setTabActiva("nuevo")} />
          <Tab texto="Órdenes de Servicio" activo={tabActiva === "ordenes"} onClick={() => setTabActiva("ordenes")} />
        </div>

        {/* Contenido dinámico según pestaña */}
        {tabActiva === "clientes" && (
          <Tarjeta>
            <p className="text-gray-600">
              No hay clientes registrados. Utiliza la pestaña “Nuevo Cliente” para registrar el primer cliente.
            </p>
          </Tarjeta>
        )}

        {tabActiva === "nuevo" && <NuevoCliente />}

        {tabActiva === "ordenes" && (
          <Tarjeta>
            <p className="text-gray-600">No tienes órdenes de servicio existentes</p>
          </Tarjeta>
        )}
      </main>
    </div>
  );
}

export default Menu;

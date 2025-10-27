import React, { useState } from "react";
import Tarjeta from "../components/Tarjeta.jsx";
import Label from "../components/Label.jsx";
import Input from "../components/Input.jsx";

export function Consulta() { 
  const [mostrarVentana, setMostrarVentana] = useState(false);
  const cerrarVentana = () => setMostrarVentana(false);

  return (
    <div className="min-h-screen bg-gray-50">
    
      <main className="max-w-5xl mx-auto py-10 px-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Panel de Control</h2>
        <p className="text-gray-600 mb-6">
         Consultas de clientes
        </p>

        <Tarjeta>
          {/* Primer cliente */}
          <div 
            onClick={() => setMostrarVentana(true)} 
            className="cursor-pointer"
          >
            <p className="font-medium">Cliente: Adriana Gabriela Landa Caspeta</p>
            <p className="text-sm text-gray-600">Moto: Honda CB650R (2023)</p>
            <p className="text-sm text-blue-500">Estado: En proceso</p>
          </div>
        </Tarjeta>

        {/* Ventana es un componente que agregue*/}
        {mostrarVentana && (
          <Ventana
            onClose={cerrarVentana} 
          >
            <h4 className="text-lg font-bold mb-3">Orden de Servicio #001</h4>
            
            {/* Cliente */}
            <Label texto="Cliente" htmlFor="cliente" />
            <Input id="cliente" placeholder="Adriana Gabriela Landa Caspeta" /> 
            
            {/* Teléfono */}
            <Label texto="Teléfono" htmlFor="telefono" />
            <Input id="telefono" tipo="tel" placeholder="2217405301" />

            {/* Motocicleta */}
            <Label texto="Motocicleta" htmlFor="moto" />
            <Input id="moto" placeholder="Honda CB650R (2023)" />
            
            {/* Placa */}
            <Label texto="Placa" htmlFor="placa" />
            <Input id="placa" placeholder="AJA445" />

            {/* Servicio */}
            <Label texto="Servicio" htmlFor="servicio" />
            <Input id="servicio" placeholder="Mantenimiento general y cambio de aceite" />
            
            {/* Fecha de ingreso */}
            <Label texto="Fecha de ingreso" htmlFor="fecha" />
            <Input id="fecha" tipo="date" placeholder="15/10/2025" />
            
            {/* Estado */}
            <Label texto="Estado" htmlFor="estado" />
            <Input id="estado" placeholder="En proceso" />
          </Ventana>
        )}
      </main>
    </div>
  );
}

export default Consulta;
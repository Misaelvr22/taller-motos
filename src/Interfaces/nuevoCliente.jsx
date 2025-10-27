// src/Interfaces/nuevoCliente.jsx
import React, { useState } from "react";
import Label from "../components/Label.jsx";
import Input from "../components/Input.jsx";
import Boton from "../components/Boton.jsx";
import Tarjeta from "../components/Tarjeta.jsx";

function NuevoCliente() {
  const [motos, setMotos] = useState([{ id: 1 }]);

  const agregarMoto = () => {
    setMotos([...motos, { id: motos.length + 1 }]);
  };
  
  const quitarMoto = () => {
    if (motos.length > 1) {
      setMotos(motos.slice(0, -1));
    }
  }

  return (
    <Tarjeta>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Registro de Nuevo Cliente</h3>

      {/* Información del cliente */}
      <div className="mb-8">
        <h4 className="text-gray-700 font-semibold mb-3">Información del Cliente</h4>
        <Label texto="Nombre Completo *" htmlFor="nombre" />
        <Input id="nombre" placeholder="Ej: Juan Pérez González" />

        <Label texto="Número de Teléfono *" htmlFor="telefono" />
        <Input id="telefono" tipo="tel" placeholder="Ej: 3001234567" />
      </div>

      {/* Sección de motocicletas */}
      <div>
        <h4 className="text-gray-700 font-semibold mb-3">Motocicletas</h4>

        {motos.map((moto) => (
          <div key={moto.id} className="border border-gray-200 rounded-lg p-4 mb-4">
            <p className="font-medium mb-2 text-gray-700">Motocicleta #{moto.id}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label texto="Marca" htmlFor={`marca${moto.id}`} />
                <Input id={`marca${moto.id}`} placeholder="Ej: Honda" />
              </div>
              <div>
                <Label texto="Modelo *" htmlFor={`modelo${moto.id}`} />
                <Input id={`modelo${moto.id}`} placeholder="Ej: CBR 600" />
              </div>
              <div>
                <Label texto="Año *" htmlFor={`anio${moto.id}`} />
                <Input id={`anio${moto.id}`} placeholder="Ej: 2025" tipo="number" />
              </div>
              <div>
                <Label texto="Placa *" htmlFor={`placa${moto.id}`} />
                <Input id={`placa${moto.id}`} placeholder="Ej: ABC123" />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end mt-3">
          <Boton texto="- Quitar Moto" color="bg-gray-700" onClick={quitarMoto}/>
          <Boton texto="+ Agregar Moto" color="bg-gray-700" onClick={agregarMoto} />
        </div>
      </div>

      {/* Botones finales */}
      <div className="flex justify-end mt-8 space-x-3">
        <Boton texto="Limpiar Formulario" color="bg-gray-500" onClick={() => alert('Formulario limpio')} />
        <Boton texto="Registrar Cliente" onClick={() => alert('Cliente registrado')} />
      </div>
    </Tarjeta>
  );
}

export default NuevoCliente;

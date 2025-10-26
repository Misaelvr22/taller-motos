// src/paginas/gestionUsuarios.jsx
import React, { useState } from "react";
import Boton from "../components/Boton.jsx";    
import Tarjeta from "../components/Tarjeta.jsx"; 

export default function GestionUsuarios() {
const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Juan',apellido:'Pérez',  usuario: 'jperez' },
    { id: 2, nombre: 'Ana',apellido:'López', usuario: 'alopez'},
    { id: 3, nombre: 'Carlos',apellido:'Ruiz', usuario: 'cruiz' }
  ]);

  function agregarUsuario() {
    alert("Aquí abrirías el formulario para agregar un usuario");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Gestión de Usuarios</h3>
        <Boton texto="Agregar usuario" onClick={agregarUsuario} />
      </div>

      <Tarjeta>
        {usuarios.length === 0 ? (
          <p className="text-gray-600">
            No hay usuarios registrados, por favor agregue uno nuevo.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border-b">Nombre</th>
                <th className="p-2 border-b">Apellido</th>
                <th className="p-2 border-b">Usuario</th>
                <th className="p-2 border-b text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{u.nombre}</td>
                  <td className="p-2">{u.apellido}</td>
                  <td className="p-2">{u.usuario}</td>
                  <td className="p-2 text-right space-x-2">
                    <Boton texto="Editar" color="bg-yellow-500" />
                    <Boton texto="Eliminar" color="bg-red-600" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Tarjeta>
    </div>
  );
}

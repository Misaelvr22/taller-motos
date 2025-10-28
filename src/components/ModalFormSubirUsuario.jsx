import React, { useState, useEffect } from 'react'; // <-- Importamos useState y useEffect
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Boton from './Boton.jsx';
import Label from './Label.jsx';
import Input from './Input.jsx';

// Estilo para el modal (sin cambios)
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

// --- 1. ACEPTAMOS EL PROP 'usuarioAEditar' ---
export default function FormularioUsuarioModal({ open, onClose, usuarioAEditar }) {

  // Creamos un estado para "recordar" el valor de cada campo
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rol, setRol] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  // Usamos'useEffect' PARA RELLENAR EL FORMULARIO ---
  // Se ejecuta cuando el modal se abre o el usuario a editar cambia
  useEffect(() => {
    if (usuarioAEditar) {
      // MODO EDICIÓN: Rellenamos los estados con los datos
      setNombre(usuarioAEditar.nombre);
      setApellido(usuarioAEditar.apellido);
      setRol(usuarioAEditar.rol);
      setUsuario(usuarioAEditar.usuario);
      setContrasena(''); // La contraseña la dejamos vacía
    } else {
      // MODO CREACIÓN: Limpiamos los estados
      setNombre('');
      setApellido('');
      setRol('');
      setUsuario('');
      setContrasena('');
    }
  }, [usuarioAEditar, open]); // Se ejecuta si 'usuarioAEditar' o 'open' cambian

  // --- 4. FUNCIÓN 'guardar' INTELIGENTE ---
  function handleGuardar() {
    const datosFormulario = { nombre, apellido, rol, usuario, contrasena };
    
    if (usuarioAEditar) {
      // Lógica para ACTUALIZAR (modo edición)
      alert(`¡Usuario ${usuarioAEditar.nombre} actualizado! (Lógica pendiente)`);
      console.log("Datos actualizados:", { id: usuarioAEditar.id, ...datosFormulario });
    } else {
      // Lógica para CREAR (modo agregar)
      alert("¡Usuario nuevo guardado! (Lógica pendiente)");
      console.log("Datos nuevos:", datosFormulario);
    }
    onClose(); // Cierra el modal
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-titulo"
    >
      <Box sx={style}>
        {/* --- 5. TÍTULO DINÁMICO --- */}
        <Typography id="modal-titulo" variant="h6" component="h2">
          {usuarioAEditar ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
        </Typography>

        {/* --- 6. FORMULARIO CONECTADO A LOS ESTADOS --- */}
        <div className="mt-4">

          <Label htmlFor="nombre" texto="Nombre" />
          <Input 
            id="idNombre" 
            placeholder="Juan" 
            value={nombre} // Conecta el valor al estado 'nombre'
            onChange={(e) => setNombre(e.target.value)} // Actualiza el estado 'nombre'
          />

          <Label htmlFor="apellido" texto="Apellido" />
          <Input 
            id="idApellido" 
            placeholder="Pérez" 
            value={apellido} // Conecta el valor al estado 'apellido'
            onChange={(e) => setApellido(e.target.value)} // Actualiza el estado 'apellido'
          />

          <Label htmlFor="rol" texto="Rol" />
          <select
            id="rol"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={rol} // Conecta el valor al estado 'rol'
            onChange={(e) => setRol(e.target.value)} // Actualiza el estado 'rol'
          >
            <option value="" disabled>Selecciona un rol</option>
            <option value="Administrador">Administrador</option>
            <option value="usuario">Usuario</option>
          </select>

          <Label htmlFor="usuario" texto="Nombre de usuario" />
          <Input 
            id="idUsario" 
            placeholder="jperez123" 
            value={usuario} // Conecta el valor al estado 'usuario'
            onChange={(e) => setUsuario(e.target.value)} // Actualiza el estado 'usuario'
          />

          <Label htmlFor="contrasena" texto="Contraseña" />
          <Input 
            id="idContrasena" 
            tipo="password" 
            placeholder="••••••••" 
            value={contrasena} // Conecta el valor al estado 'contrasena'
            onChange={(e) => setContrasena(e.target.value)} // Actualiza el estado 'contrasena'
          />

          <div className="mt-6 flex justify-end space-x-2">
            <Boton texto="Cancelar" color="bg-gray-500" onClick={onClose} />
            <Boton texto="Guardar" onClick={handleGuardar} />
          </div>
        </div>
      </Box>
    </Modal>
  );
}

// src/paginas/gestionUsuarios.jsx
import React, { useState } from "react";
import Boton from "../components/Boton.jsx";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Modal from "../components/ModalFormSubirUsuario.jsx";
import ConfirmacionModal from "../components/ConfirmacionModal.jsx";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Juan', apellido: 'Pérez', usuario: 'jperez', rol: 'Administrador' },
    { id: 2, nombre: 'Ana', apellido: 'López', usuario: 'alopez', rol: 'Vendedor' },
    { id: 3, nombre: 'Carlos', apellido: 'Ruiz', usuario: 'cruiz', rol: 'Mecánico' }
  ]);
//Constantes para que acepte estados los modales. (Abran o cierrente)
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);


  
  // Modal para agregar un usuario. 
  function agregarUsuario() {
    // Ya no muestra un alert, ahora ABRE el modal
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
  }
  // Funcion para elminar a un usuario, y prevenir en caso de no existir. 
  const handleConfirmarEliminacion = () => {
  if (!usuarioAEliminar) {
    // Nada que hacer: evita el error si por alguna razón llegó null
    return;
  }

  setUsuarios(prevUsuarios =>
    prevUsuarios.filter(u => u.id !== usuarioAEliminar.id)
  );

  alert(`¡Usuario ${usuarioAEliminar.nombre} eliminado!`);
  setUsuarioAEliminar(null);
};

  const handleCerrarModalEliminacion = () => {
    setUsuarioAEliminar(null);
  };

  // Llamada a la tabla para poder definir los campos de la misma. 
  const columns = [
    {
      field: 'nombre',       // El 'key' de tus datos
      headerName: 'Nombre',  // El título en la tabla
      width: 150             // Ancho en píxeles
    },
    { field: 'apellido', headerName: 'Apellido', width: 150 },
    { field: 'usuario', headerName: 'Usuario', width: 130 },
    { field: 'rol', headerName: 'Rol', width: 150 },
    {

      field: 'acciones',
      headerName: 'Acciones',
      sortable: false,
      flex: 1,
      minWidth: 100, 
      align: 'right',
      headerAlign: 'right',

      renderCell: (params) => {

        const handleEdit = () => {
          // Aquí pones la lógica para editar
          alert(`Editar usuario ID: ${params.row.id}`);
        };

        const handleDelete = () => {
          // Aquí pones la lógica para eliminar
          setUsuarioAEliminar(params.row);
        };

        return (
          <div>
            <IconButton
            // Estos son los iconos que se visualizaran en nuestra tabla. 

              aria-label="editar"
              size="small"
              color="primary" // Color azul (del tema)
              onClick={handleEdit}
            >
              <EditIcon />
            </IconButton>

            <IconButton
            // Estos son los iconos que se visualizaran en nuestra tabla. 

              aria-label="eliminar"
              size="small"
              color="error" // Color rojo (del tema)
              onClick={handleDelete}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      }
    }
  ];
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Gestión de Usuarios</h3>
        <Boton texto="Agregar usuario" onClick={agregarUsuario} />
      </div>

      <Paper sx={{ height: 400, width: '100%', overflowX: 'auto' }}>
        <DataGrid
          // --- Tus Datos ---
          rows={usuarios}
          columns={columns}

          // --- Opciones de Paginación ---
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}

          // --- Estilo y Comportamiento ---
          disableRowSelectionOnClick  // <-- Esto quita el checkbox/selección
          sx={{ border: 0 }}        // <-- Esto quita el borde exterior
        />
      </Paper>
      <Modal
        open={modalAbierto}
        onClose={cerrarModal}
      />
      <ConfirmacionModal
        open={!!usuarioAEliminar} // El modal está abierto si 'usuarioAEliminar' NO es null
        onClose={handleCerrarModalEliminacion}
        onConfirm={handleConfirmarEliminacion}
        usuario={usuarioAEliminar}
      />
    </div>
  );
}

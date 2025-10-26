import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// Usaremos tu componente Boton que ya tienes
import Boton from './Boton.jsx'; 

// Estilo para el modal
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

// Recibe 'open', 'onClose', 'onConfirm' y el 'usuario'
export default function ConfirmacionModal({ open, onClose, onConfirm, usuario }) {
  
  // Si no hay un usuario seleccionado, no renderiza nada
  if (!usuario) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-confirmacion-titulo"
    >
      <Box sx={style}>
        <Typography id="modal-confirmacion-titulo" variant="h6" component="h2">
          Confirmar Eliminación
        </Typography>
        
        {/* Muestra el nombre del usuario dinámicamente */}
        <Typography sx={{ mt: 2 }}>
          ¿Estás seguro de que quieres eliminar al usuario{" "}
          <strong>{usuario.nombre} {usuario.apellido}</strong>? 
          Esta acción no se puede deshacer.
        </Typography>

        {/* Botones de acción */}
        <div className="mt-6 flex justify-end space-x-2">
           <Boton texto="Cancelar" color="bg-gray-500" onClick={onClose} />
           <Boton texto="Eliminar" color="bg-red-600" onClick={onConfirm} />
        </div>
      </Box>
    </Modal>
  );
}
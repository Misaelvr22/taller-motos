// Asumo que usas Material-UI (MUI) por la imagen anterior
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Importa los componentes de formulario (ajusta la ruta si no usas index.js)
import Boton from './Boton.jsx';
import Label from './Label.jsx';
import Input from './Input.jsx';

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

// Recibe 'open' y 'onClose' (para abrir/cerrar)
export default function FormularioUsuarioModal({ open, onClose }) {

    // Función de ejemplo para guardar
    function handleGuardar() {
        // Aquí iría la lógica para guardar los datos
        alert("¡Usuario guardado! (Lógica pendiente)");
        onClose(); // Cierra el modal después de guardar
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-titulo"
        >
            <Box sx={style}>
                <Typography id="modal-titulo" variant="h6" component="h2">
                    Agregar Nuevo Usuario
                </Typography>

                {/* --- FORMULARIO CON LOS CAMPOS SOLICITADOS --- */}
                <div className="mt-4">

                    <Label htmlFor="nombre" texto="Nombre" />
                    <Input id="idNombre" placeholder="Juan" />

                    <Label htmlFor="apellido" texto="Apellido" />
                    <Input id="idApellido" placeholder="Pérez" />

                    <Label htmlFor="rol" texto="Rol" />
                    <select
                        id="rol"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled selected>Selecciona un rol</option>
                        <option value="admin">Administrador</option>
                        <option value="usuario">Usuario</option>
                    </select>

                    <Label htmlFor="usuario" texto="Nombre de usuario" />
                    <Input id="idUsario" placeholder="isai123" />

                    <Label htmlFor="contrasena" texto="Contraseña" />
                    <Input id="idContrasena" tipo="password" placeholder="••••••••" />

                    <div className="mt-6 flex justify-end space-x-2">
                        <Boton texto="Cancelar" color="bg-gray-500" onClick={onClose} />
                        <Boton texto="Guardar" onClick={handleGuardar} />
                    </div>
                </div>
                {/* --- FIN DEL FORMULARIO --- */}

            </Box>
        </Modal>
    );
}
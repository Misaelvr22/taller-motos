import { API_BASE_URL } from "../config/api.js";

const API_URL = `${API_BASE_URL}/orden`;

export async function crearOrden(orden) {
    console.log("Datos de la orden a enviar:", orden);
    
    const payload = {
        descripcionServicio: orden.descripcionTrabajo,
        refacciones: orden.RefaccionesUtilizadas || "",
        fechaEntrada: orden.fechaIngreso,
        fechaEntrega: orden.fechaEntrega || null,
        status: orden.estado || "PENDIENTE",
        costo: parseFloat(orden.costo) || 0,
        cliente: {
            idCliente: parseInt(orden.idCliente)
        },
        motocicleta: {
            idMotocicleta: parseInt(orden.idMotocicleta)
        },
        activo: true
    };
    
    console.log("Payload a enviar:", JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${API_URL}/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    
    console.log("Respuesta status:", response.status);

    if (!response.ok) {
        throw new Error("Error al crear orden");
    }

    return await response.json();
}

export async function listarOrdenes() {
    const response = await fetch(`${API_URL}/listar`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Error al listar órdenes");
    }

    return await response.json();
}

export async function editarOrden(orden) {
    const response = await fetch(`${API_URL}/editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orden),
    });

    if (!response.ok) {
        throw new Error("Error al editar orden");
    }

    return await response.json();
}

export async function eliminarOrden(idOrden) {
    const response = await fetch(`${API_URL}/eliminar-logico/${idOrden}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Error al eliminar orden");
    }

    return await response.text();
}

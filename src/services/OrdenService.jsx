const API_URL = "http://localhost:8080/orden";

export async function crearOrden(orden) {
    const response = await fetch(`${API_URL}/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            descripcionServicio: orden.descripcionTrabajo,
            refacciones: orden.RefaccionesUtilizadas,
            fechaEntrada: orden.fechaIngreso,
            fechaEntrega: orden.fechaEntrega,
            status: orden.estado || "PENDIENTE",
            Cliente: {
                idCliente: orden.idCliente
            },
            Motocicleta: {
                idMotocicleta: orden.idMotocicleta
            }
        }),
    });

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

const API_URL = "http://localhost:8080/clientes";
export async function crearCliente(cliente) {
    const response = await fetch(`${API_URL}/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombreCliente: cliente.nombreCompleto,
            numeroCliente: cliente.telefono
        }),
    });

    if (!response.ok) {
        throw new Error("Error al crear cliente");
    }

    return await response.json();
}

export async function listarClientes() {
    const response = await fetch(`${API_URL}/listar`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Error al listar clientes");
    }

    return await response.json();
}

export async function editarCliente(cliente) {
    const response = await fetch(`${API_URL}/editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
    });

    if (!response.ok) {
        throw new Error("Error al editar cliente");
    }

    return await response.json();
}

export async function eliminarCliente(idCliente) {
    const response = await fetch(`${API_URL}/eliminar-logico/${idCliente}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Error al eliminar cliente");
    }

    return await response.text();
}

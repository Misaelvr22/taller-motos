const API_URL = "http://localhost:8080/motocicletas";

export async function crearMotocicleta(motocicleta, idCliente) {
    const response = await fetch(`${API_URL}/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            marca: motocicleta.marca,
            modelo: motocicleta.modelo,
            year: parseInt(motocicleta.anio),
            placa: motocicleta.placa,
            serie: motocicleta.serie || "",
            cliente: {
                idCliente: idCliente
            }
        }),
    });

    if (!response.ok) {
        throw new Error("Error al crear motocicleta");
    }

    return await response.json();
}

export async function listarMotocicletas() {
    const response = await fetch(`${API_URL}/listar`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Error al listar motocicletas");
    }

    return await response.json();
}

export async function editarMotocicleta(motocicleta) {
    const response = await fetch(`${API_URL}/editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(motocicleta),
    });

    if (!response.ok) {
        throw new Error("Error al editar motocicleta");
    }

    return await response.json();
}

export async function eliminarMotocicleta(idMotocicleta) {
    const response = await fetch(`${API_URL}/eliminar-logico/${idMotocicleta}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Error al eliminar motocicleta");
    }

    return await response.text();
}

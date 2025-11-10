const API_URL = "http://localhost:8080/usuarios";

export async function crearUsuario(usuario) {
    const payload = {
        nombreUsuario: usuario.username,
        nombrePila: usuario.nombre,
        apellidoCompleto: usuario.apellido,
        password: usuario.password,
        rol: usuario.rol || "USUARIO",
        activo: true
    };
    
    console.log("Enviando usuario:", payload);
    
    const response = await fetch(`${API_URL}/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del backend:", errorData);
        const mensaje = errorData.error || "Error al crear usuario";
        throw new Error(mensaje);
    }

    return await response.json();
}

export async function listarUsuarios() {
    const response = await fetch(`${API_URL}/listar`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Error al listar usuarios");
    }

    return await response.json();
}

export async function editarUsuario(usuario) {
    const response = await fetch(`${API_URL}/editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            idUsuario: usuario.idUsuario,
            nombreUsuario: usuario.nombreUsuario,
            nombrePila: usuario.nombrePila,
            apellidoCompleto: usuario.apellidoCompleto,
            password: usuario.password,
            rol: usuario.rol,
            activo: usuario.activo
        }),
    });

    if (!response.ok) {
        throw new Error("Error al editar usuario");
    }

    return await response.json();
}

export async function eliminarUsuario(idUsuario) {
    const response = await fetch(`${API_URL}/eliminar-logico/${idUsuario}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Error al eliminar usuario");
    }

    return await response.text();
}

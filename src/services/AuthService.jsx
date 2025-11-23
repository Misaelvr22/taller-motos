import { API_BASE_URL } from "../config/api.js";

const API_URL = `${API_BASE_URL}/auth`;

export async function login(nombre_usuario, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreUsuario: nombre_usuario, password }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
        throw new Error(data.error || "Error al iniciar sesión");
    }

    // Guardar sesión local
    localStorage.setItem("usuario", JSON.stringify({
        usuario: data.nombreUsuario,
        nombre_usuario: data.nombreUsuario,
        rol: data.rol
    }));

    return data;
}

export function getUsuario() {
    const user = localStorage.getItem("usuario");
    return user ? JSON.parse(user) : null;
}

export function logout() {
    localStorage.removeItem("usuario");
}

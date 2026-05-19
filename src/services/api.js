// services/api.js
// Helper centralizado para todas las llamadas API

const API_BASE = import.meta.env.VITE_API_URL || "";

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.message || "Error en la solicitud",
      errors: data?.errors,
    };
  }

  return data;
}

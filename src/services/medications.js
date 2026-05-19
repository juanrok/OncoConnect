// services/medications.js
import { apiCall } from "./api";

export const medicationsService = {
  // GET todos los medicamentos del usuario
  async getAll() {
    return apiCall("/api/medications", { method: "GET" });
  },

  // GET un medicamento específico
  async getById(id) {
    return apiCall(`/api/medications/${id}`, { method: "GET" });
  },

  // POST crear un medicamento
  async create(data) {
    return apiCall("/api/medications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // PUT actualizar un medicamento
  async update(id, data) {
    return apiCall(`/api/medications/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE eliminar un medicamento
  async delete(id) {
    return apiCall(`/api/medications/${id}`, { method: "DELETE" });
  },
};

export default function MedicationCard({ name, dose, frequency, onAskSymptoms, onDelete }) {
  return (
    <div className="medCard">
      <div className="rowBetween">
        <div className="medName">{name}</div>
        {onDelete && (
          <button
            className="smallLink"
            onClick={onDelete}
            style={{
              color: "#e1006a",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Eliminar
          </button>
        )}
      </div>

      <div className="medLine"><b>Dosis:</b> {dose || "No especificada"}</div>
      <div className="medLine"><b>Frecuencia:</b> {frequency || "No especificada"}</div>

      <span className="smallLink" onClick={onAskSymptoms}>
        ¿Qué información tienes?
      </span>
    </div>
  );
}
export default function MedicationCard({
  name,
  dose,
  frequency,
  notes,
  showInfo,
  onToggleInfo,
  onDelete,
}) {
  if (showInfo) {
    return (
      <div className="medCard">
        <div className="medName">{name}</div>

        <div className="medLine" style={{ marginTop: 10 }}>
          <b>Notas:</b> {notes && notes.trim() ? notes : "Sin notas"}
        </div>

        <button
          type="button"
          className="smallLink"
          onClick={onToggleInfo}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
          }}
        >
          Volver
        </button>
      </div>
    );
  }

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

      <button
        type="button"
        className="smallLink"
        onClick={onToggleInfo}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
        }}
      >
        ¿Qué información tienes?
      </button>
    </div>
  );
}
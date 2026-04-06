export default function MedicationCard({ name, dose, frequency, onAskSymptoms }) {
  return (
    <div className="medCard">
      <div className="medName">{name}</div>

      <div className="medLine"><b>Dosis:</b> {dose}</div>
      <div className="medLine"><b>Frecuencia:</b> {frequency}</div>

      <span className="smallLink" onClick={onAskSymptoms}>
        ¿Qué síntomas puedo tener?
      </span>
    </div>
  );
}
export default function MenuDrawer({ open, onClose, onNavigate }) {
  if (!open) return null;

  return (
    <div className="drawerOverlay" onClick={onClose} role="presentation">
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawerHeader">
          <div style={{ fontWeight: 900 }}>OncoConnect</div>
          <button className="drawerClose" onClick={onClose} aria-label="Cerrar menú">
            ✕
          </button>
        </div>

        <nav className="drawerNav">
          <button className="drawerItem" onClick={() => onNavigate("/Name")}>
            Bienvenida
          </button>
          <button className="drawerItem" onClick={() => onNavigate("/login")}>
            Hoja de ruta
          </button>
          <button className="drawerItem" onClick={() => onNavigate("/medications")}>
            Medicamentos
          </button>
          <button className="drawerItem" onClick={() => onNavigate("/school")}>
            Escuela del Cuidado
          </button> 
        </nav>
      </aside>
    </div>
  );
}
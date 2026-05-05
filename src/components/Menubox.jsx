import { useNavigate } from "react-router-dom";

export default function MenuDrawer({ open, onClose, onNavigate }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Close menu and navigate to home
    onClose();
    navigate("/");
  };

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
          <button className="drawerItem" onClick={() => onNavigate("/name")}>
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
          <button 
            className="drawerItem" 
            onClick={handleLogout}
            style={{ color: "#e1006a", fontWeight: 600 }}
          >
            Cerrar sesión
          </button>
        </nav>
      </aside>
    </div>
  );
}
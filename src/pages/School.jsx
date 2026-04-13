import { useNavigate, useOutletContext } from "react-router-dom";
import TopBar from "../components/TopBar";
import Escuela from "../assets/escuela.png";

export default function School() {
  const navigate = useNavigate();
  const { openMenu } = useOutletContext();

  return (
    <>
      <TopBar onMenuClick={openMenu} />

      <div className="content schoolCenter">
        <div className="schoolHero" aria-label="Ilustración escuela">
          <img 
                src={Escuela} 
                alt="Mujer" 
                style={{ width: 150, marginBottom: 10 }} 
            />
        </div>

        <h1 className="schoolTitle">Escuela del cuidado</h1>

        <p className="schoolText">
          Conoce y aprende sobre conceptos y términos clave que te encontrarás a lo largo
          de tu tratamiento y que te puede ayudar a familiarizarte con la información
        </p>

        <button
          className="primaryBtn schoolBtn"
          onClick={() => navigate("/school/categories")}
        >
          Empezar
        </button>
      </div>
    </>
  );
}
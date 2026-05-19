import { useNavigate, useOutletContext } from "react-router-dom";
import TopBar from "../components/TopBar";
import logo from "../assets/logo_onco.png";

export default function Home() {
  const navigate = useNavigate();
  const { openMenu } = useOutletContext();

  return (
    <div className="homePage">
      <TopBar onMenuClick={openMenu} isPublic={true} />

      {/* HERO SECTION */}
      <section className="heroSection">
        <div className="heroContent">
          <img 
            src={logo} 
            alt="OncoConnect logo" 
            className="heroLogo" 
          />
          <h1 className="heroTitle">
            OncoConnect: tu compañía durante el tratamiento
          </h1>
          <p className="heroSubtitle">
            Acompañamiento integral para mujeres diagnosticadas con cáncer de mama
          </p>
          <button 
            onClick={() => navigate("/login")}
            className="heroCTA"
          >
            Acceder a la plataforma
          </button>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="infoSection">
        <div className="sectionContainer">
          <h2 className="sectionHeading">Quiénes somos</h2>
          <p className="sectionText">
            OncoConnect es una plataforma digital diseñada para acompañar a mujeres durante su proceso de tratamiento del cáncer de mama. Nuestro objetivo es proporcionar acceso a información confiable, herramientas prácticas y un espacio seguro para el autocuidado y el seguimiento de tu salud.
          </p>
          <p className="sectionText">
            Creemos en el poder del acompañamiento integral: desde información médica clara hasta apoyo emocional, todo en un solo lugar.
          </p>
        </div>
      </section>

      {/* PRINCIPIOS / INSPIRACIÓN */}
      <section className="principlesSection">
        <div className="sectionContainer">
          <h2 className="sectionHeading">Nuestro enfoque</h2>
          <p className="sectionSubtext">
            Nos inspiramos en principios de atención integral y apoyo humanizado:
          </p>
          <div className="principlesGrid">
            <div className="principleCard">
              <h3>Acompañamiento</h3>
              <p>Nunca estás sola. Nuestras herramientas te acompañan en cada fase del tratamiento.</p>
            </div>
            <div className="principleCard">
              <h3>Información confiable</h3>
              <p>Acceso a recursos médicos validados y orientación clara sobre tu proceso.</p>
            </div>
            <div className="principleCard">
              <h3>Autocuidado</h3>
              <p>Empoderamiento mediante el seguimiento y la toma de decisiones informadas.</p>
            </div>
            <div className="principleCard">
              <h3>Acceso a la salud</h3>
              <p>Facilita la conexión con profesionales y recursos de tu red de apoyo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUES DE INFORMACIÓN GENERAL */}
      <section className="featuresSection">
        <div className="sectionContainer">
          <h2 className="sectionHeading">¿Qué encontrarás en OncoConnect?</h2>
          <div className="featuresGrid">
            <div className="featureCard">
              <h3>Seguimiento de medicamentos</h3>
              <p>Registra, organiza y mantén un control detallado de tus medicamentos y tratamientos.</p>
            </div>
            <div className="featureCard">
              <h3>Información educativa</h3>
              <p>Accede a contenido especializado sobre cáncer de mama, tratamientos y bienestar.</p>
            </div>
            <div className="featureCard">
              <h3>Recursos de apoyo</h3>
              <p>Encuentra herramientas prácticas para el autocuidado y la salud integral.</p>
            </div>
            <div className="featureCard">
              <h3>Perfil personalizado</h3>
              <p>Crea un perfil que se adapte a tu proceso y tus necesidades específicas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL / FOOTER */}
      <section className="ctaSection">
        <div className="sectionContainer">
          <h2 className="ctaTitle">Comienza tu acompañamiento hoy</h2>
          <p className="ctaText">
            OncoConnect está disponible para apoyarte en cada paso del camino
          </p>
          <button 
            onClick={() => navigate("/login")}
            className="ctaButton"
          >
            Acceder
          </button>
          <p className="footerText">
            Plataforma de apoyo para mujeres con cáncer de mama • Información segura y confiable
          </p>
        </div>
      </section>
    </div>
  );
}
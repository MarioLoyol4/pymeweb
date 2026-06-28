import { Link } from "react-router-dom";
import '../styles/pages/Home.css';

function Home() {
  return (
    <div className="home-container">
      {/* 1. BARRA DE NAVEGACIÓN */}
      <nav className="navbar">
        <div className="logo-container">
          <img src="/public/imagen1jpg.jpg" alt="SimpliPyme Logo" className="logo-img" />
          <span className="logo-text">SimpliPyme</span>
        </div>
        <div className="nav-buttons">
          <Link to="/login" className="btn-login">Iniciar sesión</Link>
          <Link to="/registro" className="btn-comenzar">Crear cuenta</Link>
        </div>
      </nav>

      {/* 2. SECCIÓN HERO */}
      <main className="hero-section">
        <div className="hero-content">
          <h1>Crea tu negocio digital en minutos</h1>
          <p>
            La plataforma inteligente que construye automáticamente el sitio web
            profesional perfecto para tu pequeña empresa. ¡Sin necesidad de saber
            programar sin tener conocimientos técnicos!
          </p>
          <Link to="/registro" className="btn-cta">Crear mi página</Link>
        </div>
        
        <div className="hero-image-container">
          <img src="/public/imagen1jpg.jpg" alt="Ilustración SimpliPyme" className="hero-illustration" />
        </div>
      </main>

      {/* 3. SECCIÓN BENEFICIOS */}
      <section className="benefits-section">
        <h2>Nuestros beneficios</h2>
        
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="card-badge bg-blue">
              <img src="/public/imagen1jpg.jpg" alt="Icono Cohete" />
            </div>
            <div className="card-content">
              <h3>Creación automática</h3>
              <p>Contruimos tu sitio profesional en segundos, ¡solo responde unas preguntas!</p>
            </div>
            <span className="card-number color-blue">01</span>
          </div>

          <div className="benefit-card">
            <div className="card-badge bg-orange">
              <img src="/public/imagen1jpg.jpg" alt="Icono Ampolleta" />
            </div>
            <div className="card-content">
              <h3>Fácil e intuitivo</h3>
              <p>Diseñado para ti. Personaliza sin códigos, solo copia y pega</p>
            </div>
            <span className="card-number color-orange">02</span>
          </div>

          <div className="benefit-card">
            <div className="card-badge bg-green">
              <img src="/public/imagen1jpg.jpg" alt="Icono Escudo" />
            </div>
            <div className="card-content">
              <h3>Listo para crecer</h3>
              <p>Ideal para integrar su rubro de manera digital</p>
            </div>
            <span className="card-number color-green">03</span>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">
          <img src="/public/imagen1jpg.jpg" alt="SimpliPyme Logo" />
          <span>SimpliPyme</span>
        </div>
        <p className="footer-copyright">Derechos reservados @ 2026 SimpliPyme</p>
      </footer>
    </div>
  );
}

export default Home;
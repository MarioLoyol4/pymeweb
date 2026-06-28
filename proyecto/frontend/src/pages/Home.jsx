import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Home.css';

const beneficios = [
  {
    titulo: 'Creación automática',
    descripcion: 'Genera una presencia profesional en minutos con una base lista para editar.',
    numero: '01'
  },
  {
    titulo: 'Fácil e intuitivo',
    descripcion: 'Edita secciones, colores y contenido con un flujo visual simple.',
    numero: '02'
  },
  {
    titulo: 'Listo para crecer',
    descripcion: 'Pensado para pymes que quieren publicar rápido y seguir escalando.',
    numero: '03'
  }
];

const Home = () => {
  return (
    <main className="home-page">
      <header className="home-header">
        <div className="home-brand">
          <div className="home-logo-mark" aria-hidden="true">
            <span />
          </div>
          <div>
            <strong>PymeWeb</strong>
            <span>Tu sitio web listo para vender</span>
          </div>
        </div>

        <nav className="home-nav" aria-label="Navegación principal">
          <a href="#beneficios">Beneficios</a>
          <a href="#como-funciona">Cómo funciona</a>
          <Link className="home-nav-link ghost" to="/login">Iniciar sesión</Link>
          <Link className="home-nav-link solid" to="/registro">Comenzar</Link>
        </nav>
      </header>

      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="home-kicker">PymeWeb</span>
          <h1>Crea tu negocio digital en minutos</h1>
          <p>
            La plataforma que arma tu sitio profesional y te deja editarlo sin
            conocimientos técnicos. Publica, ajusta y crece desde un solo lugar.
          </p>
          <div className="home-actions">
            <Link className="home-cta primary" to="/registro">Crear mi página</Link>
            <Link className="home-cta secondary" to="/login">Ya tengo cuenta</Link>
          </div>
        </div>
      </section>

      <section className="home-benefits" id="beneficios">
        <h2>Nuestros beneficios</h2>
        <div className="home-benefits-grid">
          {beneficios.map((beneficio) => (
            <article className="benefit-card" key={beneficio.numero}>
              <div className="benefit-badge">{beneficio.numero}</div>
              <h3>{beneficio.titulo}</h3>
              <p>{beneficio.descripcion}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-workflow" id="como-funciona">
        <div className="home-workflow-copy">
          <span className="home-section-tag">Cómo funciona</span>
          <h2>Arranca con una base y personalízala a tu medida</h2>
          <p>
            Elige tu rubro, entra al editor y ajusta contenido, colores y secciones
            desde una interfaz clara. Sin código, sin fricción.
          </p>
        </div>
        <div className="home-steps">
          <div className="step-item">
            <strong>1</strong>
            <div>
              <h3>Registra tu negocio</h3>
              <p>Crea tu cuenta y prepara tu espacio de trabajo.</p>
            </div>
          </div>
          <div className="step-item">
            <strong>2</strong>
            <div>
              <h3>Personaliza el sitio</h3>
              <p>Agrega secciones, cambia colores y ajusta el contenido.</p>
            </div>
          </div>
          <div className="step-item">
            <strong>3</strong>
            <div>
              <h3>Publica y comparte</h3>
              <p>Tu página queda lista para mostrar tu negocio al mundo.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div>
          <strong>PymeWeb</strong>
          <p>Construye tu presencia digital con una experiencia simple y moderna.</p>
        </div>
        <div className="home-footer-links">
          <Link to="/login">Acceder</Link>
          <Link to="/registro">Crear cuenta</Link>
        </div>
      </footer>
    </main>
  );
};

export default Home;

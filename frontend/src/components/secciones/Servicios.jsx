import React, { useEffect, useRef, useState } from 'react';
import '../../styles/components/secciones/Servicios.css';
import {
    normalizarServicios,
    crearModeloServicios,
    calcularEstadoPaginas,
    calcularServiciosPorVista,
    calcularTotalPaginas,
    calcularPaginaActiva,
    obtenerIndicePorPagina,
    obtenerPaginaDesdeScroll,
    desplazarCarrusel,
    reiniciarCarrusel
} from '../../js/components/secciones/Servicios.js';

export const Servicios = ({ contenido }) => {
    const { titulo, descripcion, servicios } = normalizarServicios(contenido);
    const modeloServicios = crearModeloServicios(servicios);
    const totalServicios = modeloServicios.length;
    const trackRef = useRef(null);
    const [indiceActivo, setIndiceActivo] = useState(0);
    const [serviciosPorVista, setServiciosPorVista] = useState(() => (
        typeof window !== 'undefined' ? calcularServiciosPorVista(window.innerWidth) : 4
    ));

    useEffect(() => {
        const actualizar = () => {
            setServiciosPorVista(calcularServiciosPorVista(window.innerWidth));
        };
        actualizar();
        window.addEventListener('resize', actualizar);
        return () => window.removeEventListener('resize', actualizar);
    }, []);

    const totalPaginas = calcularTotalPaginas(totalServicios, serviciosPorVista);
    const paginaActiva = calcularPaginaActiva(indiceActivo, serviciosPorVista);

    const {
        mostrarControles,
        anteriorDeshabilitado,
        siguienteDeshabilitado
    } = calcularEstadoPaginas(paginaActiva, totalPaginas);

    const irAIndice = (indice) => {
        const objetivo = desplazarCarrusel(trackRef.current, indice, totalServicios);
        if (objetivo !== null) setIndiceActivo(objetivo);
    };

    const irAPagina = (pagina) => {
        const indice = obtenerIndicePorPagina(pagina, serviciosPorVista, totalServicios);
        irAIndice(indice);
    };

    const manejarScroll = () => {
        const pagina = obtenerPaginaDesdeScroll(trackRef.current, serviciosPorVista, totalPaginas);
        const indice = obtenerIndicePorPagina(pagina, serviciosPorVista, totalServicios);
        if (indice !== indiceActivo) setIndiceActivo(indice);
    };

    useEffect(() => {
        setIndiceActivo(0);
        reiniciarCarrusel(trackRef.current);
    }, [totalServicios]);

    useEffect(() => {
        const indice = obtenerIndicePorPagina(paginaActiva, serviciosPorVista, totalServicios);
        irAIndice(indice);
    }, [serviciosPorVista]);

    return (

        // TITULO SECCION SERVICIOS
        <section className="diseno-servicios">

            {/* TITULO HEADER SECCION */}
            <header className="servicios-header">
                <h2>{titulo}</h2>
                {descripcion && <p>{descripcion}</p>}
            </header>

            {/* TITULO CONTENEDOR TARJETAS */}
            <div className="servicios-carousel">
                <div className="servicios-track" ref={trackRef} onScroll={manejarScroll}>
                    {modeloServicios.map((servicio) => (
                        <article
                            
                            // TITULO TARJETAS
                            className={`servicio-card servicio-card--${servicio.variante}`}
                            key={servicio.key}
                        >
                            <div className="servicio-media">
                                {servicio.icono ? (
                                    <img src={servicio.icono} alt={servicio.titulo || 'Servicio'} />
                                ) : (
                                    <div className="servicio-media-placeholder">SERVICIO</div>
                                )}
                            </div>

                            {/* TITULO CUERPO TARJETA */}
                            <div className="servicio-body">
                                <h3>{servicio.titulo}</h3>
                                {servicio.descripcion && <p>{servicio.descripcion}</p>}
                            </div>
                        </article>
                    ))}
                </div>

                {mostrarControles && (
                    <div className="servicios-controles">
                        <button
                            type="button"
                            className="servicios-flecha"
                            onClick={() => irAPagina(paginaActiva - 1)}
                            disabled={anteriorDeshabilitado}
                            aria-label="Mostrar servicios anteriores"
                        >
                            &lt;
                        </button>
                        <div className="servicios-dots">
                            {Array.from({ length: totalPaginas }).map((_, index) => (
                                <button
                                    key={`dot-${index}`}
                                    type="button"
                                    className={`servicio-dot ${index === paginaActiva ? 'activo' : ''}`}
                                    onClick={() => irAPagina(index)}
                                    aria-label={`Ir a la pagina ${index + 1}`}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            className="servicios-flecha"
                            onClick={() => irAPagina(paginaActiva + 1)}
                            disabled={siguienteDeshabilitado}
                            aria-label="Mostrar servicios siguientes"
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

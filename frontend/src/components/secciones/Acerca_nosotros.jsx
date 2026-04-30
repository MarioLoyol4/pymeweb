import React from 'react';
import '../../styles/components/secciones/Acerca_nosotros.css';
import { normalizarTarjetasAcercaNosotros } from '../../js/components/secciones/Acerca_nosotros.js';

export const Acerca_nosotros = ({ contenido }) => {
    const tarjetas = normalizarTarjetasAcercaNosotros(contenido);

    return (
        // TITULO SECCION ACERCA DE NOSOTROS
        <div className="diseno-conocenos">

            {/* TITULO HEADER SECCION */}
            <div className="conocenos-header">
                <h2>{contenido.titulo}</h2>
            </div>

            {/* TITULO CONTENEDOR TARJETAS */}
            <div className="conocenos-grid">
                {tarjetas.map((tarjeta, index) => (

                    // TITULO TARJETAS
                    <article className="conocenos-card" key={`${tarjeta.nombre}-${index}`}>
                        <div className="conocenos-card-media">
                            {tarjeta.foto ? (
                                <img
                                    src={tarjeta.foto}
                                    alt={tarjeta.nombre || `Foto ${index + 1}`}
                                    className="conocenos-card-image"
                                />
                            ) : (
                                <div className="conocenos-card-placeholder">SIN FOTO</div>
                            )}
                        </div>
                        
                        {/* TITULO CUERPO TARJETA */}
                        <div className="conocenos-card-body">
                            <h3>{tarjeta.nombre || 'Sin nombre'}</h3>
                            {tarjeta.descripcion && <p>{tarjeta.descripcion}</p>}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};
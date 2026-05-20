import React from 'react';
import '../../styles/components/secciones/Cabecera.css';
import { normalizarCabecera } from '../../js/components/secciones/Cabecera.js';

export const Cabecera = ({ contenido }) => {
    const { titulo, subtitulo, imagenFondo } = normalizarCabecera(contenido);
    const estiloFondo = imagenFondo ? { backgroundImage: `url(${imagenFondo})` } : undefined;
    const claseCabecera = imagenFondo ? 'diseno-cabecera cabecera-con-fondo' : 'diseno-cabecera';

    return (
        <div className={claseCabecera} style={estiloFondo}>
            {imagenFondo && <div className="cabecera-overlay" aria-hidden="true" />}
            <div className="cabecera-contenido">
                <h1>{titulo}</h1>
                <p>{subtitulo}</p>
            </div>
        </div>
    );
};
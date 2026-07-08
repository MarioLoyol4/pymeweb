import React from 'react';
import '../../styles/components/secciones/Cabecera.css';
import { normalizarCabecera } from '../../js/components/secciones/Cabecera.js';

export const Cabecera = ({ contenido }) => {
    const { titulo, subtitulo, imagenFondo, colores } = normalizarCabecera(contenido);
    const estiloFondo = imagenFondo ? { backgroundImage: `url(${imagenFondo})` } : undefined;
    const claseCabecera = imagenFondo ? 'diseno-cabecera cabecera-con-fondo' : 'diseno-cabecera';

    const estiloColores = !imagenFondo ? {
        backgroundColor: colores?.fondo,
        color: colores?.textoTitulo
    } : {};

    return (
        <div className={claseCabecera} style={imagenFondo ? estiloFondo : estiloColores}>
            {imagenFondo && <div className="cabecera-overlay" aria-hidden="true" />}
            <div className="cabecera-contenido">
                <h1 style={{color: imagenFondo ? '#ffffff' : colores.textoTitulo}}>{titulo}</h1>
                <p style={{color: imagenFondo ? '#ffffff' : colores.textoSecundario}}>{subtitulo}</p>
            </div>
        </div>
    );
};
import React from 'react';
import '../../styles/Cabecera.css';

export const Cabecera = ({ contenido }) => {
    return (
        <div className="diseno-cabecera">
            <h1>{contenido.titulo}</h1>
            <p>{contenido.subtitulo}</p>
        </div>
    );
};
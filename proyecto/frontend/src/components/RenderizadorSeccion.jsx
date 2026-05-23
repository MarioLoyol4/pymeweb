import React from 'react';
import { resolverRenderizadoSeccion } from '../js/components/RenderizadorSeccion.js';

export const RenderizadorSeccion = ({ tipoSeccion, contenidoJson, logoContenidoJson = null }) => {
    const { Componente, props } = resolverRenderizadoSeccion(
        tipoSeccion,
        contenidoJson,
        logoContenidoJson
    );

    if (!Componente) return null;

    const colores = props.contenido?.colores || {};
    
    // Configurar variables CSS dinámicamente, y asegurar que los estilos caen en el contenedor
    const styleVariables = {
        '--color-fondo': colores.fondo || undefined,
        '--color-titulo': colores.textoTitulo || undefined,
        '--color-texto': colores.textoSecundario || undefined
    };

    return (
        <div style={styleVariables} className="seccion-wrapper-personalizada">
            <Componente {...props} />
        </div>
    );
};
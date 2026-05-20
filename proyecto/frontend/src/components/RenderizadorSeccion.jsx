import React from 'react';
import { resolverRenderizadoSeccion } from '../js/components/RenderizadorSeccion.js';

export const RenderizadorSeccion = ({ tipoSeccion, contenidoJson, logoContenidoJson = null }) => {
    const { Componente, props } = resolverRenderizadoSeccion(
        tipoSeccion,
        contenidoJson,
        logoContenidoJson
    );

    if (!Componente) return null;

    return <Componente {...props} />;
};
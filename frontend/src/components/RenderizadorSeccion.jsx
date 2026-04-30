import React from 'react';
import { Logo } from './secciones/Logo';
import { Cabecera } from './secciones/Cabecera';
import { Acerca_nosotros } from './secciones/Acerca_nosotros';
import { BarraMenu } from './secciones/Barra_menu';


export const RenderizadorSeccion = ({ tipoSeccion, contenidoJson, logoContenidoJson = null }) => {
    const contenido = JSON.parse(contenidoJson);
    const logoContenido = logoContenidoJson ? JSON.parse(logoContenidoJson) : null;

    switch (tipoSeccion) {
        case 'LOGO':
            return <Logo contenido={contenido} />;
        case 'BARRA_MENU':
            return <BarraMenu contenido={contenido} logoContenido={logoContenido} />;
        case 'CABECERA':
            return <Cabecera contenido={contenido} />;
        case 'ACERCA_DE_NOSOTROS':
            return <Acerca_nosotros contenido={contenido} />;
    }
};
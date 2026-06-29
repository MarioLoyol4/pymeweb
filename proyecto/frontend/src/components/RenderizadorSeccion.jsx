import React, { useId } from 'react';
import { resolverRenderizadoSeccion } from '../js/components/RenderizadorSeccion.js';
import '../styles/components/RenderizadorSeccion.css';

export const RenderizadorSeccion = ({ tipoSeccion, contenidoJson, logoContenidoJson = null }) => {
    const uniqueIdObj = useId();
    const idSeccion = `sec-${uniqueIdObj.replace(/:/g, "")}`;

    const { Componente, props } = resolverRenderizadoSeccion(
        tipoSeccion,
        contenidoJson,
        logoContenidoJson
    );

    if (!Componente) return null;

    const colores = props.contenido?.colores || {};
    const estilosTexto = props.contenido?.estilosTexto || {};
    
    // Configurar variables CSS dinámicamente, y asegurar que los estilos caen en el contenedor
    const styleVariables = {
        '--color-fondo': colores.fondo || undefined,
        '--color-titulo': colores.textoTitulo || undefined,
        '--color-texto': colores.textoSecundario || undefined
    };

    // Soporte para altura personalizada de la sección. Acepta número (px) o cadena (ej: '20rem' o '300px').
    const altura = props.contenido?.altura;
    let alturaCss;
    if (altura !== undefined && altura !== null && altura !== '') {
        if (typeof altura === 'number') alturaCss = `${altura}px`;
        else if (/^\d+$/.test(String(altura))) alturaCss = `${altura}px`;
        else alturaCss = String(altura);
        styleVariables['--seccion-altura'] = alturaCss;
    }

    // Soporte para límites mínimos (min-height)
    const minAltura = props.contenido?.minAltura;
    if (minAltura !== undefined && minAltura !== null && minAltura !== '') {
        if (typeof minAltura === 'number' || /^\d+$/.test(String(minAltura))) styleVariables['--seccion-min-height'] = `${minAltura}px`;
        else styleVariables['--seccion-min-height'] = String(minAltura);
    }

    // Si no se proporciona minAltura, calcular un valor por defecto según el tipo y el contenido
    if (minAltura === undefined || minAltura === null || minAltura === '') {
        const computeDefaultMinHeight = (tipo, contenido) => {
            const t = String(tipo || '').toUpperCase();
            if (t === 'CABECERA') return 600;
            if (t === 'BARRA_MENU') return 60;
            if (t === 'LOGO') return 80;
            if (t === 'ACERCA_DE_NOSOTROS') {
                const tarjetas = Array.isArray(contenido?.tarjetas) ? contenido.tarjetas.length : 0;
                return Math.max(280, tarjetas * 160);
            }
            if (t === 'SERVICIOS') {
                const servicios = Array.isArray(contenido?.servicios) ? contenido.servicios.length : 0;
                return servicios > 0 ? Math.max(300, servicios * 120) : 360;
            }
            if (t === 'PRODUCTOS') return 360;
            if (t === 'CONTACTO') return 300;
            if (t === 'REDES_SOCIALES') return 180;
            return 200;
        };

        const defaultMin = computeDefaultMinHeight(tipoSeccion, props.contenido || {});
        styleVariables['--seccion-min-height'] = `${defaultMin}px`;
    }

    // Añadir clase por tipo de sección para permitir reglas CSS específicas por sección
    const tipoClass = `tipo-${String(tipoSeccion || '').replace(/\s+/g, '_')}`;

    // Mapear estilosTexto a variables CSS en el wrapper (evita inyectar <style> dinámico)
    if (estilosTexto.alineacionTitulo) styleVariables['--seccion-titulo-align'] = estilosTexto.alineacionTitulo;
    if (estilosTexto.transformacionTitulo) styleVariables['--seccion-titulo-transform'] = estilosTexto.transformacionTitulo;
    if (estilosTexto.alineacionTexto) styleVariables['--seccion-texto-align'] = estilosTexto.alineacionTexto;
    if (estilosTexto.transformacionTexto) styleVariables['--seccion-texto-transform'] = estilosTexto.transformacionTexto;

    return (
        <div id={idSeccion} style={styleVariables} className={`seccion-wrapper-personalizada ${tipoClass}`}>
            <Componente {...props} />
        </div>
    );
};
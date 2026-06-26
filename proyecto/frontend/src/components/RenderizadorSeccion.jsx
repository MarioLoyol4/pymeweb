import React, { useId } from 'react';
import { resolverRenderizadoSeccion } from '../js/components/RenderizadorSeccion.js';

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

    return (
        <div id={idSeccion} style={styleVariables} className="seccion-wrapper-personalizada">
            {(estilosTexto.alineacionTitulo || estilosTexto.transformacionTitulo || estilosTexto.alineacionTexto || estilosTexto.transformacionTexto) && (
                <style>
                    {`
                        ${estilosTexto.alineacionTitulo ? `#${idSeccion} h1, #${idSeccion} h2, #${idSeccion} h3, #${idSeccion} h4, #${idSeccion} h5, #${idSeccion} h6 { text-align: ${estilosTexto.alineacionTitulo} !important; }` : ''}
                        ${estilosTexto.transformacionTitulo ? `#${idSeccion} h1, #${idSeccion} h2, #${idSeccion} h3, #${idSeccion} h4, #${idSeccion} h5, #${idSeccion} h6 { text-transform: ${estilosTexto.transformacionTitulo} !important; }` : ''}
                        ${estilosTexto.alineacionTexto ? `#${idSeccion} p, #${idSeccion} span, #${idSeccion} a:not(.btn-guardar):not(.redes-btn), #${idSeccion} li { text-align: ${estilosTexto.alineacionTexto} !important; }` : ''}
                        ${estilosTexto.transformacionTexto ? `#${idSeccion} p, #${idSeccion} span, #${idSeccion} a:not(.btn-guardar):not(.redes-btn), #${idSeccion} li { text-transform: ${estilosTexto.transformacionTexto} !important; }` : ''}
                    `}
                </style>
            )}
            <Componente {...props} />
        </div>
    );
};
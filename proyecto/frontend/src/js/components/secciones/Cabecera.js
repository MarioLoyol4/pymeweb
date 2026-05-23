export const normalizarCabecera = (contenido) => {
    return {
        titulo: contenido?.titulo || '',
        subtitulo: contenido?.subtitulo || '',
        imagenFondo: contenido?.imagenFondo || '',
        colores: {
            fondo: contenido?.colores?.fondo || '',
            textoTitulo: contenido?.colores?.textoTitulo || '',
            textoSecundario: contenido?.colores?.textoSecundario || ''
        }
    };
};

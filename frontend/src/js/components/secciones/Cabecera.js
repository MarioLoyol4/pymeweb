export const normalizarCabecera = (contenido) => {
    return {
        titulo: contenido?.titulo || '',
        subtitulo: contenido?.subtitulo || '',
        imagenFondo: contenido?.imagenFondo || ''
    };
};

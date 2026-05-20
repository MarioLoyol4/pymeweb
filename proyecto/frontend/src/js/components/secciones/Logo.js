export const normalizarLogo = (contenido, fallbackText = '') => {
    const tieneImagen = Boolean(contenido?.urlImagen);
    const texto = fallbackText || contenido?.nombreEmpresa || 'Mi Empresa';

    return { tieneImagen, texto };
};

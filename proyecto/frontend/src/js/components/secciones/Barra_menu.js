export const normalizarBarraMenu = (contenido, logoContenido = null) => {
    const enlaces = contenido?.enlaces;
    const links = enlaces ? enlaces.split(',').map((link) => link.trim()) : [];
    const tieneLogo = Boolean(logoContenido);

    return { links, tieneLogo };
};

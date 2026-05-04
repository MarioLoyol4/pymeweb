export const normalizarBarraMenu = (contenido, logoContenido = null) => {
    const enlaces = contenido?.enlaces;
    
    let links = [];
    if (Array.isArray(enlaces)) {
        links = enlaces.map((link) => link.texto || link);
    } else if (typeof enlaces === 'string') {
        links = enlaces.split(',').map((link) => link.trim()).filter(Boolean);
    }
    
    const tieneLogo = Boolean(logoContenido);

    return { links, tieneLogo };
};
const obtenerCampo = (contenido, claves) => {
    for (const clave of claves) {
        const valor = contenido?.[clave];
        if (typeof valor === 'string' && valor.trim() !== '') {
            return valor.trim();
        }
    }
    return '';
};

export const normalizarRedesSociales = (contenido = {}) => {
    const seguro = contenido && typeof contenido === 'object' ? contenido : {};

    return {
        facebook: obtenerCampo(seguro, ['facebook', 'facebookUrl', 'fb']),
        instagram: obtenerCampo(seguro, ['instagram', 'instagramUrl', 'ig']),
        whatsapp: obtenerCampo(seguro, ['whatsapp', 'whatsappUrl', 'wa'])
    };
};

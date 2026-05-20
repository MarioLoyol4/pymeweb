const obtenerCampo = (contenido, claves) => {
    for (const clave of claves) {
        const valor = contenido?.[clave];
        if (typeof valor === 'string' && valor.trim() !== '') {
            return valor;
        }
    }
    return '';
};

export const normalizarContacto = (contenido = {}) => {
    const seguro = contenido && typeof contenido === 'object' ? contenido : {};

    const titulo = obtenerCampo(seguro, ['titulo']) || 'Contacto';
    const descripcion = obtenerCampo(seguro, ['descripcion', 'detalle', 'mensaje']);
    const telefono = obtenerCampo(seguro, ['telefono', 'telefonoFijo', 'celular', 'movil']);
    const email = obtenerCampo(seguro, ['email', 'correo', 'mail']);
    const direccion = obtenerCampo(seguro, ['direccion', 'ubicacion', 'direccionFisica']);
    const whatsapp = obtenerCampo(seguro, ['whatsapp', 'whatsApp', 'wa']);
    const horario = obtenerCampo(seguro, ['horario', 'horarios']);
    const mapaUrl = obtenerCampo(seguro, ['mapaUrl', 'mapa', 'mapaEmbed', 'mapaIframe', 'mapaIFrame', 'mapa_url']);

    return {
        titulo,
        descripcion,
        telefono,
        email,
        direccion,
        whatsapp,
        horario,
        mapaUrl
    };
};

export const normalizarTarjetasAcercaNosotros = (contenido) => {
    let tarjetas = [];

    if (Array.isArray(contenido.tarjetas)) {
        tarjetas = contenido.tarjetas;
    } else if (typeof contenido.tarjetas === 'string') {
        try {
            const parsed = JSON.parse(contenido.tarjetas);
            if (Array.isArray(parsed)) {
                tarjetas = parsed;
            }
        } catch {
            tarjetas = [];
        }
    }

    if (!tarjetas.length) {
        tarjetas = [
            {
                nombre: contenido.nombre || '',
                descripcion: contenido.descripcion || '',
                foto: contenido.foto || contenido.fotoUrl || contenido.imagen || contenido.urlImagen || ''
            }
        ];
    }

    return tarjetas.map((tarjeta) => ({
        nombre: tarjeta.nombre || tarjeta.titulo || '',
        descripcion: tarjeta.descripcion || tarjeta.bio || '',
        foto: tarjeta.foto || tarjeta.fotoUrl || tarjeta.imagen || tarjeta.urlImagen || ''
    }));
};

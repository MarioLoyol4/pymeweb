export const normalizarServicios = (contenido = {}) => {
    const titulo = contenido?.titulo || 'Servicios';
    const descripcion = contenido?.descripcion || '';
    let servicios = [];

    const valorServicios = contenido?.servicios;

    if (Array.isArray(valorServicios)) {
        servicios = valorServicios;
    } else if (typeof valorServicios === 'string') {
        try {
            const parsed = JSON.parse(valorServicios);
            if (Array.isArray(parsed)) {
                servicios = parsed;
            } else if (parsed && typeof parsed === 'object') {
                servicios = [parsed];
            }
        } catch {
            const partes = valorServicios.split(',').map((item) => item.trim()).filter(Boolean);
            servicios = partes.map((item) => ({ titulo: item }));
        }
    }

    if (!servicios.length) {
        servicios = [{ titulo: 'Servicio 1', descripcion: '' }];
    }

    const serviciosNormalizados = servicios.map((servicio, index) => {
        const base = typeof servicio === 'string' ? { titulo: servicio } : (servicio || {});

        return {
            titulo: base.titulo || base.nombre || `Servicio ${index + 1}`,
            descripcion: base.descripcion || base.detalle || '',
            icono: base.icono || base.iconoUrl || base.imagen || base.urlImagen || ''
        };
    });

    return {
        titulo,
        descripcion,
        servicios: serviciosNormalizados
    };
};

export const obtenerPasoCarrusel = (contenedor) => {
    if (!contenedor) return 0;
    const tarjeta = contenedor.querySelector('.servicio-card');
    if (!tarjeta) return 0;
    const ancho = tarjeta.getBoundingClientRect().width;
    const estilos = window.getComputedStyle(contenedor);
    const gap = parseFloat(estilos.gap || estilos.columnGap || '0');
    return ancho + gap;
};

export const limitarIndice = (indice, total) => {
    if (!total) return 0;
    return Math.max(0, Math.min(total - 1, indice));
};

export const desplazarCarrusel = (contenedor, indice, total) => {
    if (!contenedor) return null;
    const paso = obtenerPasoCarrusel(contenedor);
    if (!paso) return null;
    const objetivo = limitarIndice(indice, total);
    contenedor.scrollTo({ left: paso * objetivo, behavior: 'smooth' });
    return objetivo;
};

export const obtenerIndiceDesdeScroll = (contenedor, total) => {
    if (!contenedor) return 0;
    const paso = obtenerPasoCarrusel(contenedor);
    if (!paso) return 0;
    const siguiente = Math.round(contenedor.scrollLeft / paso);
    return limitarIndice(siguiente, total);
};

export const obtenerPaginaDesdeScroll = (contenedor, porVista, totalPaginas) => {
    if (!contenedor) return 0;
    const paso = obtenerPasoCarrusel(contenedor);
    if (!paso || !porVista) return 0;
    const anchoPagina = paso * porVista;
    if (!anchoPagina) return 0;
    const pagina = Math.round(contenedor.scrollLeft / anchoPagina);
    const maxPaginas = Math.max(1, totalPaginas || 1);
    return Math.max(0, Math.min(maxPaginas - 1, pagina));
};

export const reiniciarCarrusel = (contenedor) => {
    if (!contenedor) return;
    contenedor.scrollTo({ left: 0 });
};

export const crearModeloServicios = (servicios = []) => {
    return servicios.map((servicio, index) => ({
        ...servicio,
        key: `${servicio.titulo || 'Servicio'}-${index}`,
        variante: index % 3
    }));
};

export const calcularEstadoCarrusel = (indiceActivo, total) => {
    return {
        mostrarControles: total > 1,
        anteriorDeshabilitado: indiceActivo <= 0,
        siguienteDeshabilitado: indiceActivo >= total - 1
    };
};

export const calcularServiciosPorVista = (ancho) => {
    if (ancho <= 640) return 1;
    if (ancho <= 960) return 2;
    return 4;
};

export const calcularTotalPaginas = (total, porVista) => {
    if (!total) return 1;
    return Math.max(1, Math.ceil(total / porVista));
};

export const calcularPaginaActiva = (indiceActivo, porVista) => {
    if (!porVista) return 0;
    return Math.floor(indiceActivo / porVista);
};

export const obtenerIndicePorPagina = (pagina, porVista, total) => {
    const indice = pagina * porVista;
    return limitarIndice(indice, total);
};

export const calcularEstadoPaginas = (paginaActiva, totalPaginas) => {
    return {
        mostrarControles: totalPaginas > 1,
        anteriorDeshabilitado: paginaActiva <= 0,
        siguienteDeshabilitado: paginaActiva >= totalPaginas - 1
    };
};

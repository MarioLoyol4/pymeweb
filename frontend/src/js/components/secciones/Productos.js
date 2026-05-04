export const normalizarProductos = (contenido) => {
    const datos = contenido || {};
    const titulo = datos.titulo || 'Productos';
    const descripcion = datos.descripcion || '';
    const lista = Array.isArray(datos.productos) ? datos.productos : (typeof datos.productos === 'string' ? [] : []);

    // Normalizar cada producto y asignar keys
    const productos = (lista || []).map((item, index) => {
        if (typeof item === 'string') {
            return { key: `p-${index}`, titulo: item };
        }

        return {
            key: item.id || item.key || `p-${index}`,
            titulo: item.titulo || item.nombre || '',
            descripcion: item.descripcion || item.desc || '',
            imagen: item.imagen || item.image || '',
            precio: item.precio || item.price || ''
        };
    });

    return { titulo, descripcion, productos };
};

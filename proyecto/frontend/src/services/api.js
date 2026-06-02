import apiClient from './apiClient';

const normalizarSecciones = (data) => {
    if (Array.isArray(data)) {
        return data;
    }

    if (data?.data && Array.isArray(data.data)) {
        return data.data;
    }

    if (data?.secciones && Array.isArray(data.secciones)) {
        return data.secciones;
    }

    if (data?.content && Array.isArray(data.content)) {
        return data.content;
    }

    if (data?._embedded?.secciones && Array.isArray(data._embedded.secciones)) {
        return data._embedded.secciones;
    }

    return [];
};

export const apiSaaS = {
    obtenerSeccionesPorNegocio: async (negocioId) => {
        try {
            const { data } = await apiClient.get(`/secciones/negocio/${negocioId}`);
            return normalizarSecciones(data);
        } catch (error) {
            console.error('Error en la API:', error);
            return [];
        }
    },

    creaSeccion: async (negocioId,datosNuevaSeccion) => {
        try {
            const { data } = await apiClient.post(
                `/secciones/negocio/${negocioId}`,
                datosNuevaSeccion
            );
            return data;
        } catch (error) {
            console.error('Error en la API:', error);
            return null;
        }
    },

    actualizarSeccion: async (idSeccion, datosActualizados) => {
        try {
            const { data } = await apiClient.put(`/secciones/${idSeccion}`, datosActualizados);
            return data;
        } catch (error) {
            console.error('Error en la API:', error);
            return null;
        }
    }
};
export const apiProductos = {
   
    obtenerProductos: async () => {
        try {
            const { data } = await apiClient.get('/productos');
            return data;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    },

   
    obtenerProductoPorId: async (id) => {
        try {
            const { data } = await apiClient.get(`/productos/${id}`);
            return data;
        } catch (error) {
            console.error('Error al obtener producto:', error);
            return null;
        }
    },

    
    crearProducto: async (nuevoProducto) => {
        try {
            const { data } = await apiClient.post('/productos', nuevoProducto);
            return data;
        } catch (error) {
            console.error('Error al crear producto:', error);
            return null;
        }
    },

    actualizarProducto: async (id, productoActualizado) => {
        try {
            const { data } = await apiClient.put(`/productos/${id}`, productoActualizado);
            return data;
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            return null;
        }
    },


    eliminarProducto: async (id) => {
        try {
            await apiClient.delete(`/productos/${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            return false;
        }
    }
};

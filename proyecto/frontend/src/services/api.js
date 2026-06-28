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
    obtenerSeccionesPorSlug: async (slug) => {
        try {
            const { data } = await apiClient.get(`/secciones/negocio/slug/${slug}`);
            return normalizarSecciones(data);
        } catch (error) {
            console.error('Error en la API:', error);
            return [];
        }
    },

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
const API_URL = 'http://localhost:8080/api';

export const apiSaaS = {
    obtenerSecciones: async (idConfiguracion) => {
        try {
            const respuesta = await fetch(`${API_URL}/secciones/configuracion/${idConfiguracion}`);
            if (!respuesta.ok) {
                throw new Error('Error al obtener las secciones');
            }
            return await respuesta.json();
           
        } catch (error) {
            console.error('Error en la API:', error);
            return [];
        }
    }
};
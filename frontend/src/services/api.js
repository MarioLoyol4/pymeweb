import { act } from "react";

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
    },

    creaSeccion: async (idConfiguracion,datosNuevaSeccion) => {
        try {
            const respuesta = await fetch(`${API_URL}/secciones/configuracion/${idConfiguracion}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosNuevaSeccion)
            });
            if (!respuesta.ok) {
                throw new Error('Error al crear la sección');
            }
            return await respuesta.json();
        } catch (error) {
            console.error('Error en la API:', error);
            return null;
        }
    },

    actualizarSeccion: async (idSeccion, datosActualizados) => {
        try {
            const respuesta = await fetch(`${API_URL}/secciones/${idSeccion}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosActualizados)
            });
            if (!respuesta.ok) {
                throw new Error('Error al actualizar la sección');
            }
            return await respuesta.json();
        } catch (error) {
            console.error('Error en la API:', error);
            return null;
        }
    }
};
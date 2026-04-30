import { useEffect, useState } from 'react';
import { apiSaaS } from '../../services/api';

export const usePaginaPublica = (id) => {
    const [secciones, setSecciones] = useState([]);

    useEffect(() => {
        const cargarPagina = async () => {
            const datos = await apiSaaS.obtenerSecciones(id || 1);
            setSecciones(datos);
        };
        cargarPagina();
    }, [id]);

    const seccionesOrdenadas = [...secciones].sort((a, b) => a.orden - b.orden);
    const logoSeccion = seccionesOrdenadas.find((s) => s.tipoSeccion === 'LOGO');
    const barraMenuSeccion = seccionesOrdenadas.find((s) => s.tipoSeccion === 'BARRA_MENU');
    const combinarLogoEnMenu = Boolean(logoSeccion && barraMenuSeccion);

    return {
        seccionesOrdenadas,
        logoSeccion,
        barraMenuSeccion,
        combinarLogoEnMenu
    };
};

import { useEffect, useState } from 'react';
import { apiSaaS } from '../../services/api';

export const usePaginaPublica = (slug) => {
    const [secciones, setSecciones] = useState([]);

    useEffect(() => {
        const cargarPagina = async () => {
            if (!slug) {
                setSecciones([]);
                return;
            }

            const datos = await apiSaaS.obtenerSeccionesPorSlug(slug);
            setSecciones(datos);
        };
        cargarPagina();
    }, [slug]);

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

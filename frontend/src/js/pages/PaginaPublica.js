import { useEffect, useState } from 'react';
import { apiSaaS } from '../../services/api';

export const usePaginaPublica = (idNegocio) => {
    const [secciones, setSecciones] = useState([]);

    useEffect(() => {
        const cargarPagina = async () => {
            if (!idNegocio) {
                setSecciones([]);
                return;
            }

            const datos = await apiSaaS.obtenerSeccionesPorNegocio(idNegocio);
            setSecciones(datos);
        };
        cargarPagina();
    }, [idNegocio]);

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

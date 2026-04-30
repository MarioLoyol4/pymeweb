import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Por si luego quieres usar /pagina/1, /pagina/2
import { apiSaaS } from '../services/api';
import { RenderizadorSeccion } from '../components/RenderizadorSeccion';
import '../styles/PaginaPublica.css'; // Estilos específicos para la página pública

const PaginaPublica = () => {
    const [secciones, setSecciones] = useState([]);
    const { id } = useParams(); // Obtiene el ID de la URL

    useEffect(() => {
        const cargarPagina = async () => {
            // Usamos el ID 1 por defecto si no viene en la URL
            const datos = await apiSaaS.obtenerSecciones(id || 1);
            setSecciones(datos);
        };
        cargarPagina();
    }, [id]);

    const seccionesOrdenadas = [...secciones].sort((a, b) => a.orden - b.orden);
    const logoSeccion = seccionesOrdenadas.find(s => s.tipoSeccion === 'LOGO');
    const barraMenuSeccion = seccionesOrdenadas.find(s => s.tipoSeccion === 'BARRA_MENU');
    const combinarLogoEnMenu = Boolean(logoSeccion && barraMenuSeccion);

    return (
        <div className="public-site-wrapper">
            {seccionesOrdenadas.map(seccion => {
                if (combinarLogoEnMenu && seccion.tipoSeccion === 'LOGO') {
                    return null;
                }

                const esBarraMenu = seccion.tipoSeccion === 'BARRA_MENU';
                const contenidoJson = esBarraMenu && combinarLogoEnMenu
                    ? barraMenuSeccion.contenidoJson
                    : seccion.contenidoJson;
                const logoContenidoJson = esBarraMenu && combinarLogoEnMenu
                    ? logoSeccion.contenidoJson
                    : null;

                return (
                    <div key={seccion.idSeccion} id={seccion.tipoSeccion}>
                        <RenderizadorSeccion
                            tipoSeccion={seccion.tipoSeccion}
                            contenidoJson={contenidoJson}
                            logoContenidoJson={logoContenidoJson}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default PaginaPublica;
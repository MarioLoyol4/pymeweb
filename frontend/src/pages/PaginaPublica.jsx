import React from 'react';
import { useParams } from 'react-router-dom';
import { RenderizadorSeccion } from '../components/RenderizadorSeccion';
import { usePaginaPublica } from '../js/pages/PaginaPublica.js';
import '../styles/pages/PaginaPublica.css';

const PaginaPublica = () => {
    const { idNegocio } = useParams();
    const {
        seccionesOrdenadas,
        logoSeccion,
        barraMenuSeccion,
        combinarLogoEnMenu
    } = usePaginaPublica(idNegocio);

    return (
        // TITULO LAYOUT GENERAL DE LA PAGINA PUBLICA
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
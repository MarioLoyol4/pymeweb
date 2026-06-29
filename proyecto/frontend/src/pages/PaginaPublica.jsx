import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RenderizadorSeccion } from '../components/RenderizadorSeccion';
import { usePaginaPublica } from '../js/pages/PaginaPublica.js';
import { getToken } from '../services/authStorage';
import { getSlug } from '../services/authService';
import '../styles/pages/PaginaPublica.css';

const PaginaPublica = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const {
        seccionesOrdenadas,
        logoSeccion,
        barraMenuSeccion,
        combinarLogoEnMenu
    } = usePaginaPublica(slug);

    const token = getToken();
    const slugUsuario = getSlug();
    const esDuenio = token && slugUsuario === slug;

    return (
        <div className="public-site-wrapper">
            {esDuenio && (
                <div className="btn-editar-wrapper">
                    <button
                        className="btn-editar-pagina"
                        onClick={() => navigate('/editor')}
                    >
                        ✏️ Editar página
                    </button>
                </div>
            )}

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

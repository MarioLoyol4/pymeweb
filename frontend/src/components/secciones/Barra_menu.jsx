import React from 'react';
import '../../styles/components/secciones/Barra_menu.css';
import { Logo } from './Logo';
import { normalizarBarraMenu } from '../../js/components/secciones/Barra_menu.js';

export const BarraMenu = ({ contenido, logoContenido = null }) => {
    const { links, tieneLogo } = normalizarBarraMenu(contenido, logoContenido);

    return (
        // TITULO SECCION BARRA DE MENU
        <nav className="diseno-barramenu">
            {tieneLogo ? (
                <Logo contenido={logoContenido} variant="inline" fallbackText={contenido.textoLogo} />
            ) : (
                // TITULO TEXTO LOGO EN BARRA MENU
                <h2 className="barramenu-logo-texto">
                    {contenido.textoLogo || "Mi Empresa"}
                </h2>
            )}

            {/* TITULO LINKS BARRA MENU */}
            <ul className="barramenu-links">
                {links.map((link, index) => {
                    const idDestino = `#${link.replace(/ /g, '_').toUpperCase()}`;

                    return (
                        <li key={index}>
                            <a href={idDestino}>{link}</a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};
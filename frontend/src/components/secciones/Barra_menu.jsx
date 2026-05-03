import React, { useState } from 'react';
import '../../styles/components/secciones/Barra_menu.css';
import { Logo } from './Logo';
import { normalizarBarraMenu } from '../../js/components/secciones/Barra_menu.js';
import { logout } from '../../services/authService';
import { getToken } from '../../services/authStorage';

export const BarraMenu = ({ contenido, logoContenido = null }) => {
    const { links, tieneLogo } = normalizarBarraMenu(contenido, logoContenido);
    const [tieneSesion, setTieneSesion] = useState(Boolean(getToken()));

    const manejarCerrarSesion = () => {
        logout();
        setTieneSesion(false);
    };

    return (
        // TITULO SECCION BARRA DE MENU
        <nav className="diseno-barramenu">
            <div className="barramenu-brand">
                {tieneLogo ? (
                    <Logo contenido={logoContenido} variant="inline" fallbackText={contenido.textoLogo} />
                ) : (
                    // TITULO TEXTO LOGO EN BARRA MENU
                    <h2 className="barramenu-logo-texto">
                        {contenido.textoLogo || "Mi Empresa"}
                    </h2>
                )}
            </div>

            <div className="barramenu-actions">
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
                {tieneSesion && (
                    <button
                        type="button"
                        className="barramenu-logout"
                        onClick={manejarCerrarSesion}
                    >
                        CERRAR SESION
                    </button>
                )}
            </div>
        </nav>
    );
};
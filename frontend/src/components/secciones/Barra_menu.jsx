import React from 'react';
import '../../styles/Barra_menu.css';
import { Logo } from './Logo';

export const BarraMenu = ({ contenido, logoContenido = null }) => {
    const links = contenido.enlaces ? contenido.enlaces.split(',').map(l => l.trim()) : [];
    const tieneLogo = Boolean(logoContenido);

    return (
        <nav className="diseno-barramenu">
            {tieneLogo ? (
                <Logo contenido={logoContenido} variant="inline" fallbackText={contenido.textoLogo} />
            ) : (
                <h2 className="barramenu-logo-texto">
                    {contenido.textoLogo || "Mi Empresa"}
                </h2>
            )}

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
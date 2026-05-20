import React from 'react';
import '../../styles/components/secciones/Logo.css';
import { normalizarLogo } from '../../js/components/secciones/Logo.js';

export const Logo = ({ contenido, variant = 'default', fallbackText = '' }) => {
    const { tieneImagen, texto } = normalizarLogo(contenido, fallbackText);

    if (variant === 'inline') {
        return (
            // TITULO VARIANTE INLINE LOGO
            <div className="logo-inline">
                {tieneImagen && (
                    // TITULO IMAGEN VARIANTE INLINE
                    <img src={contenido.urlImagen} alt={texto} className="logo-inline-image" />
                )}
                {/* TITULO TEXTO VARIANTE INLINE */}
                <span className="logo-inline-text">{texto}</span>
            </div>
        );
    }

    return (
        // TITULO SECCION LOGO
        <div className="diseno-logo">
            {tieneImagen ? (
                // TITULO IMAGEN SECCION LOGO
                <img src={contenido.urlImagen} alt="Logo" className="logo-imagen" />
            ) : (
                <div className="logo-placeholder">SIN LOGO</div>
            )}
        </div>
    );
};
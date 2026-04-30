import React from 'react';
import '../../styles/Logo.css';

export const Logo = ({ contenido, variant = 'default', fallbackText = '' }) => {
    const tieneImagen = Boolean(contenido?.urlImagen);
    const texto = fallbackText || contenido?.nombreEmpresa || 'Mi Empresa';

    if (variant === 'inline') {
        return (
            <div className="logo-inline">
                {tieneImagen && (
                    <img src={contenido.urlImagen} alt={texto} className="logo-inline-image" />
                )}
                <span className="logo-inline-text">{texto}</span>
            </div>
        );
    }

    return (
        <div className="diseno-logo">
            {tieneImagen ? (
                <img src={contenido.urlImagen} alt="Logo" className="logo-imagen" />
            ) : (
                <div className="logo-placeholder">SIN LOGO</div>
            )}
        </div>
    );
};
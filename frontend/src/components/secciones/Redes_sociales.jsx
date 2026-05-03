import React from 'react';
import '../../styles/components/secciones/Redes_sociales.css';
import { normalizarRedesSociales } from '../../js/components/secciones/Redes_sociales.js';

const crearUrlFacebook = (valor) => {
    if (!valor) return '';
    const limpio = valor.trim();
    if (!limpio) return '';
    if (limpio.startsWith('http://') || limpio.startsWith('https://')) {
        return limpio;
    }
    const handle = limpio.replace(/^@/, '').replace(/\s+/g, '');
    return handle ? `https://facebook.com/${handle}` : '';
};

const crearUrlInstagram = (valor) => {
    if (!valor) return '';
    const limpio = valor.trim();
    if (!limpio) return '';
    if (limpio.startsWith('http://') || limpio.startsWith('https://')) {
        return limpio;
    }
    const handle = limpio.replace(/^@/, '').replace(/\s+/g, '');
    return handle ? `https://instagram.com/${handle}` : '';
};

const crearUrlWhatsApp = (valor) => {
    if (!valor) return '';
    const limpio = valor.trim();
    if (!limpio) return '';
    if (limpio.startsWith('http://') || limpio.startsWith('https://')) {
        return limpio;
    }
    const numero = limpio.replace(/\D/g, '');
    return numero ? `https://wa.me/${numero}` : '';
};

const IconoFacebook = () => (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path
            d="M29.6 16h5.4v-6h-5.4c-5.8 0-9.6 3.6-9.6 9.9V24h-5v6h5v12h6V30h6.1l.9-6H26v-3.6c0-2.2.9-4.4 3.6-4.4z"
            fill="currentColor"
        />
    </svg>
);

const IconoInstagram = () => (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <rect
            x="12"
            y="12"
            width="24"
            height="24"
            rx="7"
            ry="7"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
        />
        <circle
            cx="24"
            cy="24"
            r="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
        />
        <circle cx="32.5" cy="15.5" r="2" fill="currentColor" />
    </svg>
);

const IconoWhatsApp = () => (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path
            d="M24 12c-6.6 0-12 5.4-12 12 0 2.1.6 4.2 1.6 6l-2 6 6.1-2c1.7 1 3.6 1.6 5.9 1.6 6.6 0 12-5.4 12-12s-5.4-12-12-12z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
        />
        <path
            d="M20.6 19c.4-1 1.2-1.8 2.2-2.2l2.1.8c.7.3 1.1 1.1.9 1.8l-.4 1.2c.6 1.2 1.6 2.2 2.8 2.8l1.2-.4c.7-.2 1.5.2 1.8.9l.8 2.1c-.4 1-1.2 1.8-2.2 2.2-1.3.5-2.7.4-3.9-.3-2.9-1.6-5.2-3.9-6.8-6.8-.7-1.2-.8-2.6-.3-3.9z"
            fill="currentColor"
        />
    </svg>
);

export const Redes_sociales = ({ contenido }) => {
    const { facebook, instagram, whatsapp } = normalizarRedesSociales(contenido);

    const redes = [
        {
            key: 'facebook',
            label: 'Facebook',
            href: crearUrlFacebook(facebook),
            clase: 'redes-btn--facebook',
            icono: <IconoFacebook />
        },
        {
            key: 'instagram',
            label: 'Instagram',
            href: crearUrlInstagram(instagram),
            clase: 'redes-btn--instagram',
            icono: <IconoInstagram />
        },
        {
            key: 'whatsapp',
            label: 'WhatsApp',
            href: crearUrlWhatsApp(whatsapp),
            clase: 'redes-btn--whatsapp',
            icono: <IconoWhatsApp />
        }
    ].filter((item) => item.href);

    if (!redes.length) return null;

    return (
        // TITULO SECCION REDES SOCIALES
        <div className="redes-float" aria-label="Redes sociales">
            {redes.map((red) => (
                <a
                    key={red.key}
                    className={`redes-btn ${red.clase}`}
                    href={red.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Abrir ${red.label}`}
                >
                    {red.icono}
                    <span className="redes-sr-only">{red.label}</span>
                </a>
            ))}
        </div>
    );
};

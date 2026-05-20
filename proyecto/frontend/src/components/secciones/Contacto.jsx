import React from 'react';
import '../../styles/components/secciones/Contacto.css';
import { normalizarContacto } from '../../js/components/secciones/Contacto.js';

const obtenerLinkWhatsApp = (valor) => {
    if (!valor) return '';
    if (valor.startsWith('http://') || valor.startsWith('https://')) {
        return valor;
    }
    const numero = valor.replace(/\D/g, '');
    return numero ? `https://wa.me/${numero}` : '';
};

const obtenerTelefonoHref = (telefono) => {
    if (!telefono) return '';
    const limpio = telefono.replace(/\s+/g, '');
    return `tel:${limpio}`;
};

const esMapaEmbedValido = (valor) => {
    if (!valor) return false;
    if (!valor.startsWith('https://')) return false;
    try {
        const url = new URL(valor);
        const hostOk = url.hostname === 'www.google.com'
            || url.hostname === 'maps.google.com'
            || url.hostname === 'google.com';
        if (!hostOk) return false;
        const ruta = url.pathname || '';
        if (ruta.startsWith('/maps/embed') || ruta.startsWith('/maps/d/embed')) {
            return true;
        }
        return url.searchParams.get('output') === 'embed';
    } catch {
        return false;
    }
};

const construirMapaDesdeConsulta = (consulta) => {
    const texto = (consulta || '').trim();
    if (!texto) return '';
    const encoded = encodeURIComponent(texto);
    return `https://maps.google.com/maps?q=${encoded}&output=embed`;
};

const normalizarMapaEmbed = (valor, direccion) => {
    const limpio = (valor || '').trim();
    if (!limpio) {
        return { url: '', esValido: false };
    }

    if (esMapaEmbedValido(limpio)) {
        return { url: limpio, esValido: true };
    }

    const esLinkCorto = /^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)\//i.test(limpio);
    if (esLinkCorto) {
        const porDireccion = construirMapaDesdeConsulta(direccion);
        return porDireccion
            ? { url: porDireccion, esValido: true }
            : { url: '', esValido: false };
    }

    try {
        const url = new URL(limpio);
        const hostOk = url.hostname === 'www.google.com'
            || url.hostname === 'maps.google.com'
            || url.hostname === 'google.com';

        if (hostOk) {
            const q = url.searchParams.get('q') || url.searchParams.get('query');
            if (q) {
                const porQuery = construirMapaDesdeConsulta(q);
                if (porQuery) return { url: porQuery, esValido: true };
            }

            const matchPlace = url.pathname.match(/\/place\/([^/]+)/i);
            if (matchPlace) {
                const lugar = decodeURIComponent(matchPlace[1]).replace(/\+/g, ' ');
                const porLugar = construirMapaDesdeConsulta(lugar);
                if (porLugar) return { url: porLugar, esValido: true };
            }

            const matchCoords = url.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
            if (matchCoords) {
                const porCoords = construirMapaDesdeConsulta(`${matchCoords[1]},${matchCoords[2]}`);
                if (porCoords) return { url: porCoords, esValido: true };
            }
        }
    } catch {
        // No-op
    }

    const fallback = construirMapaDesdeConsulta(direccion);
    if (fallback) {
        return { url: fallback, esValido: true };
    }

    return { url: '', esValido: false };
};

export const Contacto = ({ contenido }) => {
    const {
        titulo,
        descripcion,
        telefono,
        email,
        direccion,
        whatsapp,
        horario,
        mapaUrl
    } = normalizarContacto(contenido);

    const whatsappLink = obtenerLinkWhatsApp(whatsapp);
    const telefonoHref = obtenerTelefonoHref(telefono);
    const emailHref = email ? `mailto:${email}` : '';
    const mapaUrlLimpia = (mapaUrl || '').trim();
    const mapaInfo = mapaUrlLimpia
        ? normalizarMapaEmbed(mapaUrlLimpia, direccion)
        : { url: '', esValido: false };

    const tieneDatos = Boolean(telefono || email || direccion || whatsapp || horario);
    const mostrarMapa = Boolean(mapaInfo.url) && mapaInfo.esValido;
    const mostrarMapaInvalido = Boolean(mapaUrlLimpia) && !mapaInfo.esValido;

    return (
        // TITULO SECCION CONTACTO
        <section className="diseno-contacto">
            <header className="contacto-header">
                <h2>{titulo}</h2>
                {descripcion && <p>{descripcion}</p>}
            </header>

            <div className="contacto-grid">
                {tieneDatos && (
                    <div className="contacto-datos">
                        {telefono && (
                            <div className="contacto-item">
                                <span className="contacto-etiqueta">Telefono</span>
                                <a className="contacto-valor" href={telefonoHref}>{telefono}</a>
                            </div>
                        )}
                        {email && (
                            <div className="contacto-item">
                                <span className="contacto-etiqueta">Email</span>
                                <a className="contacto-valor" href={emailHref}>{email}</a>
                            </div>
                        )}
                        {direccion && (
                            <div className="contacto-item">
                                <span className="contacto-etiqueta">Direccion</span>
                                <span className="contacto-valor">{direccion}</span>
                            </div>
                        )}
                        {whatsapp && (
                            <div className="contacto-item">
                                <span className="contacto-etiqueta">WhatsApp</span>
                                {whatsappLink ? (
                                    <a className="contacto-valor" href={whatsappLink} target="_blank" rel="noreferrer">
                                        {whatsapp}
                                    </a>
                                ) : (
                                    <span className="contacto-valor">{whatsapp}</span>
                                )}
                            </div>
                        )}
                        {horario && (
                            <div className="contacto-item">
                                <span className="contacto-etiqueta">Horario</span>
                                <span className="contacto-valor">{horario}</span>
                            </div>
                        )}
                    </div>
                )}

                {mostrarMapa && (
                    <div className="contacto-mapa">
                        <iframe
                            title="Mapa de ubicacion"
                            src={mapaInfo.url}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                )}

                {mostrarMapaInvalido && (
                    <div className="contacto-mapa contacto-mapa--invalido">
                        <div className="contacto-mapa-mensaje">
                            El enlace del mapa no es valido. Usa "Insertar un mapa" o completa
                            Direccion para generar el mapa automaticamente.
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

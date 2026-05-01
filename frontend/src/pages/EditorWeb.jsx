import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RenderizadorSeccion } from '../components/RenderizadorSeccion';
import { useEditorWeb } from '../js/pages/EditorWeb.js';
import '../styles/pages/EditorWeb.css';

const EditorWeb = () => {
    const {
        negocioId,
        seccionSeleccionada,
        datosEdicion,
        tarjetasEdicion,
        serviciosEdicion,
        botonesSuperiores,
        dragItem,
        dragOverItem,
        seleccionarSeccion,
        manejarCambio,
        manejarCambioTarjeta,
        agregarTarjeta,
        eliminarTarjeta,
        manejarCambioServicio,
        agregarServicio,
        eliminarServicio,
        guardarCambios,
        manejarSoltar,
        manejarClickBoton,
        seccionesOrdenadas,
        logoSeccion,
        barraMenuSeccion,
        combinarLogoEnMenu
    } = useEditorWeb();

    const navigate = useNavigate();

    const irPaginaPublica = () => {
        if (!negocioId) return;
        navigate(`/p/${negocioId}`);
    };

    return (
        // TITULO LAYOUT GENERAL DEL EDITOR
        <div className="app-wrapper">

            {/* TITULO BARRA SUPERIOR */}
            <div className="top-toolbar">
                {botonesSuperiores.map((boton, index) => {
                    const esLogo = boton === 'LOGO';

                    return (
                        <button
                            key={index}

                        // TITULO BOTONES DE LA BARRA SUPERIOR
                        className="btn-top-section"
                            draggable={!esLogo}
                            onDragStart={() => {
                                if (!esLogo) dragItem.current = index;
                            }}
                            onDragEnter={() => (dragOverItem.current = index)}
                            onDragEnd={manejarSoltar}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => manejarClickBoton(boton)}
                        >
                            {boton}
                        </button>
                    );
                })}
                <button
                    type="button"
                    className="btn-view-public"
                    onClick={irPaginaPublica}
                    disabled={!negocioId}
                >
                    VER PAGINA
                </button>
            </div>

            {/* TITULO CONTENEDOR EDITOR */}
            <div className="editor-container">

                {/* TITULO PANEL DE PREVISTA */}
                <div className="preview-panel">

                    {/* TITULO CANVAS WEB */}
                    <div className="web-canvas">
                        {seccionesOrdenadas.map(seccion => {
                            if (combinarLogoEnMenu && seccion.tipoSeccion === 'LOGO') {
                                return null;
                            }

                            const esBarraMenu = seccion.tipoSeccion === 'BARRA_MENU';
                            const estaSeleccionada = seccionSeleccionada?.idSeccion === seccion.idSeccion
                                || (combinarLogoEnMenu && esBarraMenu && seccionSeleccionada?.idSeccion === logoSeccion?.idSeccion);

                            const contenidoJson = esBarraMenu && combinarLogoEnMenu
                                ? barraMenuSeccion.contenidoJson
                                : seccion.contenidoJson;

                            const logoContenidoJson = esBarraMenu && combinarLogoEnMenu
                                ? logoSeccion.contenidoJson
                                : null;

                            return (
                                <div
                                    key={seccion.idSeccion}
                                    id={seccion.idSeccion}
                                    onClick={() => seleccionarSeccion(seccion)}

                                    // TITULO SECCION PREVIEW
                                    className={`seccion-preview ${estaSeleccionada ? 'seleccionada' : ''}`}
                                >
                                    <RenderizadorSeccion
                                        tipoSeccion={seccion.tipoSeccion}
                                        contenidoJson={contenidoJson}
                                        logoContenidoJson={logoContenidoJson}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* TITULO PANEL DE HERRAMIENTAS */}
                <div className="tools-panel">
                    <h2 className="tools-title">Configuración</h2>
                    <hr className="tools-divider" />
                    {seccionSeleccionada ? (
                        <div>
                            <div className="input-group" style={{backgroundColor: '#e8f0f1', padding: '10px', borderRadius: '6px', marginBottom: '15px'}}>
                                <p style={{margin: 0, color: '#3A666B', fontSize: '0.9rem'}}>
                                    Editando: <strong>{seccionSeleccionada.tipoSeccion.replace(/_/g, ' ')}</strong>
                                </p>
                            </div>

                            {Object.keys(datosEdicion).filter((llave) => {
                                if (seccionSeleccionada?.tipoSeccion === 'BARRA_MENU' && llave === 'textoLogo') {
                                    return false;
                                }
                                if (seccionSeleccionada?.tipoSeccion === 'ACERCA_DE_NOSOTROS' && (
                                    llave === 'tarjetas' || llave === 'nombre' || llave === 'descripcion' || llave === 'foto'
                                )) {
                                    return false;
                                }
                                if (seccionSeleccionada?.tipoSeccion === 'SERVICIOS' && llave === 'servicios') {
                                    return false;
                                }
                                return true;
                            }).map((llave) => (
                                <div className="input-group" key={llave}>
                                    <label className="tools-label">{llave}</label>
                                    <input className="input-editor" name={llave} value={datosEdicion[llave]} onChange={manejarCambio} />
                                </div>
                            ))}
                            {seccionSeleccionada?.tipoSeccion === 'ACERCA_DE_NOSOTROS' && tarjetasEdicion.map((tarjeta, index) => (
                                <div className="input-group" key={`tarjeta-${index}`}>
                                    <label className="tools-label">Tarjeta #{index + 1} - nombre</label>
                                    <input
                                        className="input-editor"
                                        value={tarjeta.nombre}
                                        onChange={(e) => manejarCambioTarjeta(index, 'nombre', e.target.value)}
                                    />
                                    <label className="tools-label">Tarjeta #{index + 1} - descripcion</label>
                                    <input
                                        className="input-editor"
                                        value={tarjeta.descripcion}
                                        onChange={(e) => manejarCambioTarjeta(index, 'descripcion', e.target.value)}
                                    />
                                    <label className="tools-label">Tarjeta #{index + 1} - foto (URL)</label>
                                    <input
                                        className="input-editor"
                                        value={tarjeta.foto}
                                        onChange={(e) => manejarCambioTarjeta(index, 'foto', e.target.value)}
                                        placeholder="https://..."
                                    />
                                    <button
                                        type="button"
                                        className="btn-guardar"
                                        onClick={() => eliminarTarjeta(index)}
                                    >
                                        ELIMINAR TARJETA
                                    </button>
                                </div>
                            ))}
                            {seccionSeleccionada?.tipoSeccion === 'ACERCA_DE_NOSOTROS' && (
                                <button type="button" className="btn-guardar" onClick={agregarTarjeta}>
                                    AGREGAR TARJETA
                                </button>
                            )}
                            {seccionSeleccionada?.tipoSeccion === 'SERVICIOS' && serviciosEdicion.map((servicio, index) => (
                                <div className="input-group" key={`servicio-${index}`}>
                                    <label className="tools-label">Servicio #{index + 1} - titulo</label>
                                    <input
                                        className="input-editor"
                                        value={servicio.titulo}
                                        onChange={(e) => manejarCambioServicio(index, 'titulo', e.target.value)}
                                    />
                                    <label className="tools-label">Servicio #{index + 1} - descripcion</label>
                                    <input
                                        className="input-editor"
                                        value={servicio.descripcion}
                                        onChange={(e) => manejarCambioServicio(index, 'descripcion', e.target.value)}
                                    />
                                    <label className="tools-label">Servicio #{index + 1} - icono (URL)</label>
                                    <input
                                        className="input-editor"
                                        value={servicio.icono}
                                        onChange={(e) => manejarCambioServicio(index, 'icono', e.target.value)}
                                        placeholder="https://..."
                                    />
                                    <button
                                        type="button"
                                        className="btn-guardar"
                                        onClick={() => eliminarServicio(index)}
                                    >
                                        ELIMINAR SERVICIO
                                    </button>
                                </div>
                            ))}
                            {seccionSeleccionada?.tipoSeccion === 'SERVICIOS' && (
                                <button type="button" className="btn-guardar" onClick={agregarServicio}>
                                    AGREGAR SERVICIO
                                </button>
                            )}
                            <button className="btn-guardar" onClick={guardarCambios}>GUARDAR CAMBIOS</button>
                        </div>
                    ) : <p className="empty-selection-text">Selecciona una sección para editar.</p>}
                </div>
            </div>
        </div>
    );
};

export default EditorWeb;
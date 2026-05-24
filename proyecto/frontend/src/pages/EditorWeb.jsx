import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RenderizadorSeccion } from '../components/RenderizadorSeccion';
import { useEditorWeb } from '../js/pages/EditorWeb.js';
import { logout } from '../services/authService';
import '../styles/pages/EditorWeb.css';

const EditorWeb = () => {
    const {
        negocioId,
        seccionSeleccionada,
        datosEdicion,
        tarjetasEdicion,
        serviciosEdicion,
        productosEdicion,
        enlacesEdicion,
        coloresEdicion,
        estilosTextoEdicion,
        botonesSuperiores,
        dragItem,
        dragOverItem,
        seleccionarSeccion,
        manejarCambio,
        manejarCambioColor,
        manejarCambioEstilosTexto,
        manejarCambioTarjeta,
        agregarTarjeta,
        eliminarTarjeta,
        manejarCambioServicio,
        agregarServicio,
        eliminarServicio,
        manejarCambioProducto,
        agregarProducto,
        eliminarProducto,
        manejarCambioEnlace,
        agregarEnlace,
        eliminarEnlace,
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

    const manejarCerrarSesion = () => {
        logout();
        navigate('/login');
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
                <button
                    type="button"
                    className="btn-logout"
                    onClick={manejarCerrarSesion}
                >
                    CERRAR SESION
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

                            <details className="tools-accordion" open>
                                <summary>Editor de Texto & Contenido</summary>
                                <div className="tools-accordion-content">
                                    {Object.keys(datosEdicion).filter((llave) => {
                                        if (llave === 'colores') return false;
                                        if (seccionSeleccionada?.tipoSeccion === 'BARRA_MENU' && (llave === 'textoLogo' || llave === 'enlaces' || llave === 'logoTipo' || llave === 'logotipo')) {
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
                                        if (seccionSeleccionada?.tipoSeccion === 'PRODUCTOS' && llave === 'productos') {
                                            return false;
                                        }
                                        return true;
                                    }).map((llave) => (
                                        <div className="input-group" key={llave}>
                                            <label className="tools-label">{llave}</label>
                                            <input className="input-editor" name={llave} value={datosEdicion[llave]} onChange={manejarCambio} />
                                        </div>
                                    ))}
                                    {seccionSeleccionada?.tipoSeccion === 'BARRA_MENU' && enlacesEdicion.map((enlace, index) => (
                                        <div className="input-group" key={`enlace-${index}`}>
                                            <label className="tools-label">Enlace #{index + 1}</label>
                                            <input
                                                className="input-editor"
                                                value={enlace.texto}
                                                onChange={(e) => manejarCambioEnlace(index, e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="btn-guardar"
                                                onClick={() => eliminarEnlace(index)}
                                            >
                                                ELIMINAR ENLACE
                                            </button>
                                        </div>
                                    ))}
                                    {seccionSeleccionada?.tipoSeccion === 'BARRA_MENU' && (
                                        <button type="button" className="btn-guardar" onClick={agregarEnlace}>
                                            AGREGAR ENLACE
                                        </button>
                                    )}
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
                                    {seccionSeleccionada?.tipoSeccion === 'PRODUCTOS' && productosEdicion.map((producto, index) => (
                                        <div className="input-group" key={`producto-${index}`}>
                                            <label className="tools-label">Producto #{index + 1} - titulo</label>
                                            <input
                                                className="input-editor"
                                                value={producto.titulo}
                                                onChange={(e) => manejarCambioProducto(index, 'titulo', e.target.value)}
                                            />
                                            <label className="tools-label">Producto #{index + 1} - descripcion</label>
                                            <input
                                                className="input-editor"
                                                value={producto.descripcion}
                                                onChange={(e) => manejarCambioProducto(index, 'descripcion', e.target.value)}
                                            />
                                            <label className="tools-label">Producto #{index + 1} - precio</label>
                                            <input
                                                className="input-editor"
                                                value={producto.precio}
                                                onChange={(e) => manejarCambioProducto(index, 'precio', e.target.value)}
                                                placeholder="$10.000"
                                            />
                                            <label className="tools-label">Producto #{index + 1} - imagen (URL)</label>
                                            <input
                                                className="input-editor"
                                                value={producto.imagen}
                                                onChange={(e) => manejarCambioProducto(index, 'imagen', e.target.value)}
                                                placeholder="https://..."
                                            />
                                            <button
                                                type="button"
                                                className="btn-guardar"
                                                onClick={() => eliminarProducto(index)}
                                            >
                                                ELIMINAR PRODUCTO
                                            </button>
                                        </div>
                                    ))}
                                    {seccionSeleccionada?.tipoSeccion === 'PRODUCTOS' && (
                                        <button type="button" className="btn-guardar" onClick={agregarProducto}>
                                            AGREGAR PRODUCTO
                                        </button>
                                    )}
                                </div>
                            </details>

                            {seccionSeleccionada && (
                                <details className="tools-accordion">
                                    <summary>Posición y Estilo de Texto</summary>
                                    <div className="tools-accordion-content">
                                        <div className="input-group" style={{ marginBottom: '15px' }}>
                                            <strong style={{ display: 'block', marginBottom: '10px', color: '#3A666B' }}>Títulos</strong>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <span className="tools-label" style={{ margin: 0 }}>Alineación Títulos</span>
                                                    <select
                                                        className="input-editor"
                                                        value={estilosTextoEdicion.alineacionTitulo || ''}
                                                        onChange={(e) => manejarCambioEstilosTexto('alineacionTitulo', e.target.value)}
                                                    >
                                                        <option value="">Por defecto</option>
                                                        <option value="left">Izquierda</option>
                                                        <option value="center">Centro</option>
                                                        <option value="right">Derecha</option>
                                                        <option value="justify">Justificado</option>
                                                    </select>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <span className="tools-label" style={{ margin: 0 }}>Transformación Títulos</span>
                                                    <select
                                                        className="input-editor"
                                                        value={estilosTextoEdicion.transformacionTitulo || ''}
                                                        onChange={(e) => manejarCambioEstilosTexto('transformacionTitulo', e.target.value)}
                                                    >
                                                        <option value="">Ninguna</option>
                                                        <option value="uppercase">MAYÚSCULAS</option>
                                                        <option value="lowercase">minúsculas</option>
                                                        <option value="capitalize">Capitalizar Palabras</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="tools-divider" style={{ margin: '15px 0' }}/>
                                        <div className="input-group" style={{ marginBottom: 0 }}>
                                            <strong style={{ display: 'block', marginBottom: '10px', color: '#3A666B' }}>Contenidos y Textos</strong>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <span className="tools-label" style={{ margin: 0 }}>Alineación Textos</span>
                                                    <select
                                                        className="input-editor"
                                                        value={estilosTextoEdicion.alineacionTexto || ''}
                                                        onChange={(e) => manejarCambioEstilosTexto('alineacionTexto', e.target.value)}
                                                    >
                                                        <option value="">Por defecto</option>
                                                        <option value="left">Izquierda</option>
                                                        <option value="center">Centro</option>
                                                        <option value="right">Derecha</option>
                                                        <option value="justify">Justificado</option>
                                                    </select>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <span className="tools-label" style={{ margin: 0 }}>Transformación Textos</span>
                                                    <select
                                                        className="input-editor"
                                                        value={estilosTextoEdicion.transformacionTexto || ''}
                                                        onChange={(e) => manejarCambioEstilosTexto('transformacionTexto', e.target.value)}
                                                    >
                                                        <option value="">Ninguna</option>
                                                        <option value="uppercase">MAYÚSCULAS</option>
                                                        <option value="lowercase">minúsculas</option>
                                                        <option value="capitalize">Capitalizar Palabras</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </details>
                            )}

                            {seccionSeleccionada && (
                                <details className="tools-accordion">
                                    <summary>Editor Color</summary>
                                    <div className="tools-accordion-content">
                                        <div className="input-group" style={{ marginBottom: 0 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input
                                                    type="color"
                                                    value={coloresEdicion.fondo}
                                                    onChange={(e) => manejarCambioColor('fondo', e.target.value)}
                                                />
                                                <span className="tools-label" style={{ margin: 0 }}>Color de fondo</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input
                                                    type="color"
                                                    value={coloresEdicion.textoTitulo}
                                                    onChange={(e) => manejarCambioColor('textoTitulo', e.target.value)}
                                                />
                                                <span className="tools-label" style={{ margin: 0 }}>Color título</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input
                                                    type="color"
                                                    value={coloresEdicion.textoSecundario}
                                                    onChange={(e) => manejarCambioColor('textoSecundario', e.target.value)}
                                                />
                                                <span className="tools-label" style={{ margin: 0 }}>Color subtítulo</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </details>
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
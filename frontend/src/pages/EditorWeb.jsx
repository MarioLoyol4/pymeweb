import React, { useState, useEffect, useRef } from 'react';
import { apiSaaS } from '../services/api';
import { RenderizadorSeccion } from '../components/RenderizadorSeccion';
import '../styles/EditorWeb.css';

const BOTONES_BASE = [
    "LOGO", "BARRA MENÚ", "CABECERA", "ACERCA DE NOSOTROS",
    "SERVICIOS", "CONTACTO", "FRASES", "PIE DE PÁGINA",
    "REDES SOCIALES", "PRODUCTOS"
];

const TIPO_POR_BOTON = {
    "LOGO": "LOGO",
    "BARRA MENÚ": "BARRA_MENU",
    "CABECERA": "CABECERA",
    "ACERCA DE NOSOTROS": "ACERCA_DE_NOSOTROS",
    "SERVICIOS": "SERVICIOS",
    "CONTACTO": "CONTACTO",
    "FRASES": "FRASES",
    "PIE DE PÁGINA": "PIE_DE_PAGINA",
    "REDES SOCIALES": "REDES_SOCIALES",
    "PRODUCTOS": "PRODUCTOS"
};

const BOTON_POR_TIPO = Object.fromEntries(
    Object.entries(TIPO_POR_BOTON).map(([label, tipo]) => [tipo, label])
);

const obtenerTipoSeccion = (nombreBoton) => (
    TIPO_POR_BOTON[nombreBoton] || nombreBoton.replace(/ /g, '_').toUpperCase()
);

const obtenerLabelBoton = (tipoSeccion) => (
    BOTON_POR_TIPO[tipoSeccion] || tipoSeccion.replace(/_/g, ' ')
);

const EditorWeb = () => {
    const [secciones, setSecciones] = useState([]);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
    const [datosEdicion, setDatosEdicion] = useState({});
    const [tarjetasEdicion, setTarjetasEdicion] = useState([]);

    const [botonesSuperiores, setBotonesSuperiores] = useState(BOTONES_BASE);

    const dragItem = useRef(); 
    const dragOverItem = useRef(); 

    const cargarDatos = async () => {
        const datos = await apiSaaS.obtenerSecciones(1);
        setSecciones(datos);
        
        if (datos && datos.length > 0) {
            setBotonesSuperiores(prev => {
                const nombresEnUso = [...datos]
                    .sort((a,b) => a.orden - b.orden)
                    .map(s => obtenerLabelBoton(s.tipoSeccion));

                const usadosUnicos = [];
                const usadosSet = new Set();
                for (const nombre of nombresEnUso) {
                    if (!usadosSet.has(nombre)) {
                        usadosSet.add(nombre);
                        usadosUnicos.push(nombre);
                    }
                }

                const sobrantes = prev.filter(b => !usadosSet.has(b));

                const combinados = [...usadosUnicos, ...sobrantes];
                const unicos = [];
                const vistos = new Set();
                for (const nombre of combinados) {
                    if (!vistos.has(nombre)) {
                        vistos.add(nombre);
                        unicos.push(nombre);
                    }
                }

                return unicos;
            });
        }
    };

    useEffect(() => { cargarDatos(); }, []);

    const seleccionarSeccion = (seccion) => {
        setSeccionSeleccionada(seccion);
        const datos = JSON.parse(seccion.contenidoJson);
        if (seccion.tipoSeccion === 'BARRA_MENU') {
            delete datos.textoLogo;
        }
        if (seccion.tipoSeccion === 'ACERCA_DE_NOSOTROS' && !Object.prototype.hasOwnProperty.call(datos, 'foto')) {
            datos.foto = '';
        }
        if (seccion.tipoSeccion === 'ACERCA_DE_NOSOTROS') {
            let tarjetas = [];
            if (Array.isArray(datos.tarjetas)) {
                tarjetas = datos.tarjetas;
            } else if (typeof datos.tarjetas === 'string') {
                try {
                    const parsed = JSON.parse(datos.tarjetas);
                    if (Array.isArray(parsed)) {
                        tarjetas = parsed;
                    }
                } catch {
                    tarjetas = [];
                }
            }

            if (!tarjetas.length) {
                tarjetas = [
                    {
                        nombre: datos.nombre || '',
                        descripcion: datos.descripcion || '',
                        foto: datos.foto || ''
                    }
                ];
            }

            setTarjetasEdicion(tarjetas.map((tarjeta) => ({
                nombre: tarjeta.nombre || tarjeta.titulo || '',
                descripcion: tarjeta.descripcion || tarjeta.bio || '',
                foto: tarjeta.foto || tarjeta.fotoUrl || tarjeta.imagen || tarjeta.urlImagen || ''
            })));
        } else {
            setTarjetasEdicion([]);
        }
        setDatosEdicion(datos);
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatosEdicion(prev => ({ ...prev, [name]: value }));
    };

    const manejarCambioTarjeta = (index, campo, valor) => {
        setTarjetasEdicion(prev => prev.map((tarjeta, idx) => (
            idx === index ? { ...tarjeta, [campo]: valor } : tarjeta
        )));
    };

    const agregarTarjeta = () => {
        setTarjetasEdicion(prev => ([
            ...prev,
            { nombre: '', descripcion: '', foto: '' }
        ]));
    };

    const eliminarTarjeta = (index) => {
        setTarjetasEdicion(prev => prev.filter((_, idx) => idx !== index));
    };

    const guardarCambios = async () => {
        if (!seccionSeleccionada) return;
        const datosLimpios = { ...datosEdicion };
        if (seccionSeleccionada.tipoSeccion === 'BARRA_MENU') {
            delete datosLimpios.textoLogo;
        }
        if (seccionSeleccionada.tipoSeccion === 'ACERCA_DE_NOSOTROS') {
            datosLimpios.tarjetas = tarjetasEdicion.map((tarjeta) => ({
                nombre: tarjeta.nombre || '',
                descripcion: tarjeta.descripcion || '',
                foto: tarjeta.foto || ''
            }));
            delete datosLimpios.nombre;
            delete datosLimpios.descripcion;
            delete datosLimpios.foto;
            delete datosLimpios.tarjetasTexto;
        }
        const datosParaEnviar = { ...seccionSeleccionada, contenidoJson: JSON.stringify(datosLimpios) };
        const respuesta = await apiSaaS.actualizarSeccion(seccionSeleccionada.idSeccion, datosParaEnviar);
        if (respuesta) { cargarDatos(); alert("¡Cambios guardados!"); }
    };

    const agregarSeccion = async (nombreBoton) => {
        const tipoFormateado = obtenerTipoSeccion(nombreBoton);
        
        let contenidoBase = { titulo: `Nueva sección: ${nombreBoton}` };
        if (tipoFormateado === 'LOGO') contenidoBase = { urlImagen: "", nombreEmpresa: "Mi Pyme" };
        if (tipoFormateado === 'CABECERA') contenidoBase = { titulo: "¡Bienvenidos!", subtitulo: "Cuidamos a tus mascotas." };
        if (tipoFormateado === 'ACERCA_DE_NOSOTROS') contenidoBase = { titulo: "Conócenos", nombre: "Dra. Javiera Pérez", descripcion: "Médico veterinaria.", foto: "" };
        if (tipoFormateado === 'BARRA_MENU') contenidoBase = { enlaces: "Inicio, Nosotros, Contacto" };

        const nuevaSeccion = {
            tipoSeccion: tipoFormateado,
            orden: secciones.length + 1,
            esVisible: true,
            contenidoJson: JSON.stringify(contenidoBase)
        };

        const respuesta = await apiSaaS.creaSeccion(1, nuevaSeccion);
        if (respuesta) cargarDatos();
    };

    const manejarSoltar = async () => {
        const nuevosBotones = [...botonesSuperiores];
        const arrastrado = nuevosBotones.splice(dragItem.current, 1)[0];
        nuevosBotones.splice(dragOverItem.current, 0, arrastrado);
        setBotonesSuperiores(nuevosBotones);

        const promesas = secciones.map(s => {
            const nuevoOrden = nuevosBotones.indexOf(obtenerLabelBoton(s.tipoSeccion)) + 1;
            if (s.orden !== nuevoOrden) return apiSaaS.actualizarSeccion(s.idSeccion, { ...s, orden: nuevoOrden });
            return null;
        }).filter(p => p !== null);

        if (promesas.length > 0) { await Promise.all(promesas); cargarDatos(); }
    };

    const seccionesOrdenadas = [...secciones].sort((a, b) => a.orden - b.orden);
    const logoSeccion = seccionesOrdenadas.find(s => s.tipoSeccion === 'LOGO');
    const barraMenuSeccion = seccionesOrdenadas.find(s => s.tipoSeccion === 'BARRA_MENU');
    const combinarLogoEnMenu = Boolean(logoSeccion && barraMenuSeccion);

    return (
        <div className="app-wrapper">
            <div className="top-toolbar">
                {botonesSuperiores.map((boton, index) => (
                    <button
                        key={index}
                        className="btn-top-section"
                        draggable
                        onDragStart={() => (dragItem.current = index)}
                        onDragEnter={() => (dragOverItem.current = index)}
                        onDragEnd={manejarSoltar}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => {
                            const tipo = obtenerTipoSeccion(boton);
                            const existe = secciones.find(sec => sec.tipoSeccion === tipo);
                            if (existe) seleccionarSeccion(existe);
                            else agregarSeccion(boton);
                        }}
                    >
                        {boton}
                    </button>
                ))}
            </div>

            <div className="editor-container">
                <div className="preview-panel">
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
                            <button className="btn-guardar" onClick={guardarCambios}>GUARDAR CAMBIOS</button>
                        </div>
                    ) : <p className="empty-selection-text">Selecciona una sección para editar.</p>}
                </div>
            </div>
        </div>
    );
};

export default EditorWeb;
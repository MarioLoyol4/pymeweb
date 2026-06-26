import { useEffect, useRef, useState } from 'react';
import { apiSaaS } from '../../services/api';
import { getNegocioId } from '../../services/authService';

const BOTON_LOGO = "LOGO";

const BOTONES_BASE = [
    BOTON_LOGO, "BARRA MENÚ", "CABECERA", "ACERCA DE NOSOTROS",
    "SERVICIOS", "CONTACTO", "FRASES", "PIE DE PÁGINA",
    "REDES SOCIALES", "PRODUCTOS"
];

const TIPO_POR_BOTON = {
    [BOTON_LOGO]: "LOGO",
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

const fijarLogoPrimero = (lista) => {
    const sinLogo = lista.filter((nombre) => nombre !== BOTON_LOGO);
    return [BOTON_LOGO, ...sinLogo];
};

const normalizarTarjetas = (datos) => {
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

    return tarjetas.map((tarjeta) => ({
        nombre: tarjeta.nombre || tarjeta.titulo || '',
        descripcion: tarjeta.descripcion || tarjeta.bio || '',
        foto: tarjeta.foto || tarjeta.fotoUrl || tarjeta.imagen || tarjeta.urlImagen || ''
    }));
};

const normalizarServiciosEdicion = (datos) => {
    let servicios = [];
    const valorServicios = datos.servicios;

    if (Array.isArray(valorServicios)) {
        servicios = valorServicios;
    } else if (typeof valorServicios === 'string') {
        try {
            const parsed = JSON.parse(valorServicios);
            if (Array.isArray(parsed)) {
                servicios = parsed;
            } else if (parsed && typeof parsed === 'object') {
                servicios = [parsed];
            }
        } catch {
            const partes = valorServicios.split(',').map((item) => item.trim()).filter(Boolean);
            servicios = partes.map((item) => ({ titulo: item }));
        }
    }

    if (!servicios.length) {
        servicios = [{ titulo: 'Servicio 1', descripcion: '', icono: '' }];
    }

    return servicios.map((servicio, index) => {
        const base = typeof servicio === 'string' ? { titulo: servicio } : (servicio || {});

        return {
            titulo: base.titulo || base.nombre || `Servicio ${index + 1}`,
            descripcion: base.descripcion || base.detalle || '',
            icono: base.icono || base.iconoUrl || base.imagen || base.urlImagen || ''
        };
    });
};

const normalizarEnlacesEdicion = (datos) => {
    let enlaces = [];
    const valorEnlaces = datos.enlaces;

    if (Array.isArray(valorEnlaces)) {
        enlaces = valorEnlaces;
    } else if (typeof valorEnlaces === 'string') {
        const partes = valorEnlaces.split(',').map(item => item.trim()).filter(Boolean);
        enlaces = partes.map(item => ({ texto: item }));
    }

    if (!enlaces.length) {
        enlaces = [{ texto: 'Inicio' }];
    }

    return enlaces.map((enlace, index) => {
        const txt = typeof enlace === 'string' ? enlace : (enlace.texto || `Enlace ${index + 1}`);
        return { texto: txt };
    });
};

const normalizarProductosEdicion = (datos) => {
    let productos = [];
    const valorProductos = datos.productos;

    if (Array.isArray(valorProductos)) {
        productos = valorProductos;
    } else if (typeof valorProductos === 'string') {
        try {
            const parsed = JSON.parse(valorProductos);
            if (Array.isArray(parsed)) {
                productos = parsed;
            } else if (parsed && typeof parsed === 'object') {
                productos = [parsed];
            }
        } catch {
            const partes = valorProductos.split(',').map((item) => item.trim()).filter(Boolean);
            productos = partes.map((item) => ({ titulo: item }));
        }
    }

    if (!productos.length) {
        productos = [{ titulo: 'Producto 1', descripcion: '', imagen: '', precio: '' }];
    }

    return productos.map((producto, index) => {
        const base = typeof producto === 'string' ? { titulo: producto } : (producto || {});

        return {
            titulo: base.titulo || base.nombre || `Producto ${index + 1}`,
            descripcion: base.descripcion || base.detalle || '',
            imagen: base.imagen || base.urlImagen || '',
            precio: base.precio || ''
        };
    });
};

export const useEditorWeb = () => {
    const [secciones, setSecciones] = useState([]);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
    const [datosEdicion, setDatosEdicion] = useState({});
    const [tarjetasEdicion, setTarjetasEdicion] = useState([]);
    const [serviciosEdicion, setServiciosEdicion] = useState([]);
    const [productosEdicion, setProductosEdicion] = useState([]);
    const [enlacesEdicion, setEnlacesEdicion] = useState([]);
    const [coloresEdicion, setColoresEdicion] = useState({ fondo: '', textoTitulo: '', textoSecundario: '' });

    const [botonesSuperiores, setBotonesSuperiores] = useState(BOTONES_BASE);

    const dragItem = useRef();
    const dragOverItem = useRef();

    const negocioId = getNegocioId();

    const cargarDatos = async () => {
        if (!negocioId) {
            setSecciones([]);
            return;
        }

        const datos = await apiSaaS.obtenerSeccionesPorNegocio(negocioId);
        const datosArray = Array.isArray(datos) ? datos : [];
        setSecciones(datosArray);

        if (datosArray.length > 0) {
            setBotonesSuperiores((prev) => {
                const nombresEnUso = [...datosArray]
                    .sort((a, b) => a.orden - b.orden)
                    .map((s) => obtenerLabelBoton(s.tipoSeccion));

                const usadosUnicos = [];
                const usadosSet = new Set();
                for (const nombre of nombresEnUso) {
                    if (!usadosSet.has(nombre)) {
                        usadosSet.add(nombre);
                        usadosUnicos.push(nombre);
                    }
                }

                const sobrantes = prev.filter((b) => !usadosSet.has(b));

                const combinados = [...usadosUnicos, ...sobrantes];
                const unicos = [];
                const vistos = new Set();
                for (const nombre of combinados) {
                    if (!vistos.has(nombre)) {
                        vistos.add(nombre);
                        unicos.push(nombre);
                    }
                }

                return fijarLogoPrimero(unicos);
            });
        }
    };

    useEffect(() => { cargarDatos(); }, [negocioId]);

    const seleccionarSeccion = (seccion) => {
        setSeccionSeleccionada(seccion);
        const datos = JSON.parse(seccion.contenidoJson);
        if (seccion.tipoSeccion === 'BARRA_MENU') {
            delete datos.textoLogo;
            delete datos.logoTipo;
            delete datos.logotipo;
            setEnlacesEdicion(normalizarEnlacesEdicion(datos));
        } else {
            setEnlacesEdicion([]);
        }
        if (seccion.tipoSeccion === 'CABECERA' && !Object.prototype.hasOwnProperty.call(datos, 'imagenFondo')) {
            datos.imagenFondo = '';
        }
        if (seccion.tipoSeccion === 'ACERCA_DE_NOSOTROS' && !Object.prototype.hasOwnProperty.call(datos, 'foto')) {
            datos.foto = '';
        }
        if (seccion.tipoSeccion === 'ACERCA_DE_NOSOTROS') {
            setTarjetasEdicion(normalizarTarjetas(datos));
        } else {
            setTarjetasEdicion([]);
        }
        if (seccion.tipoSeccion === 'SERVICIOS' && !Object.prototype.hasOwnProperty.call(datos, 'descripcion')) {
            datos.descripcion = '';
        }
        if (seccion.tipoSeccion === 'SERVICIOS') {
            setServiciosEdicion(normalizarServiciosEdicion(datos));
        } else {
            setServiciosEdicion([]);
        }
        if (seccion.tipoSeccion === 'PRODUCTOS' && !Object.prototype.hasOwnProperty.call(datos, 'descripcion')) {
            datos.descripcion = '';
        }
        if (seccion.tipoSeccion === 'PRODUCTOS') {
            setProductosEdicion(normalizarProductosEdicion(datos));
        } else {
            setProductosEdicion([]);
        }
        if (seccion.tipoSeccion === 'CONTACTO') {
            const camposContacto = {
                titulo: 'Contacto',
                descripcion: '',
                telefono: '',
                email: '',
                direccion: '',
                whatsapp: '',
                horario: '',
                mapaUrl: ''
            };

            Object.entries(camposContacto).forEach(([campo, valor]) => {
                if (!Object.prototype.hasOwnProperty.call(datos, campo)) {
                    datos[campo] = valor;
                }
            });
        }
        if (seccion.tipoSeccion === 'REDES_SOCIALES') {
            const camposRedes = {
                facebook: 'https://facebook.com/miempresa',
                instagram: 'https://instagram.com/miempresa',
                whatsapp: '+56 9 1111 1111'
            };

            Object.entries(camposRedes).forEach(([campo, valor]) => {
                if (!Object.prototype.hasOwnProperty.call(datos, campo)) {
                    datos[campo] = valor;
                }
            });
        }
        setDatosEdicion(datos);

        if (datos.colores) {
            setColoresEdicion({
                fondo: datos.colores.fondo || '',
                textoTitulo: datos.colores.textoTitulo || '',
                textoSecundario: datos.colores.textoSecundario || ''
            });
        } else {
            setColoresEdicion({ fondo: '', textoTitulo: '', textoSecundario: '' });
        }
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatosEdicion((prev) => ({ ...prev, [name]: value }));
    };

    const manejarCambioColores = (campo, valor) => {
        setColoresEdicion((prev) => ({ ...prev, [campo]: valor }));
    };

    const manejarCambioTarjeta = (index, campo, valor) => {
        setTarjetasEdicion((prev) => prev.map((tarjeta, idx) => (
            idx === index ? { ...tarjeta, [campo]: valor } : tarjeta
        )));
    };

    const agregarTarjeta = () => {
        setTarjetasEdicion((prev) => ([
            ...prev,
            { nombre: '', descripcion: '', foto: '' }
        ]));
    };

    const eliminarTarjeta = (index) => {
        setTarjetasEdicion((prev) => prev.filter((_, idx) => idx !== index));
    };

    const manejarCambioServicio = (index, campo, valor) => {
        setServiciosEdicion((prev) => prev.map((servicio, idx) => (
            idx === index ? { ...servicio, [campo]: valor } : servicio
        )));
    };

    const agregarServicio = () => {
        setServiciosEdicion((prev) => ([
            ...prev,
            { titulo: '', descripcion: '', icono: '' }
        ]));
    };

    const eliminarServicio = (index) => {
        setServiciosEdicion((prev) => prev.filter((_, idx) => idx !== index));
    };

    const manejarCambioProducto = (index, campo, valor) => {
        setProductosEdicion((prev) => prev.map((producto, idx) => (
            idx === index ? { ...producto, [campo]: valor } : producto
        )));
    };

    const agregarProducto = () => {
        setProductosEdicion((prev) => ([
            ...prev,
            { titulo: '', descripcion: '', imagen: '', precio: '' }
        ]));
    };

    const eliminarProducto = (index) => {
        setProductosEdicion((prev) => prev.filter((_, idx) => idx !== index));
    };

    const manejarCambioEnlace = (index, valor) => {
        setEnlacesEdicion((prev) => prev.map((enlace, idx) => (
            idx === index ? { texto: valor } : enlace
        )));
    };

    const agregarEnlace = () => {
        setEnlacesEdicion((prev) => [...prev, { texto: 'Nuevo Enlace' }]);
    };

    const eliminarEnlace = (index) => {
        setEnlacesEdicion((prev) => prev.filter((_, idx) => idx !== index));
    };

    const guardarCambios = async () => {
        if (!seccionSeleccionada) return;
        const datosLimpios = { ...datosEdicion };
        if (seccionSeleccionada.tipoSeccion === 'BARRA_MENU') {
            delete datosLimpios.textoLogo;
            delete datosLimpios.logoTipo;
            delete datosLimpios.logotipo;
            datosLimpios.enlaces = enlacesEdicion.map(e => ({ texto: e.texto || '' }));
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
        if (seccionSeleccionada.tipoSeccion === 'SERVICIOS') {
            datosLimpios.servicios = serviciosEdicion.map((servicio) => ({
                titulo: servicio.titulo || '',
                descripcion: servicio.descripcion || '',
                icono: servicio.icono || ''
            }));
            delete datosLimpios.serviciosTexto;
        }
        if (seccionSeleccionada.tipoSeccion === 'PRODUCTOS') {
            datosLimpios.productos = productosEdicion.map((producto) => ({
                titulo: producto.titulo || '',
                descripcion: producto.descripcion || '',
                precio: producto.precio || '',
                imagen: producto.imagen || ''
            }));
            delete datosLimpios.productosTexto;
        }

        datosLimpios.colores = {...coloresEdicion};
        // Intentar parsear campos que el usuario haya editado como JSON (textarea), por ejemplo estilosTextos
        Object.keys(datosLimpios).forEach((k) => {
            const v = datosLimpios[k];
            if (typeof v === 'string') {
                const trimmed = v.trim();
                if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
                    try {
                        datosLimpios[k] = JSON.parse(trimmed);
                    } catch {
                        // si no es JSON válido lo dejamos como string
                    }
                }
            }
        });

        const datosParaEnviar = { ...seccionSeleccionada, contenidoJson: JSON.stringify(datosLimpios) };
        const respuesta = await apiSaaS.actualizarSeccion(seccionSeleccionada.idSeccion, datosParaEnviar);
        if (respuesta) { cargarDatos(); alert("¡Cambios guardados!"); }
    };

    const agregarSeccion = async (nombreBoton) => {
        const tipoFormateado = obtenerTipoSeccion(nombreBoton);

        let contenidoBase = { titulo: `Nueva sección: ${nombreBoton}` };
        if (tipoFormateado === 'LOGO') contenidoBase = { urlImagen: "", nombreEmpresa: "Mi negocio" };
        if (tipoFormateado === 'CABECERA') contenidoBase = { titulo: "Bienvenidos", subtitulo: "Tu mensaje principal aqui.", imagenFondo: "" };
        if (tipoFormateado === 'ACERCA_DE_NOSOTROS') contenidoBase = { titulo: "Sobre nosotros", nombre: "Nuestro equipo", descripcion: "Breve descripcion de tu empresa.", foto: "" };
        if (tipoFormateado === 'BARRA_MENU') contenidoBase = { enlaces: "Inicio, Servicios, Contacto" };
        if (tipoFormateado === 'SERVICIOS') contenidoBase = {
            titulo: "Servicios",
            descripcion: "Lo que ofrecemos",
            servicios: "Servicio 1, Servicio 2, Servicio 3"
        };
        if (tipoFormateado === 'PRODUCTOS') contenidoBase = {
            titulo: "Productos",
            descripcion: "Nuestros productos destacados",
            productos: "Producto 1, Producto 2, Producto 3"
        };
        if (tipoFormateado === 'CONTACTO') contenidoBase = {
            titulo: "Contacto",
            descripcion: "Escribenos para ayudarte.",
            telefono: "+56 9 1111 1111",
            email: "contacto@miempresa.cl",
            direccion: "Av. Principal 123",
            horario: "Lun a Vie 9:00 - 18:00",
            whatsapp: "+56 9 1111 1111",
            mapaUrl: ""
        };
        if (tipoFormateado === 'REDES_SOCIALES') contenidoBase = {
            facebook: "https://facebook.com/",
            instagram: "https://instagram.com/",
            whatsapp: "+56 9 1111 1111"
        };

        const nuevaSeccion = {
            tipoSeccion: tipoFormateado,
            orden: secciones.length + 1,
            esVisible: true,
            contenidoJson: JSON.stringify(contenidoBase)
        };

        if (!negocioId) return;

        const respuesta = await apiSaaS.creaSeccion(negocioId, nuevaSeccion);
        if (respuesta) cargarDatos();
    };

    const manejarClickBoton = (boton) => {
        const tipo = obtenerTipoSeccion(boton);
        const existe = secciones.find((sec) => sec.tipoSeccion === tipo);
        if (existe) seleccionarSeccion(existe);
        else agregarSeccion(boton);
    };

    const manejarSoltar = async () => {
        if (dragItem.current == null || dragOverItem.current == null) return;
        if (botonesSuperiores[dragItem.current] === BOTON_LOGO) return;

        const nuevosBotones = [...botonesSuperiores];
        const arrastrado = nuevosBotones.splice(dragItem.current, 1)[0];
        nuevosBotones.splice(dragOverItem.current, 0, arrastrado);
        const botonesActualizados = fijarLogoPrimero(nuevosBotones);
        setBotonesSuperiores(botonesActualizados);

        const promesas = secciones.map((s) => {
            const nuevoOrden = botonesActualizados.indexOf(obtenerLabelBoton(s.tipoSeccion)) + 1;
            if (s.orden !== nuevoOrden) return apiSaaS.actualizarSeccion(s.idSeccion, { ...s, orden: nuevoOrden });
            return null;
        }).filter((p) => p !== null);

        if (promesas.length > 0) { await Promise.all(promesas); cargarDatos(); }
    };

    const seccionesOrdenadas = [...secciones].sort((a, b) => a.orden - b.orden);
    const logoSeccion = seccionesOrdenadas.find((s) => s.tipoSeccion === 'LOGO');
    const barraMenuSeccion = seccionesOrdenadas.find((s) => s.tipoSeccion === 'BARRA_MENU');
    const combinarLogoEnMenu = Boolean(logoSeccion && barraMenuSeccion);

    return {
        negocioId,
        seccionSeleccionada,
        datosEdicion,
        tarjetasEdicion,
        serviciosEdicion,
        productosEdicion,
        enlacesEdicion,
        botonesSuperiores,
        dragItem,
        dragOverItem,
        seleccionarSeccion,
        manejarCambio,
        manejarCambioColor: manejarCambioColores,
        coloresEdicion,
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
    };
};

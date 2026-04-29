import React, {useState, useEffect} from "react";
import { apiSaaS } from "../services/api";

const EditorWeb = () => {
    const [secciones, setSecciones] = useState([]);
    useEffect(() => {
        const cargarDatos = async () => {
            const datos = await apiSaaS.obtenerSecciones(1);
            setSecciones(datos);
        };
        cargarDatos();
    }, []);

    return (
        <div>
            <h1>Panel de Edicion PymeWeb</h1>
            <p>Aqui construiremos la interfaz del mockup</p>

            <hr />

            <h2>Secciones cargadas desde la Base de Datos:</h2>
            {secciones.length === 0 ? (
                <p>No hay secciones aun o no existe la configuracion 1 en la base de datos.</p>
            ) : (
                <ul>
                    {secciones.map((seccion) => (
                        <li key={seccion.idSeccion}>
                            <strong>{seccion.tipoSeccion}</strong> - Orden: {seccion.orden}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EditorWeb;
import React, { useState, useEffect } from 'react';
import '../../styles/components/secciones/Productos.css';
import { normalizarProductos } from '../../js/components/secciones/Productos.js';
import { apiProductos } from '../../services/api.js';

export const Productos = ({ contenido }) => {
   const [productosBackend, setProductosBackend] = useState([]);
 useEffect(() => {
        const fetchProductos = async () => {
            const data = await apiProductos.obtenerProductos();
            setProductosBackend(data);
        };
        fetchProductos();
    }, []);

    const { titulo, descripcion } = normalizarProductos(contenido);

    return (
        <section className="diseno-productos">
            <header className="productos-header">
                <h2>{titulo}</h2>
                {descripcion && <p>{descripcion}</p>}
            </header>

            <div className="productos-grid">
                {productosBackend.map((p) => (
                    <article className="producto-card" key={p.id}>
                        <div className="producto-media">
                            {p.imagen ? (
                                <img src={p.imagen} alt={p.nombre || 'Producto'} />
                            ) : (
                                <div className="producto-media-placeholder">PRODUCTO</div>
                            )}
                        </div>
                        <div className="producto-body">
                            <h3>{p.nombre}</h3>
                            {p.descripcion && <p>{p.descripcion}</p>}
                            {p.precio && <div className="producto-precio">{p.precio}</div>}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

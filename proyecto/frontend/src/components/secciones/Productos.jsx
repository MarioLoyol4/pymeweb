import React from 'react';
import '../../styles/components/secciones/Productos.css';
import { normalizarProductos } from '../../js/components/secciones/Productos.js';

export const Productos = ({ contenido }) => {
    const { titulo, descripcion, productos } = normalizarProductos(contenido);

    return (
        <section className="diseno-productos">
            <header className="productos-header">
                <h2>{titulo}</h2>
                {descripcion && <p>{descripcion}</p>}
            </header>

            <div className="productos-grid">
                {productos.map((p) => (
                    <article className="producto-card" key={p.key}>
                        <div className="producto-media">
                            {p.imagen ? (
                                <img src={p.imagen} alt={p.titulo || 'Producto'} />
                            ) : (
                                <div className="producto-media-placeholder">PRODUCTO</div>
                            )}
                        </div>
                        <div className="producto-body">
                            <h3>{p.titulo}</h3>
                            {p.descripcion && <p>{p.descripcion}</p>}
                            {p.precio && <div className="producto-precio">{p.precio}</div>}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

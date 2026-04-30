import React from 'react';
import '../../styles/Acerca_nosotros.css';

export const Acerca_nosotros = ({ contenido }) => {
    const normalizarTarjetas = () => {
        let tarjetas = [];

        if (Array.isArray(contenido.tarjetas)) {
            tarjetas = contenido.tarjetas;
        } else if (typeof contenido.tarjetas === 'string') {
            try {
                const parsed = JSON.parse(contenido.tarjetas);
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
                    nombre: contenido.nombre || '',
                    descripcion: contenido.descripcion || '',
                    foto: contenido.foto || contenido.fotoUrl || contenido.imagen || contenido.urlImagen || ''
                }
            ];
        }

        return tarjetas.map((tarjeta) => ({
            nombre: tarjeta.nombre || tarjeta.titulo || '',
            descripcion: tarjeta.descripcion || tarjeta.bio || '',
            foto: tarjeta.foto || tarjeta.fotoUrl || tarjeta.imagen || tarjeta.urlImagen || ''
        }));
    };

    const tarjetas = normalizarTarjetas();

    return (
        <div className="diseno-conocenos">
            <div className="conocenos-header">
                <h2>{contenido.titulo}</h2>
            </div>

            <div className="conocenos-grid">
                {tarjetas.map((tarjeta, index) => (
                    <article className="conocenos-card" key={`${tarjeta.nombre}-${index}`}>
                        <div className="conocenos-card-media">
                            {tarjeta.foto ? (
                                <img
                                    src={tarjeta.foto}
                                    alt={tarjeta.nombre || `Foto ${index + 1}`}
                                    className="conocenos-card-image"
                                />
                            ) : (
                                <div className="conocenos-card-placeholder">SIN FOTO</div>
                            )}
                        </div>
                        <div className="conocenos-card-body">
                            <h3>{tarjeta.nombre || 'Sin nombre'}</h3>
                            {tarjeta.descripcion && <p>{tarjeta.descripcion}</p>}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};
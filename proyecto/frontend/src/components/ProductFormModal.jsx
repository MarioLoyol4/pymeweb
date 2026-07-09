import { useEffect, useState } from "react";

const emptyForm = {
  nombre: "",
  categoria: "",
  cantidad: "",
  precio: "",
  imagen: "",
};

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m5 5 14 14M19 5 5 19" strokeLinecap="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 16V4m0 0 4 4m-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProductFormModal({ producto, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre ?? "",
        categoria: producto.categoria ?? "",
        cantidad: producto.cantidad ?? "",
        precio: producto.precio ?? "",
        imagen: producto.imagen ?? "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [producto]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.nombre.trim()) next.nombre = "Ingresa el nombre del producto.";
    if (form.cantidad === "" || Number(form.cantidad) < 0) next.cantidad = "Ingresa un stock válido.";
    if (form.precio === "" || Number(form.precio) < 0) next.precio = "Ingresa un precio válido.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      nombre: form.nombre.trim(),
      categoria: form.categoria.trim(),
      cantidad: Number(form.cantidad),
      precio: Number(form.precio),
      imagen: form.imagen.trim(),
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {producto ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field full">
              <label htmlFor="nombre">Nombre del producto</label>
              <input
                id="nombre"
                type="text"
                value={form.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                placeholder="Ej: Alimento Premium para Perros 15kg"
              />
              {errors.nombre && <span className="field-error">{errors.nombre}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="categoria">Categoría</label>
              <input
                id="categoria"
                type="text"
                value={form.categoria}
                onChange={(e) => handleChange("categoria", e.target.value)}
                placeholder="Ej: Alimentos"
              />
            </div>

            <div className="form-field">
              <label htmlFor="cantidad">Stock inicial</label>
              <input
                id="cantidad"
                type="number"
                min="0"
                value={form.cantidad}
                onChange={(e) => handleChange("cantidad", e.target.value)}
                placeholder="0"
              />
              {errors.cantidad && <span className="field-error">{errors.cantidad}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="precio">Precio unitario</label>
              <input
                id="precio"
                type="number"
                min="0"
                step="1"
                value={form.precio}
                onChange={(e) => handleChange("precio", e.target.value)}
                placeholder="0"
              />
              {errors.precio && <span className="field-error">{errors.precio}</span>}
            </div>

            <div className="form-field full">
              <label htmlFor="imagen">
                URL de la imagen <span className="field-hint">(pega el link a la imagen ya subida)</span>
              </label>
              <input
                id="imagen"
                type="url"
                value={form.imagen}
                onChange={(e) => handleChange("imagen", e.target.value)}
                placeholder="https://..."
              />
              <div className="upload-preview">
                {form.imagen ? (
                  <img src={form.imagen} alt="Vista previa" onError={(e) => (e.target.style.visibility = "hidden")} />
                ) : (
                  <span className="thumb-placeholder" style={{ fontStyle: "normal" }}>
                    <UploadIcon />
                  </span>
                )}
                <span className="field-hint">Vista previa de la imagen del producto.</span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Guardando..." : producto ? "Guardar cambios" : "Agregar producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

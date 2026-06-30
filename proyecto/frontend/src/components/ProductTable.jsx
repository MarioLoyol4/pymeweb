function formatCLP(value) {
  if (value === null || value === undefined || value === "") return "—";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m16.5 3.5 4 4L8 20H4v-4Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProductTable({ productos, onEdit, onDelete }) {
  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th className="col-img">Imagen</th>
            <th>Nombre del producto</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Precio unitario</th>
            <th className="col-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 && (
            <tr className="empty-row">
              <td colSpan={6}>Aún no hay productos. Agrega el primero con "Agregar Producto".</td>
            </tr>
          )}
          {productos.map((p) => (
            <tr key={p.id}>
              <td className="col-img">
                {p.imagen ? (
                  <img className="thumb" src={p.imagen} alt={p.nombre} />
                ) : (
                  <div className="thumb-placeholder">Sin imagen</div>
                )}
              </td>
              <td>{p.nombre}</td>
              <td>{p.categoria || "—"}</td>
              <td>{p.cantidad ?? "—"}</td>
              <td>{formatCLP(p.precio)}</td>
              <td className="col-actions">
                <div className="actions-cell">
                  <button
                    type="button"
                    className="btn-edit-ghost"
                    onClick={() => onEdit(p)}
                    aria-label={`Editar ${p.nombre}`}
                  >
                    <EditIcon />
                  </button>
                  <button
                    type="button"
                    className="btn-danger-ghost"
                    onClick={() => onDelete(p)}
                    aria-label={`Eliminar ${p.nombre}`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

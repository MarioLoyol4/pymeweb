import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import BackgroundWave from "../components/BackgroundWave";
import ProductTable from "../components/ProductTable";
import ProductFormModal from "../components/ProductFormModal";
import "../styles/pages/Inventario.css";
import { getProductos, crearProducto, actualizarProducto, eliminarProducto } from "../services/producto";
function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  );
}

export default function InventarioPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [saving, setSaving] = useState(false);

  async function loadProductos() {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductos();
      setProductos(data ?? []);
    } catch (err) {
      setError(
        "No se pudo conectar con el backend en http://localhost:8080. Verifica que esté corriendo."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProductos();
  }, []);

  function openCreateModal() {
    setEditingProducto(null);
    setModalOpen(true);
  }

  function openEditModal(producto) {
    setEditingProducto(producto);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingProducto(null);
  }

  async function handleSubmit(formData) {
    setSaving(true);
    setError(null);
    try {
      if (editingProducto) {
        await actualizarProducto(editingProducto.id, formData);
      } else {
        await crearProducto(formData);
      }
      await loadProductos();
      closeModal();
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar el producto.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(producto) {
    const confirmado = window.confirm(`¿Eliminar "${producto.nombre}" del inventario?`);
    if (!confirmado) return;
    setError(null);
    try {
      await eliminarProducto(producto.id);
      setProductos((prev) => prev.filter((p) => p.id !== producto.id));
    } catch (err) {
      setError(err.message || "Ocurrió un error al eliminar el producto.");
    }
  }

  return (
    <div className="app-shell">
      <BackgroundWave />
      <div className="layout">
        <Sidebar />
        <main className="main">
          <div className="page-header">
            <h1 className="page-title">Gestión de inventario</h1>
            <button type="button" className="btn btn-primary" onClick={openCreateModal}>
              <PlusIcon />
              Agregar Producto
            </button>
          </div>

          {error && <div className="status-banner error">{error}</div>}

          {loading ? (
            <div className="status-banner">Cargando inventario...</div>
          ) : (
            <ProductTable productos={productos} onEdit={openEditModal} onDelete={handleDelete} />
          )}
        </main>
      </div>

      {modalOpen && (
        <ProductFormModal
          producto={editingProducto}
          onClose={closeModal}
          onSubmit={handleSubmit}
          saving={saving}
        />
      )}
    </div>
  );
}

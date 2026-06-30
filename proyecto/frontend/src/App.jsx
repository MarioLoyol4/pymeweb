import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EditorWeb from './pages/EditorWeb.jsx';
import PaginaPublica from './pages/PaginaPublica';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import InventarioPage from "./pages/InventarioPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/editor"
          element={(
            <ProtectedRoute>
              <EditorWeb />
            </ProtectedRoute>
          )}
        />
        <Route path="/p/:idNegocio" element={<PaginaPublica />} />
        <Route
          path="/inventario"
          element={(
            <ProtectedRoute>
              <InventarioPage />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<div style={{ padding: 40 }}>Página no encontrada</div>} />
      </Routes>
    </Router>
  );
}

export default App;

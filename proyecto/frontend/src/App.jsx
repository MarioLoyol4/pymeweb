import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/editor"
          element={(
            <ProtectedRoute>
              <EditorWeb />
            </ProtectedRoute>
          )}
        />
        <Route path="/PymeWeb/:slug" element={<PaginaPublica />} />
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

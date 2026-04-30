import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EditorWeb from './pages/EditorWeb.jsx';
import PaginaPublica from './pages/PaginaPublica';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/editor" element={<EditorWeb />} />

        
        <Route path="/:nombreNegocio" element={<PaginaPublica />} />
        
        
      </Routes>
    </Router>
  );
}

export default App;
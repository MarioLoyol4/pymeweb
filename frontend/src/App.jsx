import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EditorWeb from './pages/EditorWeb';
import PaginaPublica from './pages/PaginaPublica';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/editor" element={<EditorWeb />} />

        
        <Route path="/sitio/:id" element={<PaginaPublica />} />
        
        
        <Route path="/" element={<PaginaPublica />} />
      </Routes>
    </Router>
  );
}

export default App;
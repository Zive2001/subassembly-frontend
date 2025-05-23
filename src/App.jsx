import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TargetSettings from './pages/TargetSettings';
import NotFound from './pages/NotFound';



function App() {
  return (
    <Router>
  
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/targets" element={<TargetSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Series from './pages/Series';
import Manga from './pages/Manga';
import { AppLayout } from './components/layout/AppLayout';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/series/:id" element={<Series />} />
        <Route path="/manga/:id" element={<Manga />} />
      </Routes>
    </AppLayout>
  );
}

export default App

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Series from './pages/Series';
import Manga from './pages/Manga';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { AppLayout } from './components/layout/AppLayout';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/series/:id" element={<Series />} />
        <Route path="/manga/:id" element={<Manga />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AppLayout>
  );
}

export default App

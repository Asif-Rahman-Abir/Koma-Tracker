import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Manga from './pages/Manga';
import Anime from './pages/Anime';
import Search from './pages/Search';
import Library from './pages/Library';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { AppLayout } from './components/layout/AppLayout';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/library" element={<Library />} />
        <Route path="/manga/:id" element={<Manga />} />
        <Route path="/anime/:id" element={<Anime />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AppLayout>
  );
}

export default App

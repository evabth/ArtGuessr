import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Game from './game/Game';
import Login from './login/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
      <Route path="/login" element ={<Login />} />
    </Routes>
  )
}

export default App
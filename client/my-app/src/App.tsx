import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Game from './pages/Game';
import Login from './pages/Login';
import Register from './pages/Register';
import RequireAuth from './components/RequireAuth';
import Missing from './pages/Missing'

function App() {
  return (
    <Routes>
      
      <Route path='/register' element={<Register/>}/>
      <Route path="/login" element ={<Login />} />
      
      <Route element={<RequireAuth/>}>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Route>

      <Route path="*" element={<Missing/>}/>
      
      
    </Routes>
  )
}

export default App
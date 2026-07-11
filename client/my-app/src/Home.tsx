import { Link } from 'react-router-dom';
import Header from './components/Header';

function Home() {

  return (
    <>
      <Header/>
      <Link to="/game">Play Now!</Link>
      
    </>
  )
}

export default Home
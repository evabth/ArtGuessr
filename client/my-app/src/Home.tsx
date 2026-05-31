import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <h1>Art Guessr</h1>
      <Link to="/game">Play Now!</Link>
    </>
  )
}

export default Home
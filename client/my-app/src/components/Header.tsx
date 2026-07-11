import "./Header.css"
import LogoutButton from "./LogoutButton"
import { useNavigate,Link } from 'react-router-dom';
import { motion  } from "motion/react"

function Header (){

    const navigate = useNavigate();



    return(
        <>
            <div className="header-container">
                <div className="item-left">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/account')} >
                        User
                    </motion.button>
                </div>
                
                <Link className="item-center" to="/">
                    <h1 >Art Guessr</h1>
                </Link>
                <div className="item-right">
                    <LogoutButton/>
                </div>
            </div>
        </>
    )
}

export default Header
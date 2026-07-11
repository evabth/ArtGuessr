import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../api/endpoints';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { motion  } from "motion/react"


function LogoutButton () {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    async function handleLogout(){
        try{
          const logoutResponse = await axiosPrivate.get(API_ENDPOINTS.users.logout)
    
          console.log(logoutResponse)
    
          navigate('/login', {replace:true})
        }catch(err){
    
          console.log(err)
    
        }
    }


    return (
        <>
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}>
                    Logout
            </motion.button>
        </>
    )
    

}

export default LogoutButton
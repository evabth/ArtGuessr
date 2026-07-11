import { useState } from 'react';
const API_BASE = import.meta.env.VITE_API_URL;
import {API_ENDPOINTS} from "../api/endpoints"
import { Link } from 'react-router-dom';
import '../App.css'


function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [success, setSuccess] = useState(false)

    async function handleSubmit(){
        
        console.log(`email: ${email} password: ${password}`)
        if(!email || !password){
            console.log("No Email or Password")
            return
        }
        try{
            const registerRes = await fetch( API_BASE+API_ENDPOINTS.users.register,{
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body:JSON.stringify({
                    email,
                    password,
                    username
                })
            })

            if (!registerRes.ok) {
                const errorData = await registerRes.json()
                throw new Error(errorData.message ?? `Request failed with status ${registerRes.status}`)
            }

            const registerData = await registerRes.json()
            console.log(registerData)
            setEmail("")
            setPassword("")
            setUsername("")
            setSuccess(true)
        }catch(err){
            console.error(err)
        }

        

    }
    return (
        
        <>
            <h1>Art Guessr</h1>
            
            {success?
                (
                    <div>
                        <h2>You are Now Registered</h2>
                        <Link to='/login'>Login Here</Link>
                    </div>
                )
            
                :(<div>
                    <h2>Register</h2>
                    <h3>Username:</h3>
                    <input type='text' value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
                    <br/>
                    <h3>Email:</h3>
                    <input type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                    <br/>
                    <h3>Password:</h3>
                    <input type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                    <br/>
                    <br/>
                    <button onClick={handleSubmit}>Create Account</button>
                    <br/>
                    <a href='/login'>Already Have an Account? Login</a>
                </div>)
            }
        </>
    )



}

export default Register
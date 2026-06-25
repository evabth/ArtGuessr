import { useState } from 'react';
import {API_ENDPOINTS} from "../api/endpoints"
const API_BASE = import.meta.env.VITE_API_URL;
import useAuth from '../hooks/useAuth'
import { Link,useNavigate, useLocation } from 'react-router-dom';
import '../App.css'


function Login() {
    const {setAuth} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    async function handleSubmit(){
        
        console.log(`email: ${email} password: ${password}`)
        if(!email || !password){
            console.log("No Email or Password")
            return
        }
        try{
            const loginRes = await fetch(API_BASE+ API_ENDPOINTS.users.login,{
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body:JSON.stringify({
                    email,
                    password
                })
            })

            if (!loginRes.ok) {
                const errorData = await loginRes.json()
                throw new Error(errorData.message ?? `Request failed with status ${loginRes.status}`)
            }

            const loginData = await loginRes.json()
            console.log(loginData)
            const accessToken = loginData?.accessToken
            setAuth({email, accessToken})
            setEmail('')
            setPassword('')
            navigate(from, {replace:true})
        }catch(err ){

            if (err instanceof Error && 'response' in err){
                console.error(err.response)
            }else{
                console.error("No Server Response")
            }

        }

        

    }
    return (
        
        <>
            <h1>Art Guessr</h1>
            <div>
                <h2>Login</h2>
                <h3>Email:</h3>
                <input type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                <br/>
                <h3>Password:</h3>
                <input type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                <br/>
                <br/>
                <button onClick={handleSubmit}>Submit</button>
                <br/>
                <a href='/register'>Need an account? Register</a>
            </div>
        </>
    )



}

export default Login
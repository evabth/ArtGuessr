import React, { useState, type ButtonHTMLAttributes } from 'react';
import { motion , AnimatePresence } from "motion/react"
import {API} from "../api/endpoints"
import '../App.css'


function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>){
        setEmail(e.target.value)       
    }
    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>){
        setPassword(e.target.value)
    }
    async function handleSubmit(){
        
        console.log(`email: ${email} password: ${password}`)
        if(!email || !password){
            console.log("No Email or Password")
            return
        }
        const loginRes = await fetch(API.users.login,{
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({
                email,
                password
            })
        })

        const loginData = await loginRes.json()
        console.log(loginData)

        

    }
    return (
        
        <>
            <div>
                <h1>Art Guessr</h1>
                <h3>Email:</h3>
                <input type='email' onChange={handleEmailChange}/>
                <br/>
                <h3>Password:</h3>
                <input type='text' onChange={handlePasswordChange}/>
                <br/>
                <br/>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </>
    )



}

export default Login
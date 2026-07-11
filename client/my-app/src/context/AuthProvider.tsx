import { createContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

interface Auth {
    email?: string;
    accessToken?: string;
}

interface AuthContextType {
    auth: Auth;
    setAuth: React.Dispatch<React.SetStateAction<Auth>>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect( ()=>{

        const populateAuth = async()=>{

            try {
                const response = await axios.get(API_ENDPOINTS.users.refresh, {
                    withCredentials: true,
                });
                setAuth(prev => ({ ...prev, accessToken: response.data.accessToken }));
                console.log(response.data.accessToken)
                console.log("credentials set")
            } catch (err) {
                console.log("no current refresh token")
                console.log(err)
            } finally {
                setLoading(false);
                console.log(auth)
            }

        }
        populateAuth()


    },[])

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading }}>
            {loading ? <h1>ArtGuesser</h1> : children}
        </AuthContext.Provider>
    );

}

export default AuthContext;
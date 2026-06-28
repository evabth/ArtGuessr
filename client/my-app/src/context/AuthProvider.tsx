import { createContext, useEffect, useState } from "react";
import useRefreshToken from "../hooks/useRefreshToken";

interface Auth {
    email?: string;
    accessToken?: string;
}

interface AuthContextType {
    auth: Auth;
    setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(false);
    const refresh = useRefreshToken();

    useEffect( ()=>{

        const populateAuth = async()=>{

            try {
                await refresh();
            } catch (err) {
                // refresh token expired/invalid — stay logged out
            } finally {
                setLoading(false);
            }

        }


    },[])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {loading ? <h1>ArtGuesser</h1> : children}
        </AuthContext.Provider>
    );

}

export default AuthContext;
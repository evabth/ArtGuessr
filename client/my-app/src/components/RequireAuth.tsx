import { useLocation,Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";


const RequireAuth = () => {
    const {auth, loading} = useAuth();
    const location = useLocation();

    if (loading) return <h1>ArtGuesser</h1>;

    return (
        auth?.accessToken
            ? <Outlet/>
            : <Navigate to="/login" state={{from:location}} replace/>
    )
}

export default RequireAuth
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { axiosPrivate } from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

function Account (){
    const [acct, SetAcct] = useState<any>()

    useEffect(()=>{

        async function getAcct(){

            const acct = await axiosPrivate.get(API_ENDPOINTS.users.currentUser)

            console.log(acct)

            SetAcct(acct.data)

        }

        
        getAcct()

    },[])
    return (
        <>
            <Header/>
            

            {acct &&

                <div>

                    <h2>Email: {acct.email}</h2>
                    <h2>Username: {acct.username}</h2>
                    <h2>Best Score: {acct.topScore}</h2>

                </div>

            }


        </>
    )


}

export default Account
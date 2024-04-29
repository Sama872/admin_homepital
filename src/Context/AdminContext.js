import { createContext, useState } from "react";

export let AdminContext=createContext()
export default function AdminContextProvider(props){
    let [AdminToken,setAdminToken]=useState(null)
    return<AdminContext.Provider value={{AdminToken,setAdminToken}}>
        {props.children}

    </AdminContext.Provider>

}
import React, { createContext } from "react";
import axios from "axios";

export const HospitalsContext = createContext();

export default function HospitalsContextProvider(props) {
    const token = localStorage.getItem('userToken');

    // delete specific hospital 
    async function deleteSpecificHospital(hospitalId) {
        
            const response = await axios.delete(`http://localhost:8000/api/v1/hospital/${hospitalId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        
    }

    // get all hospitals 
    async function getHospitals() {
       
            const response = await axios.get(`http://localhost:8000/api/v1/hospital`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;

    }
    // get specific hospital
    async function getSpecificHospital(hospitalId) {
        
        const response = await axios.get(`http://localhost:8000/api/v1/hospital/${hospitalId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    
}

    return (
        <HospitalsContext.Provider value={{ getHospitals, deleteSpecificHospital,getSpecificHospital }}>
            {props.children}
        </HospitalsContext.Provider>
    );
}

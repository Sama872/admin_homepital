import axios from "axios";
import { createContext } from "react";

export let UsersContext=createContext()
export default function UserContextProvider(props) {
    const token = localStorage.getItem('userToken');
    // delete specific user 
    async function deleteSpecificUser(userId){
        return await axios.delete(`http://localhost:8000/api/v1/users/${userId}`,
        {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
    )
    }
    // get all users 
    async function getUsers(index){
       
        return await axios.get(`http://localhost:8000/api/v1/users?limit=50&page=${index?index:2}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

    }
    // add new user 
    async function addUser(){
       
      return await axios.post(`localhost:8000/api/v1/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

  }
              



    return <UsersContext.Provider value={{getUsers,deleteSpecificUser,addUser}}>
        {props.children}
    </UsersContext.Provider>

           
       }
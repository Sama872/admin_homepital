import {Navigate} from "react-router-dom"


export default function ProtectedRoute(props) {
  if(localStorage.getItem('userToken')&&localStorage.getItem('userRole')==='admin'){
    return props.children
  }else{
    return <Navigate to={'/login'}/>
  }
}

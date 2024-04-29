import { createBrowserRouter } from "react-router-dom";
import {RouterProvider} from "react-router-dom";
import './App.css';
import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import Users from "./components/Users/Users";
import Hospitals from "./components/Hospitals/Hospitals";
import Login from "./components/Login/Login";
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import CreateUser from "./components/Users/CreateUser";
import ForgetPassword from './components/ForgetPassword/ForgetPassword';
import VerificationCode from "./components/ForgetPassword/VerficationCode";
import ResetPassword from "./components/ForgetPassword/ResetPassword";
import { useContext, useEffect } from "react";
import { AdminContext } from "./Context/AdminContext";

function App() {
  let routers=createBrowserRouter([{
    path:'/',element:<Layout/>,children:[
      {path:'',element:<ProtectedRoute><Home/></ProtectedRoute>},
      {path:'users/:npage',element:<ProtectedRoute><Users/></ProtectedRoute>,children:[]},
      {path:'hospitals',element:<ProtectedRoute><Hospitals/></ProtectedRoute>},
      {path:'adduser',element:<ProtectedRoute><CreateUser/></ProtectedRoute>},
      {path:'login',element:<Login/>},
      { path: 'forgetpassword', element: <ForgetPassword /> },
      {path:'vcode',element:<VerificationCode/>},
      {path:'resetpassword',element:<ResetPassword/>},
    ]

  }])
  let {setAdminToken}=useContext(AdminContext)
   useEffect(()=>{
  if(localStorage.getItem('userToken')){
    setAdminToken(localStorage.getItem('userToken'))
  }
},[])
  return (
    <div>
      <RouterProvider router={routers}></RouterProvider>
      <Toaster />
    </div>
  );
}

export default App;

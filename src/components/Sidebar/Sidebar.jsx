import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AdminContext } from '../../Context/AdminContext';

export default function Sidebar() {
  let {AdminToken}=useContext(AdminContext)
    const location = useLocation();
  const pathname = location.pathname;
  return (
    <div className='bg-main simple-border vh-100'>
      {AdminToken&&localStorage.getItem('userRole')==='admin'?<div className='d-flex justify-content-center m-auto row text-center'>
      <Link to={'/users/2'} className={pathname==='/users/2'?"nav-link botton rounded text-white m-2 w-75 p-2":"nav-link m-2 w-75 p-2"}>المستخدمين</Link>
      <Link to={'/hospitals'} className={pathname==='/hospitals'?"nav-link botton rounded text-white m-2 w-75 p-2":"nav-link m-2 w-75 p-2"}>المستشفيات</Link>
      
      </div>:""}
    </div>
  )
}

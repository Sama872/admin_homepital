import React from 'react'
import Navbar from './../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      
     <Navbar/>
     <div className='row g-0'>
        <div className='col-2'>
            <Sidebar/>
        </div>
        <div className='col-10'>
            <Outlet/>
        </div>
    </div>
    </>
  )
}

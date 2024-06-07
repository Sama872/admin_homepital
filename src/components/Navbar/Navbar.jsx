import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../Images/logo-gded-removebg-preview.png'
import { AdminContext } from './../../Context/AdminContext';


export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  let {AdminToken,setAdminToken}=useContext(AdminContext)
  let navigate=useNavigate()
  function LogOut(){
    localStorage.removeItem('userToken')
    setAdminToken(null)
    navigate('/login')

  }
  return (

     <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className='container-fluid'>
        <div className="navbar-brand d-flex align-items-center">
        <img src={logo} alt='homepital'  width={100}/>
        
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        {AdminToken&&localStorage.getItem('userRole')==='admin'?<><ul className='navbar-nav me-auto'>
            <li className="nav-item">
                <span onClick={LogOut} className='text-pointer'>تسجيل الخروج</span>
            </li>
            </ul></>:<>
            <ul className='navbar-nav me-auto'>
            <li className="nav-item">
                <Link className={pathname==='/login'?"nav-link botton rounded text-white":"nav-link"} to="login">تسجيل الدخول</Link>
            </li>
            </ul></>}
          {AdminToken&&localStorage.getItem('userRole')==='admin'? <ul className="navbar-nav mr-auto">
            <li className="nav-item m-auto">
                <Link className={pathname==='/'?"nav-link botton rounded text-white":"nav-link"} to="/">الرئيسيه<span className="sr-only">(current)</span></Link>
            </li>
            </ul>:""}
            
            
           
            
        </div>
        </div>
</nav>
    
  )
}

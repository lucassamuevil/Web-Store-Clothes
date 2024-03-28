import React from 'react'
import './Navbar.css'
import navProfile from '../../assets/nav-profile.svg'


const Navbar = () => {
  return (
    <div className="navbar">
       
        <img src={navProfile} className='nav-profile' alt="" />
      
    </div>
  )
}

export default Navbar

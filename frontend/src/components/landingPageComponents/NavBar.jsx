import './NavBar.css'
import { useState } from 'react';
import Register from '../../pages/registerPage.jsx'
import Login from '../../pages/loginPage.jsx'


function NavBar() {

    const [showRegister,setShowRegister] = useState(false)
    const [showLogin, setShowLogin] = useState(false)

    return (
        <>
        <div className="nav">
            <img src="\1x\logo3.png" alt="logo.png" width={70} />
            <ul className="nav-elements">
                <li><button onClick={()=>{
                    setShowLogin(true)
                }}>
                    LogIn
                    </button></li>
                <li><button onClick={()=>{
                    setShowRegister(true)
                }}>
                    Register
                    </button></li>
                {/* <li><button onClick={()=>{
                    localStorage.removeItem("token")
                    localStorage.removeItem("user")
                    window.location.href = "/"
                }}>LogOut</button></li> */}
            </ul>
        </div>
        <hr className='nav-hr'/>
        {showRegister && (<Register isModal onClose={()=>{
                setShowRegister(false)
            }}/>)}
        {showLogin && <Login isModal onClose={()=>{
            setShowLogin(false)
        }}/>}
        </>
    )
}

export default NavBar
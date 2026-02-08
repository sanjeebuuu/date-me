import './Nav.css'
import { useState } from 'react';
import { useNavigate } from 'react-router';


function Nav() {

    const navigate = useNavigate()

    return (
        <>
            <div className="nav">
                <a href="/"><img src="\1x\logo3.png" alt="logo.png" width={70} /></a>

                <ul className="nav-elements flex-wrap">
                    <li>
                        <button onClick={() => {
                            navigate('/interactions')
                        }} >
                            <img src="/navIcons/home.svg" alt="" />
                        </button>
                    </li>
                    <li>
                        <button onClick={() => {
                            navigate('/chat')
                        }}>
                            <img src="/navIcons/chat.svg" alt="" />
                        </button>
                    </li>
                    <li>
                        <button onClick={() => {
                            navigate('/matches')
                        }}>
                            <img src="/navIcons/matches.svg" alt="" />
                        </button>
                    </li>
                    <li>
                        <button onClick={() => {
                            navigate('/user')
                        }}>
                            <img src="/navIcons/self.svg" alt="" />
                        </button>
                    </li>
                    <li><button onClick={() => {
                        localStorage.removeItem("token")
                        localStorage.removeItem("user")
                        window.location.href = "/"
                    }}>
                        <img src="/navIcons/logout.svg" alt="" />    
                    </button></li>
                </ul>
            </div>
            <hr className='nav-hr' />
        </>
    )
}

export default Nav
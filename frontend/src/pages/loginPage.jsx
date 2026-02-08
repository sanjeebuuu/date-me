import { useState } from "react";
import api from "../api/axios.js";
import { Navigate, useNavigate } from "react-router";

// inside function Login if we ever make a separate page for login route const wrapper = isModal ? 'div' : 'div'

function Login({isModal, onClose}) {

    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    


    const handleLogin = async (e) => {
        e.preventDefault();
        // post or fetch

        setLoading(true)
        setError("")

        try{
            const formData = new URLSearchParams();
            formData.append("username",username)
            formData.append("password",password)
            formData.append("grant_type", "password");

            const response = await api.post("/login", formData,{
                headers:{
                    "Content-type":"application/x-www-form-urlencoded",
                },
            })

            if (isModal) onClose()

            localStorage.setItem("token", response.data.access_token)
            localStorage.setItem("user", JSON.stringify(response.data.user))

            console.log("Log In Successful");

            navigate("/interactions")

        
        }catch(error){
            console.log("Full Error",error.response)
            setError(error.response?.data?.detail || "Login Failed")
        }finally{
            setLoading(false)
        }


        
    }

    return (
        
        <>
            <div className={isModal ? 'fixed inset-0 bg-black/95 flex items-center justify-center z-50' : ''}>

                <div className=" relative">
                    {isModal &&
                        <button onClick={onClose} className="absolute top-35 right-6 text-white text-xl cursor-pointer">
                            ✕
                        </button>}



                    <div className="w-110 h-160 border-8 border-(--primary-color) mx-auto my-30 rounded-4xl bg-(--bg-color) register-card">

                        <img src="\1x\logo3.png" alt="" width="200" className="mx-auto my-10 rounded-3xl" />

                        <div className=" text-(--secondary-color) text-4xl max-w-75 mx-auto text-center font-extrabold flex flex-row gap-2">
                            <span className=" font-medium">Login</span>
                            <span className=" font-extralight">to</span>
                            <span className="text-(--primary-color)">Date</span>
                            <span>Me</span>
                        </div>

                        <form onSubmit={handleLogin} className="flex flex-col w-max items-center mx-auto mt-7">
                            <input 
                            value={username} onChange={(e)=>{
                                setUsername(e.target.value)
                            }}
                            type="text" placeholder="Username" className="border-2 rounded-xl text-(--secondary-color) pt-3 pb-3 px-7 " />
                            <input
                            value={password} onChange={(e)=>{
                                setPassword(e.target.value)
                            }}
                            type="password" placeholder="Password" className="border-2 rounded-xl text-(--secondary-color) pt-3 pb-3 px-7 mt-5" />
                            <button
                            disabled = {loading}
                            className="my-10 bg-(--primary-color) text-(--secondary-color) py-3 px-10 rounded-2xl cursor-pointer border-2 border-(--primary-color) hover:bg-(--bg-color) ">
                                {loading? "Logging In...":"Log In"}</button>

                        </form>
                            {error && <p className="text-red-600 absolute top-10 left-40">{error}</p>}

                    </div>




                </div>

            </div>
        </>

    )
}


export default Login;

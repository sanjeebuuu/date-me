import { useState } from "react";
import api from "../api/axios";
import { data } from "react-router";
import { useNavigate } from "react-router";

function Register({isModal, onClose}) {

    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleRegister = async (e) =>{
        e.preventDefault();

        setLoading(true)
        setError("")


        try{
            const response = await api.post('/user/register',{
                    "username":username,
                    "password":password,
                }
            )
            if (isModal) onClose()

            
            const formData = new URLSearchParams();
            formData.append("username",username)
            formData.append("password",password)
            formData.append("grant_type", "password");

            const loginResponse = await api.post("/login", formData,{
                headers:{
                    "Content-type":"application/x-www-form-urlencoded",
                },
            })

            if (isModal) onClose()

            localStorage.setItem("token", loginResponse.data.access_token)
            localStorage.setItem("user", JSON.stringify(loginResponse.data.user))

            navigate("/user/update")
        

        }catch(error){
            setError(error.response?.data?.detail || "Registration Failed")
        }
        finally{
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



                    <div className="w-110 h-175 border-8 border-(--primary-color) mx-auto my-30 rounded-4xl bg-(--bg-color) register-card">

                        <img src="\1x\logo3.png" alt="" width="200" className="mx-auto my-10 rounded-3xl" />

                        <div className=" text-(--secondary-color) text-4xl max-w-75 mx-auto text-center font-extrabold ">
                            <p className=" font-medium">Get Started</p>
                            <p className=" font-extralight">with</p>
                            <span className="text-(--primary-color)">Date</span>
                            <span>Me</span>
                        </div>

                        <form onSubmit={handleRegister} className="flex flex-col w-max items-center mx-auto mt-7">
                            <input
                            value={username}
                            onChange={(e)=>setUsername(e.target.value)} 
                            type="text" placeholder="Username" className="border-2 rounded-xl text-(--secondary-color) pt-3 pb-3 px-7 " />
                            <input
                            value={password}
                            onChange={(e)=>{
                                setPassword(e.target.value)
                            }}
                            type="password" placeholder="Password" className="border-2 rounded-xl text-(--secondary-color) pt-3 pb-3 px-7 mt-5" />
                            <button disabled={loading} className="my-10 bg-(--primary-color) text-(--secondary-color) py-3 px-10 rounded-2xl cursor-pointer border-2 border-(--primary-color) hover:bg-(--bg-color) ">
                                {loading ? "Registering...":"Register"}
                            </button>
                        </form>
                            {error && <p className="text-red-600 absolute top-10 left-30">{error}</p>}

                    </div>




                </div>

            </div>
        </>

    )
}


export default Register;

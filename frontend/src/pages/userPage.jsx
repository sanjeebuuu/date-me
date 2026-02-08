import { useEffect, useState } from "react"
import api from "../api/axios.js";
import { useNavigate } from "react-router";
import Nav from "../components/mainPageComponents/Nav.jsx";
function ShowUser() {

    const navigate = useNavigate()

    const [user, setUser] = useState({})

    useEffect(() => {
        console.log("ma")
        showUser()
    }, [])

    const showUser = async () => {
        try {
            console.log("malai bolako ho")
            const response = await api.get('/user')
            console.log("fetch")
            console.log(response.data)
            setUser(response.data)

        } catch (error) {
            console.log("Error in Users")
        }
    }




    return (

        <>

            <Nav />
            {/* <div className="text-3xl text-center text-(--secondary-color) font-bold mt-3">You look like this to others</div> */}
            <div className="mx-auto mt-8 w-104 rounded-3xl border-6 border-(--primary-color) bg-(--bg-color) shadow-2xl overflow-hidden">


                <div className="relative h-136 overflow-hidden">{console.log(user)}
                    <img
                        src={`http://localhost:8000/${user.photo}`}
                        alt={user.name}
                        className="h-full w-full object-cover"
                    />


                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>


                    <div className="absolute bottom-6 left-6 right-6 text-white">
                        <p className="text-3xl font-bold">{user.name}</p>
                        <p className="text-base opacity-90">
                            {user.bio}
                        </p>

                        <div className="mt-3 flex gap-4 text-base opacity-90">
                            <span>Age: {user.age}</span>
                            <span>Gender: {user.gender}</span>
                            <span>Username: {user.username}</span>
                        </div>
                    </div>
                </div>


                <div className="flex justify-around py-6">
                    <button
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-(--secondary-color) text-2xl shadow-xl transition hover:scale-110 hover:bg-red-600 cursor-pointer"
                        // onClick={() => {
                        //     onAction('reject')
                        // }}
                    >
                        ✕
                    </button>

                    <button
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-(--secondary-color) text-2xl shadow-xl transition hover:scale-110 hover:bg-green-600 cursor-pointer"
                        // onClick={() => {
                        //     onAction('like')
                        // }}
                    >
                        <img src="navIcons\like.svg" alt="" />
                    </button>
                </div>

            </div>
            <div className=" flex justify-center gap-5 mt-7" >
                <button
                    onClick={() => {
                        navigate('/user/update')
                    }} className=" text-(--secondary-color) bg-(--bg-color) border-2 border-(--primary-color) hover:bg-(--primary-color) px-6 py-5 rounded-4xl cursor-pointer">
                    <img src="/navIcons/update.svg" alt="" />
                </button>
                <button
                    onClick={() => {
                        navigate('/interactions')
                    }} className=" text-(--secondary-color) bg-(--bg-color) border-2 border-(--primary-color) hover:bg-(--primary-color) px-6 py-5 rounded-4xl cursor-pointer">
                    <img src="/navIcons/search.svg" alt="" />
                </button>
            </div>
        </>
    )
}

export default ShowUser
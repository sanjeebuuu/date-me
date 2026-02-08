import Nav from "../components/mainPageComponents/Nav.jsx";
import ProfileCard from "../components/mainPageComponents/ProfileCard.jsx";
import api from '../api/axios.js'
import { useEffect, useRef, useState } from "react";

function Interactions() {

    const [users, setUsers] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)


    useEffect(()=>{
        fetchUsers()
    },[])

    const fetchUsers = async () => {
        try {
            console.log("ma kaam ")
            const response = await api.get('/interaction');
            setUsers(response.data);
            setCurrentIndex(0)
        } catch (error) {
            if (error.response?.status === 404) {
                setUsers([]);
                alert("No Users Left")
            }
            console.error("Error fetching users:", error);
        }
    }



    const handleInteraction = async (type) => {
        const targetUser = users[currentIndex]

        try {
            await api.post(`/interaction/${type}/${targetUser.id}`)

            setCurrentIndex((prev) => prev + 1)
        } catch (error) {
            console.log("Error Occured in Liking/Rejecting ")
        }

    }

    const currentUser = users[currentIndex]



    return (
        <>
            <Nav></Nav>
            <div className="flex justify-center">
                {(currentUser) ?
                    (<ProfileCard user={currentUser} onAction={handleInteraction} />)
                    :
                    (
                        <div className="flex flex-col items-center">

                            <p className="mt-20 text-center text-(--secondary-color)">No More Profiles to Show</p>

                            <button onClick={fetchUsers}
                                className="mt-4 text-(--secondary-color) bg-(--primary-color) border border-(--primary-color) px-10 py-5 rounded-2xl cursor-pointer hover:bg-(--bg-color)" >
                                Start Over</button>

                        </div>
                    )}
            </div>


        </>
    )
}

export default Interactions
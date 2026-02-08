import { useState } from "react";
import api from "../api/axios.js";
import { useNavigate } from "react-router";
import Nav from "../components/mainPageComponents/Nav.jsx";


function UpdateUser() {
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [age, setAge] = useState(0)
    const [gender, setGender] = useState("")
    const [bio, setBio] = useState("")


    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleUpdate = async (e) => {

        e.preventDefault();

        if ((name | gender | bio  == "") | (age == 0)){
            setError("Please keep real Details")
            return;
        }
        
        setLoading(true)

        try {
            const response = api.put('/user/update', {
                "name": name,
                "age": age,
                "gender": gender,
                "bio": bio,
            })

            console.log(response.data)

            navigate("/user/upload-photo")


        }catch(error){
            console.log(error)
        }


    }


    return (
        <>
            <Nav></Nav>
            
            <div className="container flex flex-col items-center w-[80vw] max-w-200 h-auto border-8 border-(--primary-color)  mx-auto my-20 rounded-4xl gap-6">
                <p className=" mt-9 font-bold text-3xl text-(--primary-color)">Update Your Profile</p>

                <form onSubmit={handleUpdate} className="flex flex-col gap-6 mb-12">
                    <input
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                        type="text" placeholder="FullName" className=" border-2 border-(--secondary-color) rounded-2xl px-4 py-2 text-(--secondary-color)" />

                    <input
                        value={age}
                        onChange={(e) => {
                            setAge(e.target.value)
                        }}
                        type="text" placeholder="Age" className=" border-2 border-(--secondary-color) rounded-2xl px-4 py-2 text-(--secondary-color)" />

                    <input
                        value={gender}
                        onChange={(e) => {
                            setGender(e.target.value)
                        }}
                        type="text" placeholder="Gender" className=" border-2 border-(--secondary-color) rounded-2xl px-4 py-2 text-(--secondary-color)" />

                    <textarea
                        value={bio}
                        onChange={(e) => {
                            setBio(e.target.value)
                        }}
                        placeholder="Describe yourself here.." rows="5" className="border-2 border-(--secondary-color) rounded-2xl text-(--secondary-color) pl-3 pr-11 py-2"></textarea>

                    <button disabled={loading} className=" text-(--secondary-color) bg-(--primary-color) border-2 border-(--primary-color) hover:bg-(--bg-color) px-10 py-5 rounded-3xl cursor-pointer">
                        {loading? "Updating...":"Update"}
                    </button>
                {error && <p className="text-red-600 text-center">{error}</p>}
                </form>


            </div>
        </>
    )
}

export default UpdateUser
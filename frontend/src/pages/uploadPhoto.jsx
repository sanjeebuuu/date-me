import { useState } from "react";
import api from "../api/axios.js";
import {  useNavigate } from "react-router";
import Nav from "../components/mainPageComponents/Nav.jsx";
import axios from "axios";

function UploadPhoto() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const handleUpload = async (e) => {

        e.preventDefault();

        if (!file) {
            setError("Please upload your photo first")
            return;
        }

        setLoading(true)

        const formData = new FormData();
        formData.append("file", file) // this "file" must match the name in backend

        try {
            const response = await api.post('/user/upload-photo', formData)
            console.log(response)
            navigate('/user')
        } catch (err) {
            setError("Upload Failed")
        }finally{
            setLoading(false)
        }

    }

    return (
        <>
            <Nav />
            <div className="container flex flex-col items-center w-[80vw] max-w-200 h-auto border-8 border-(--primary-color)  mx-auto my-20 rounded-4xl gap-6">
                <p className=" mt-9 font-bold text-3xl text-(--primary-color)  ">Upload your Photo</p>

                <form onSubmit={handleUpload} className="flex flex-col items-center gap-6 mb-12">

                    <input onChange={(e) => {
                        if (e.target.files) {
                            setFile(e.target.files[0])
                        }
                        
                    }} type="file" id="userPhoto" hidden />

                    <label htmlFor="userPhoto" className="cursor-pointer border-2 border-(--primary-color) text-(--secondary-color) px-6 py-3 rounded-xl">Click to Upload Photo</label>
                    {file && (
                                <p className="text-(--secondary-color) mt-2 text-sm">
                                    {file.name}
                                </p>
                            )}
                    <button disabled={loading} className=" text-(--secondary-color) bg-(--primary-color) border-2 border-(--primary-color) hover:bg-(--bg-color) px-10 py-5 rounded-3xl cursor-pointer">
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            </div>
        </>
    )
}

export default UploadPhoto
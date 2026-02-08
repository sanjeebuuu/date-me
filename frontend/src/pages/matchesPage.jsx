import { useEffect, useState } from "react"
import Nav from "../components/mainPageComponents/Nav.jsx";
import api from "../api/axios.js";
import Match from "../components/mainPageComponents/Match.jsx";

function Matches() {

    const [matches, setMatches] = useState([])
    useEffect(() => {

        const fetchMatches = async () => {
            try {
                const response = await api.get('/match');
                setMatches(response.data);
            } catch (error) {
                console.log("Error fetching matches:", error);
            }
        };

        fetchMatches();
    }, []);

    return (
        <>
            <Nav />
            <div className="flex flex-col mt-15 gap-5 p-4">
                {matches.length > 0 ? (
                    matches.map((match)=>(
                        <Match
                        key={match.id}
                        name={match.name}
                        age={match.age}
                        bio = {match.bio}
                        photo = {match.photo}/>
                    ))
                ) : (
                        <p className="text-center text-(--secondary-color)">You have No Matches, Keep Liking</p>
            )}
            </div >
        </>
    )
}

export default Matches
import { useEffect, useState } from "react"
import api from '../../api/axios.js'

function ChatList({onSelect}) {
    const [chats, setChats] = useState([])

    useEffect(() => {
        const getChats = async () => {
            try {
                const response = await api.get('/chat')
                setChats(response.data)
            } catch (error) {
                console.log("Error fetching chats")
            }
        }
        getChats();
    }, [])

    return (

        <div className=" flex flex-col w-full h-full max-w-xs  bg-(--bg-color) text-(--secondary-color) overflow-y-auto">

            {/* Header */}
            <div className="p-4 text-xl font-bold border-b  border-(--secondary-color)/40 bg-(--bg-color) sticky top-0">
                Chats
            </div>

            {/* Chat List */}
            <div className="flex-1 ">
                {chats.map(chat => (
                    <div
                        key={chat.chat_id}
                        className="flex items-center px-4 py-4 cursor-pointer transition-all duration-200 rounded-3xl active:bg-(--primary-color)/10 group"
                        onClick={() => onSelect(chat.chat_id)}
                    >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-(primary-color) flex items-center justify-center font-bold text-(secondary-color) mr-3 shrink-0 overflow-hidden">
                            <img className=" object-cover w-full h-full" src={`http://localhost:8000/${chat.other_user.photo}`} alt="" />

                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <p className="text-sm font-semibold truncate group-hover:text-(--primary-color) transition-colors">
                                    {chat.other_user.name}
                                </p>
                            </div>
                            <p className="text-xs text-gray-400 truncate mt-1">
                                Click to start messaging...
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default ChatList
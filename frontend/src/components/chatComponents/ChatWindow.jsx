import { useState, useEffect, useRef } from "react"
import api from '../../api/axios.js'
import MessageInput from "./MessageInput.jsx"

function ChatWindow({ chatId }) {
    const [messages, setMessages] = useState([])
    const wsRef = useRef(null)

    const messagesEndRef = useRef(null) // for auto scroll
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.id; //for user
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (!chatId) {
            return;
        }
        const fetchMessages = async () => {
            try {
                const response = await api.get(`/chat/${chatId}/messages`)
                setMessages(response.data)
            } catch (error) {
                console.error("Fetching Messages Error", error)
                setMessages([]) // safety
            }
        }
        fetchMessages();
        const token = localStorage.getItem("token")
        const ws = new WebSocket(
            `ws://localhost:8000/ws/chat/${chatId}?token=${token}`
        )

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            setMessages(prev => [...prev, data])
        }
        wsRef.current = ws
        return () => ws.close()
    }, [chatId])

    //for auto scroll
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // return (
    //     <div className="chat-window">
    //         <div>

    //         {messages.map((msg, i) => (
    //             <div key={i} className="message">
    //                 {msg.message_text}
    //             </div>
    //         ))}

    //         </div>

    //         <MessageInput socket={wsRef.current} />
    //     </div>
    // )

    return (
        <div className="flex flex-col h-full w-full bg-[#1a1a1a] text-(--secondary-color)">
            {/* Header */}
            <div className="p-4 border-b border-(--secondary-color)/40 bg-(--bg-color) flex items-center justify-between shadow-sm ">
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <h2 className="font-semibold text-lg tracking-tight">Active Conversation</h2>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500 italic text-sm">
                        No messages yet. Say hello!
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.sender_id === currentUserId;

                        return (
                            <div
                                key={i}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div className={`
                                    max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-lg
                                    ${isMe
                                        ? 'bg-(--primary-color) text-(--secondary-color) rounded-br-none'
                                        : 'bg-(--bg-color) text-gray-100 border border-(--secondary-color)/10 rounded-bl-none'}
                                `}>
                                    <p className="leading-relaxed wrap-break-word">
                                        {msg.message_text}
                                    </p>
                                    
                                </div>
                            </div>
                        );
                    })
                )}
                {/* Dummy div to anchor the scroll */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-(--bg-color) border-t border-(--secondary-color)/40">
                <MessageInput socket={wsRef.current} />
            </div>
        </div>
    );
}

export default ChatWindow
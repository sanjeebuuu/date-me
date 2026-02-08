import { useState } from 'react'

function MessageInput({ socket }) {
    const [text, setText] = useState("")

    const sendMessage = () => {
        if (!text.trim()) return;

        socket.send(JSON.stringify({ message: text }))
        setText("")
    }

    return (
        <div className="flex items-center gap-2 bg-[#1a1a1a] p-2 rounded-xl border border-(--secondary-color)/5 shadow-inner">
            <input
                className="flex-1 bg-transparent  focus:ring-0 text-sm text-(--secondary-color) placeholder-gray-500 px-2 py-1 outline-none"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder='Say Something...'
            />
            
            <button 
                onClick={sendMessage}
                disabled={!text.trim()}
                className={`
                    px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200
                    ${text.trim() 
                        ? 'bg-(--primary-color) text-(--secondary-color) hover:bg-(--primary-color) active:scale-95 shadow-md' 
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
                `}
            >
                {/* SVG for a "Send" Arrow Icon */}
                <div className="flex justify-center items-center cursor-pointer">
                    <button><img src="icons/send.svg" alt="" /> </button>
                </div>
            </button>
        </div>
    )
}

export default MessageInput
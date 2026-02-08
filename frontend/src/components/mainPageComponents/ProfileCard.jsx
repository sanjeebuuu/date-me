function ProfileCard({user, onAction}){
    return(
        <div className="mx-auto mt-16 w-104 rounded-3xl border-6 border-(--primary-color) bg-(--bg-color) shadow-2xl overflow-hidden">


                <div className="relative h-136 overflow-hidden">
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

                        <div className="mt-3 flex gap-5 text-base opacity-90">
                            <span>Age: {user.age}</span>
                            <span>Gender: {user.gender}</span>
                        </div>
                    </div>
                </div>


                <div className="flex justify-around py-6">
                    <button
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-(--secondary-color) text-2xl shadow-xl transition hover:scale-110 hover:bg-red-600 cursor-pointer"
                        onClick={()=>{
                            onAction('reject')
                        }}
                    >
                        ✕
                    </button>

                    <button
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-(--secondary-color) text-2xl shadow-xl transition hover:scale-110 hover:bg-green-600 cursor-pointer"
                        onClick={()=>{
                            onAction('like')
                        }}
                    >
                        <img src="navIcons\like.svg" alt="" />
                    </button>
                </div>
            </div>
    )
}

export default ProfileCard
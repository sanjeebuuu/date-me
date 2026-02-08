function Match({ id, name, age, photo, bio }) {
    return (
        <div className=" overflow-hidden  w-[30vw]  mx-auto">
            <div className="flex justify-between gap-10  overflow-hidden mb-5">

                <img
                    className="w-40 h-40 object-cover object-top border-2 border-(--secondary-color) rounded-2xl shadow-sm"
                    src={`http://localhost:8000/${photo}`}
                    alt={name}
                />

                <ul className="flex flex-col gap-2.5 flex-1 justify-center text-(--secondary-color)">
                    <li className="text-3xl font-bold">
                        {name}
                    </li>
                    <li>
                        {age} years old
                    </li>
                    <li>
                        {bio}
                    </li>
                </ul>

            </div>
            <hr className=" text-(--secondary-color) opacity-15" />
        </div>
    )
}
export default Match
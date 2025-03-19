import { useState } from "react"


export default function Navbar() {

    const [username, setUsername] = useState<string>('Mohammed Baqir')
    const [autherzation, setAutherzation] = useState<string>('Admin')
    return (
        <div className="flex flex-row text-white justify-between items-center bg-blue-500 p-3">
            <div>
                <h2 className="text-lg">Attendance Dashboard</h2>
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
                <h3 className="text-lg pr-3">Username: {username} | {autherzation}</h3>
                <a href="/settings" className=" p-2 text-white rounded-md bg-gray-800 hover:bg-gray-700 hover:text-gray-300">Settings</a>
                <div className="flex flex-row   rounded-md">
                    <button className="rounded-md text-white rounded-r-none border-r p-2 border-r-black bg-gray-800 hover:bg-gray-700 hover:text-gray-300">Switch</button>
                    <button className="rounded-md text-white rounded-l-none border-l p-2 border-l-black bg-gray-800 hover:bg-gray-700 hover:text-gray-300">Logout</button>
                </div>
            </div>
        </div>
    )
}
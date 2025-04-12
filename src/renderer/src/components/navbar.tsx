/* eslint-disable prettier/prettier */
// import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContextProvider";


export default function Navbar(): JSX.Element {
    const { logout, user } = useAuth() // Get the logout function from AuthContext
    console.log(user)
    const autherzation = user?.isAdmin ? 'Admin' : 'User'
    return (
        <div className="flex flex-row text-white justify-between items-center bg-blue-500 p-3">
            <div>
                <h2 className="text-lg">Attendance Dashboard</h2>
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
                <h3 className="text-lg pr-3">Username: {user?.username} | {autherzation}</h3>
                <a href="/settings" className=" p-2 text-white rounded-md bg-gray-800 hover:bg-gray-700 hover:text-gray-300">Settings</a>
                <div className="flex flex-row   rounded-md">
                    <button className="rounded-md text-white rounded-r-none border-r p-2 border-r-black bg-gray-800 hover:bg-gray-700 hover:text-gray-300">Switch</button>
                    <button onClick={() => { logout() }} className="rounded-md text-white rounded-l-none border-l p-2 border-l-black bg-gray-800 hover:bg-gray-700 hover:text-gray-300">Logout</button>
                </div>
            </div>
           
        </div>
    )
}
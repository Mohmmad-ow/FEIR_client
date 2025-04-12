import Navbar from '@renderer/components/navbar'
import AttendanceList from '@renderer/components/AttendenceList'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContextProvider'

export default function Dashboard(): JSX.Element {
    const router = useNavigate()
    // const [user, setUser] = useState(null);
    const { addMissingUserData, user } = useAuth() // Get the logout function from AuthContext

    useEffect(() => {
        const getData = async () => {
            try {
                // Get user data from localStorage
                const storedData = window.localStorage.getItem('userData')
                console.log('Stored Data:', storedData)
                if (!storedData) {
                    router('/login')
                    return
                }

                // Parse user data
                const data = JSON.parse(storedData)
                if (!data?.access_token) {
                    router('/login')
                    return
                }

                // Make API request
                const response = await fetch('http://127.0.0.1:8000', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${data.access_token}`, // Add token
                        'Content-Type': 'application/json'
                    }
                })

                // Handle response
                if (response.status === 401) {
                    alert('Session expired, please login again')
                    window.localStorage.removeItem('userData')
                    router('/login')
                    return
                }

                if (!response.ok) {
                    console.error('Failed to fetch data:', response.statusText)
                    return
                }

                const res = await response.json()
                const userData = res.user[0]
                console.log('API Response:', userData)
                addMissingUserData(userData.username, userData.fullname, userData.isAdmin) // Update user data in context
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        getData()
    }, [])

    return (
        <div className="bg-white">
            <Navbar />
            <div className="flex flex-col justify-center items-center w-full">
                <div className="flex justify-center w-full mt-12">
                    <button
                        onClick={() => router('/process-attendance')}
                        className="text-white text-xl bg-blue-700 w-[30%] h-14 rounded-lg flex justify-center items-center"
                    >
                        + New Attendance Record
                    </button>
                </div>
                <AttendanceList />
                <div className="flex w-full flex-row gap-2 justify-start p-4 items-center">
                    <a
                        className="text-white text-xl w-[15%] bg-blue-700  h-14 rounded-2xl flex justify-center items-center"
                        href="/class-info"
                    >
                        Class Data
                    </a>
                </div>
            </div>
        </div>
    )
}

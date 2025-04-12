import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContextProvider'
import GoBack from '@renderer/components/GoBack'

export default function RemoveClassPage(): JSX.Element {
    const [selectedClassId, setSelectedClassId] = useState(0)
    
    const { user } = useAuth()
    const [classes, setClasses] = useState<unknown[]>([])
    useEffect(() => {
        const getData = async () => {
            let response = await fetch('http://127.0.0.1:8000/classes/all', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user?.access_token}`, // Add token
                    'Content-Type': 'application/json'
                }
            })
            response = await response.json()
            if (response.status === 401) {
                alert('Session expired, please login again')
                window.localStorage.removeItem('userData')
                window.location.href = '/login'
                return
            } else {
                console.log('API Response:', response)
                setClasses(response)
                setSelectedClassId(response[0].id) // Set the first class as default selected
            }
        }
        getData()
    }, [])

    async function handleSubmit(): Promise<void> {
        console.log(
            'Class Removed:',
            classes.find((e) => (e.id = selectedClassId)),
            selectedClassId
        )
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/classes/delete/${selectedClassId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${user?.access_token}`, // Add token
                        'Content-Type': 'application/json'
                    }
                }
            )
            const data = await response.json()
            if (response.status === 401) {
                alert('Session expired, please login again')
                window.localStorage.removeItem('userData')
                window.location.href = '/login'
                return
            } else {
                console.log('API Response:', data)
                setClasses((prevClasses) =>
                    prevClasses.filter((data) => data.id !== selectedClassId)
                )
                alert('Class removed successfully')
            }
        } catch (error) {
            console.error('Error removing class:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pr-4 pl-4 ">
            <GoBack />
            <div className="w-full max-w-lg bg-white shadow-md mt-32 rounded-lg">
                <div className="bg-blue-600 text-white text-center py-4 rounded-t-lg">
                    <h2 className="text-2xl font-semibold">Remove Class</h2>
                </div>

                <div className="p-6">
                    <div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Class to Remove:
                            </label>
                            <select
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(Number(e.target.value))}
                                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                {classes.map((data, idx) => (
                                    <option key={idx} value={data.id}>
                                        {data.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-red-600 text-white py-2 rounded-lg text-lg font-medium hover:bg-red-700 transition"
                        >
                            Remove Class
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

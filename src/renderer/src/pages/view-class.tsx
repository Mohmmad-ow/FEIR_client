import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContextProvider'
import ClassCard from '@renderer/components/ClassCard'
import GoBack from '@renderer/components/GoBack'

const dummyClasses = [
    { name: 'First Grade' },
    { name: 'Second Grade' },
    { name: 'Third Grade' },
    { name: 'Fourth Grade' },
    { name: 'Fifth Grade' }
]
export default function ViewClassesPage(): JSX.Element {
    const { user } = useAuth()
    const [classes, setClasses] = useState<any[]>(dummyClasses)
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
            }
        }
        getData()
    }, [])

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
            <GoBack />
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg">
                <div className="bg-blue-600 text-white text-center py-4 rounded-t-lg">
                    <h2 className="text-2xl font-semibold">View Classes</h2>
                </div>

                <div className="p-6">
                    <ul className="divide-y divide-gray-300">
                        {classes.map((data, idx) => (
                            <ClassCard
                                key={idx}
                                college={data.college}
                                department={data.department}
                                name={data.name}
                                year={data.year}
                                id={data.id}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContextProvider'
import GoBack from '@renderer/components/GoBack'

type Student = {
    id: number
    name: string
    class_id: number
    image_uri: string
    college: string
    department: string
    year: string
    group: string
}

export default function ViewClassesPage(): JSX.Element {
    const { user } = useAuth()
    const [studentsByClass, setStudentsByClass] = useState<Record<number, Student[]>>({})
    const [expandedClass, setExpandedClass] = useState<number | null>(null)

    useEffect(() => {
        const getData = async () => {
            const res = await fetch('http://127.0.0.1:8000/students/all', {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                    'Content-Type': 'application/json'
                }
            })

            const data = await res.json()
            if (data.status === 401) {
                alert('Session expired, please login again')
                localStorage.removeItem('userData')
                window.location.href = '/login'
                return
            }
            console.log('API Response:', data)
            const grouped: Record<number, Student[]> = {}
            data.forEach((student: Student) => {
                console.log('Student class id:', student.class_id)
                if (!grouped[student.class_id]) grouped[student.class_id] = []
                // student.image_uri = student.image_uri.replace('jpg', 'svg')
                grouped[student.class_id].push(student)
            })
            console.log('Grouped Students:', grouped)
            setStudentsByClass(grouped)
        }

        getData()
    }, [user])

    const toggleClass = (classId: number) => {
        setExpandedClass((prev) => (prev === classId ? null : classId))
    }

    return (
        <div className="min-h-screen flex flex-col justify-start items-center bg-gray-100 p-6">
            <GoBack />
            <div className="max-w-5xl mx-auto space-y-6">
                {Object.entries(studentsByClass).map(([classId, students]) => (
                    <div key={classId} className="bg-white shadow-md rounded-lg">
                        <button
                            onClick={() => toggleClass(Number(classId))}
                            className="w-full text-left px-6 py-4 bg-blue-600 text-white text-xl font-semibold rounded-t-lg hover:bg-blue-700 transition"
                        >
                            Class {classId}
                        </button>

                        {expandedClass === Number(classId) && (
                            <div className="p-4 overflow-x-auto">
                                <table className="min-w-full text-sm text-left border border-gray-200 rounded">
                                    <thead className="bg-gray-200 text-gray-700">
                                        <tr>
                                            <th className="px-4 py-2">Image</th>
                                            <th className="px-4 py-2">Name</th>
                                            <th className="px-4 py-2">College</th>
                                            <th className="px-4 py-2">Department</th>
                                            <th className="px-4 py-2">Year</th>
                                            <th className="px-4 py-2">Group</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student) => (
                                            <tr key={student.id} className="border-t">
                                                <td className="px-4 py-2">
                                                    <img
                                                        src={student.image_uri}
                                                        alt={student.name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">{student.name}</td>
                                                <td className="px-4 py-2">{student.college}</td>
                                                <td className="px-4 py-2">{student.department}</td>
                                                <td className="px-4 py-2">{student.year}</td>
                                                <td className="px-4 py-2">{student.group}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

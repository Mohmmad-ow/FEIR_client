import React, { useEffect, useState } from 'react'
import GoBack from '@renderer/components/GoBack'
import { useAuth } from '../../context/AuthContextProvider'
export default function AssignStudentsPage(): JSX.Element {
    const [selectedClass, setSelectedClass] = useState<number>(0)
    const [classes, setClasses] = useState<unknown[]>([])
    const [students, setStudents] = useState([{ name: '', group: '', image: null }])
    const { user } = useAuth() // Get the logout function from AuthContext

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

    function handleStudentChange(index: number, field: string, value: string): void {
        const updatedStudents = [...students]
        updatedStudents[index][field] = value
        setStudents(updatedStudents)
    }

    function addStudentRow(): void {
        setStudents([...students, { name: '', group: '', image: null }])
    }

    function removeStudentRow(index: number): void {
        if (students.length > 1) {
            setStudents(students.filter((_, i) => i !== index))
        }
    }

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault()
        console.log('Students:', students)
        console.log('Selected Class:', selectedClass)
        for (const student of students) {
            const formData = new FormData()
            formData.append('name', student.name)
            formData.append('group', student.group)
            formData.append('college', 'information technology')
            formData.append('department', 'software engineering')
            formData.append('year', '1') // or dynamically set
            formData.append('image', student.image) // File object
            formData.append('class_id', selectedClass) // if applicable

            await fetch('http://localhost:8000/students/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access_token}`, // Add token
                    Accept: 'application/json'
                },
                body: formData
            })
        }

        console.log('Students Uploaded!')
    }

    return (
        <div className="min-h-screen bg-gray-100 flex gap-6 flex-col items-center justify-start pl-4 pr-4 pt-2">
            <GoBack />
            <div className="w-full max-w-3xl bg-white shadow-md rounded-lg">
                <div className="bg-blue-600 text-white text-center py-4 rounded-t-lg">
                    <h2 className="text-2xl font-semibold">Assign Students to Class</h2>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Class:
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => {
                                    setSelectedClass(Number(e.target.value))
                                    console.log(e.target.value)
                                }}
                                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                {classes.map((classItem: any, index: number) => (
                                    <option key={index} value={classItem.id}>
                                        {classItem.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4 overflow-x-auto">
                            <table className="w-full border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-2 border">Name</th>
                                        <th className="p-2 border">Group</th>
                                        <th className="p-2 border">Image URL</th>
                                        <th className="p-2 border">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, index) => (
                                        <tr key={index}>
                                            <td className="p-2 border">
                                                <input
                                                    type="text"
                                                    value={student.name}
                                                    onChange={(e) =>
                                                        handleStudentChange(
                                                            index,
                                                            'name',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border rounded-md p-1"
                                                    required
                                                />
                                            </td>
                                            <td className="p-2 border">
                                                <input
                                                    type="text"
                                                    value={student.group}
                                                    onChange={(e) =>
                                                        handleStudentChange(
                                                            index,
                                                            'group',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border rounded-md p-1"
                                                    required
                                                />
                                            </td>
                                            <td className="p-2 border">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e): void => {
                                                        const file = e.target.files?.[0] || null
                                                        const updatedStudents = [...students]
                                                        updatedStudents[index].image = file
                                                        setStudents(updatedStudents)
                                                    }}
                                                    className="w-full border rounded-md p-1"
                                                    required
                                                />
                                            </td>
                                            <td className="p-2 border text-center">
                                                {students.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeStudentRow(index)}
                                                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                                    >
                                                        -
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mb-4 text-center">
                            <button
                                type="button"
                                onClick={addStudentRow}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-green-700 transition"
                            >
                                + Add Student
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
                        >
                            Assign Students
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

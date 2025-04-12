import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContextProvider'
import GoBack from '@renderer/components/GoBack'

type Student = { name: string; group: string; id: number; class_id: number }
type ClassData = { class: { id: number; name: string }; students: Student }

export default function AddRemoveStudentsPage() {
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
    const [students, setStudents] = useState<Student[]>([])
    const [removedStudents, setRemovedStudents] = useState<Student[]>([])
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [classes, setClasses] = useState<ClassData[]>([])
    const { user } = useAuth()

    useEffect(() => {
        const getData = async (): Promise<void> => {
            try {
                const res = await fetch('http://127.0.0.1:8000/classes-students/all', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${user?.access_token}`,
                        'Content-Type': 'application/json'
                    }
                })
                const data = await res.json()
                if (data.detail === 'Could not validate credentials') {
                    alert('Session expired, please login again')
                    localStorage.removeItem('userData')
                    window.location.href = '/login'
                    return
                }
                console.log(data)
                setClasses(data)
                if (res.status === 200) {
                    setClasses(data)
                    setStudents(data[0].students)
                    setSelectedClassId(0)
                }
            } catch (err) {
                console.error(err)
                alert("Couldn't fetch class data.")
            }
        }

        getData()
    }, [])

    const handleClassChange = (id: number) => {
        setSelectedClassId(id)
        const filtered = classes[id].students
        console.log('Filtered Students:', filtered)
        setStudents(filtered)
        setRemovedStudents([])
    }

    const removeStudent = (index: number) => {
        const studentToRemove = students[index]
        setStudents((prev) => prev.filter((_, i) => i !== index))
        setRemovedStudents((prev) => [...prev, studentToRemove])
    }

    const handleSubmit = () => {
        setShowConfirmModal(true)
    }

    const confirmDelete = async (): Promise<void> => {
        console.log('Deleted Students:', removedStudents)
        if (removedStudents.length === 0) return
        try {
            const res = await fetch(`http://127.0.0.1:8000/students/delete`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    students: removedStudents.map((student) => student.id)
                })
            })
            const data = await res.json()
            if (data.detail === 'Could not validate credentials') {
                alert('Session expired, please login again')
                localStorage.removeItem('userData')
                window.location.href = '/login'
                return
            }
            if (res.status === 200) {
                console.log('API Response:', data)
                setStudents((prev) => prev.filter((student) => !removedStudents.includes(student)))
                alert('Students removed successfully')
            } else {
                {
                    console.error('Error:', data)
                    alert('Failed to remove students.')
                }
            }
        } catch (err) {
            console.error(err)
            alert("Couldn't delete students.")
        } finally {
            setRemovedStudents([])
            setShowConfirmModal(false)
        }
    }

    return (
        <div className="min-h-screen flex-col bg-gray-100 flex items-center justify-start p-4">
            <GoBack />
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg">
                <div className="bg-blue-600 text-white text-center py-4 rounded-t-lg">
                    <h2 className="text-2xl font-semibold">Add/Remove Students from a Class</h2>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Class:
                        </label>
                        <select
                            value={selectedClassId || 0}
                            onChange={(e) => handleClassChange(Number(e.target.value))}
                            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {classes.map((data, idx) => (
                                <option key={idx} value={idx}>
                                    {data.class.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-medium mb-2">Current Students</h3>
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2 border">Name</th>
                                    <th className="p-2 border">Group</th>
                                    <th className="p-2 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((entry, index: number) => (
                                    <tr key={index}>
                                        <td className="p-2 border text-center">{entry.name}</td>
                                        <td className="p-2 border text-center">{entry.group}</td>
                                        <td className="p-2 border text-center">
                                            <button
                                                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                                onClick={() => removeStudent(index)}
                                            >
                                                −
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {removedStudents.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-lg font-medium mb-2 text-red-600">
                                Removed Students
                            </h3>
                            <table className="w-full border border-gray-300">
                                <thead>
                                    <tr className="bg-red-100">
                                        <th className="p-2 border">Name</th>
                                        <th className="p-2 border">Group</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {removedStudents.map((student, index) => (
                                        <tr key={index}>
                                            <td className="p-2 border text-center">
                                                {student.name}
                                            </td>
                                            <td className="p-2 border text-center">
                                                {student.group}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="text-center">
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            onClick={handleSubmit}
                            disabled={removedStudents.length === 0}
                        >
                            Submit Removed Students
                        </button>
                    </div>
                </div>
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4 text-red-600">
                            Confirm Deletion
                        </h3>
                        <p>Are you sure you want to delete the following students?</p>
                        <ul className="my-4 list-disc list-inside text-sm text-gray-700">
                            {removedStudents.map((student, idx) => (
                                <li key={idx}>
                                    {student.name} (Group {student.group})
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                onClick={confirmDelete}
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

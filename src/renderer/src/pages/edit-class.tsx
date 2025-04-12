import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContextProvider'
import GoBack from '@renderer/components/GoBack'

interface ClassItem {
    id: number
    name: string
    college: string
    department: string
    year: number
}

export default function EditClassPage(): JSX.Element {
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
    const [updatedClass, setUpdatedClass] = useState<ClassItem>({
        id: 0,
        name: '',
        college: '',
        department: '',
        year: 1
    })
    const [classes, setClasses] = useState<ClassItem[]>([])
    const { user } = useAuth()

    useEffect(() => {
        const getData = async (): Promise<void> => {
            const response = await fetch('http://127.0.0.1:8000/classes/all', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()

            if (response.status === 401) {
                alert('Session expired, please login again')
                window.localStorage.removeItem('userData')
                window.location.href = '/login'
                return
            }

            console.log('API Response:', data)
            setClasses(data)
            if (data.length > 0) {
                setSelectedClassId(data[0].id)
                setUpdatedClass(data[0])
            }
        }

        getData()
    }, [user])

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()
        if (selectedClassId === null) return

        try {
            console.log('Class Updated:', updatedClass)
            const response = await fetch(`http://127.0.0.1:8000/classes/edit/${selectedClassId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: updatedClass.name,
                    college: updatedClass.college,
                    department: updatedClass.department,
                    year: updatedClass.year
                })
            })

            const result = await response.json()
            console.log('Class Updated:', result)

            if (response.ok) {
                alert('Class updated successfully!')
            } else {
                alert('Failed to update class.')
            }
        } catch (error) {
            console.error('Error updating class:', error)
            alert('Failed to update class. Please try again.')
        }
    }

    const onSelectClass = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const classId = Number(e.target.value)
        const selected = classes.find((cls) => cls.id === classId)
        if (selected) {
            setSelectedClassId(classId)
            setUpdatedClass(selected)
        }
    }

    return (
        <div className="min-h-screen flex-col bg-gray-100 flex items-center justify-start p-4">
            <GoBack />
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg">
                <div className="bg-blue-600 text-white text-center py-4 rounded-t-lg">
                    <h2 className="text-2xl font-semibold">Edit Class</h2>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Class to Edit:
                            </label>
                            <select
                                value={selectedClassId || ''}
                                onChange={onSelectClass}
                                className="w-full border rounded-md p-2"
                            >
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Class Name:
                            </label>
                            <input
                                type="text"
                                value={updatedClass.name}
                                onChange={(e) =>
                                    setUpdatedClass((prev) => ({ ...prev, name: e.target.value }))
                                }
                                className="w-full border rounded-md p-2"
                                required
                            />
                        </div>
                        <div className="flex gap-8">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    College:
                                </label>
                                <input
                                    type="text"
                                    value={updatedClass.college}
                                    onChange={(e) =>
                                        setUpdatedClass((prev) => ({
                                            ...prev,
                                            college: e.target.value
                                        }))
                                    }
                                    className="w-full border rounded-md p-2"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department:
                                </label>
                                <input
                                    type="text"
                                    value={updatedClass.department}
                                    onChange={(e) =>
                                        setUpdatedClass((prev) => ({
                                            ...prev,
                                            department: e.target.value
                                        }))
                                    }
                                    className="w-full border rounded-md p-2"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Year:
                                </label>
                                <input
                                    type="number"
                                    value={updatedClass.year}
                                    onChange={(e) =>
                                        setUpdatedClass((prev) => ({
                                            ...prev,
                                            year: Number(e.target.value)
                                        }))
                                    }
                                    className="w-full border rounded-md p-2"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
                        >
                            Update Class
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

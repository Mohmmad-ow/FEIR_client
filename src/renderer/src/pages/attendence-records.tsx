import GoBack from '@renderer/components/GoBack'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContextProvider'

interface AttendanceStudent {
    id: number
    isPresent: boolean
    hours: number
    name: string
}
// class data: name='2nd Class' college='Sceince' year=3 id=2 department='Pysics'

interface AttendanceRecord {
    record_id: number
    date_created: string
    class: {
        id: number
        name: string
        department: string
        college: string
        year: number
    },
    class_id: number
    user_id: number
    total_students: number
    attended_students: number
    students: AttendanceStudent[]
    attendance_percentage: number
}

export default function AttendanceRecords(): JSX.Element {
    const [records, setRecords] = useState<AttendanceRecord[]>([])
    const [advancedSearch, setAdvancedSearch] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [date, setDate] = useState('')
    const [college, setCollege] = useState('')
    const [department, setDepartment] = useState('')
    const [year, setYear] = useState('')
    const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)

    const { user } = useAuth()

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await fetch('http://localhost:8000/records/summary', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.access_token}`
                    }
                }) // Adjust if base URL is different
                const data = await res.json()
                setRecords(data)
                console.log('Response:', data)
            } catch (error) {
                console.error('Error fetching records:', error)
            }
        }
        fetchRecords()
    }, [])
    const onClassInsight = (recordId: number) => {
        const record = records.find((record) => record.record_id === recordId)
        console.log(record)
        if (record) {
            setSelectedRecord(record)
        } else {
            console.error('Record not found')
        }
    }

    const filteredRecords = records.filter((record) => {
        const className = record.class?.name?.toLowerCase() || ''
        const matchesSearch = className.includes(searchTerm.toLowerCase())
        const matchesDate = date ? record.date_created.startsWith(date) : true
        return matchesSearch && matchesDate
    })

    return (
        <div className="p-6 flex flex-col bg-gray-100 min-h-screen">
            <GoBack />
            <h2 className="text-center text-2xl font-bold text-blue-700">Attendance Records</h2>

            <div className="mt-4 flex flex-wrap gap-4 items-center justify-center">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Search class..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded"
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => setAdvancedSearch(!advancedSearch)}
                >
                    Advanced Search
                </button>
            </div>

            {advancedSearch && (
                <div className="mt-4 flex flex-wrap gap-4 items-center justify-center">
                    <input
                        type="text"
                        placeholder="College"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="border p-2 rounded"
                    />
                </div>
            )}

            <div className="mt-6 border rounded overflow-hidden">
                <table className="w-full border-collapse text-center">
                    <thead className="bg-gray-300">
                        <tr>
                            <th className="p-2">Class</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Attendance%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.length > 0 ? (
                            filteredRecords.map((record, key) => (
                                <tr
                                    key={key}
                                    onClick={() => onClassInsight(record.record_id)}
                                    className="border-t"
                                >
                                    <td className="p-2">
                                        {record.class?.name || `Class #${record.class?.id}`}
                                    </td>
                                    <td className="p-2">
                                        {new Date(record.date_created).toLocaleDateString()}
                                    </td>
                                    <td className="p-2">
                                        {record.attendance_percentage.toFixed(2)}%
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="p-4 text-gray-500">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex gap-4 justify-center">
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Export to Excel
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Export to PDF</button>
            </div>

            <h2 className="mt-6 text-center text-2xl font-bold text-blue-700">
                Attendance Insights
            </h2>
            <div className="mt-4 bg-gray-300 rounded">
                <p className="text-center p-4">Attendance insights will be displayed here.</p>
                {selectedRecord && (
                    <table className='w-full border-collapse text-center'>

                        <thead className="bg-gray-300">
                            <tr className="border-t">
                                <th className="p-2">Student Name</th>
                                <th className="p-2">Attendance Status</th>
                                <th className="p-2">Hours Attended</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedRecord.students.map((student, key) => (
                                <tr key={key} className="border-t hover:bg-gray-200 cursor-pointer"> 
                                    <td className="p-2">{student.name}</td>
                                    <td className="p-2">
                                        {student.isPresent ? 'Present' : 'Absent'}
                                    </td>
                                    <td className="p-2">{student.hours}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

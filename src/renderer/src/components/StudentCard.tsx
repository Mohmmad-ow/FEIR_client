import { useState } from 'react'
interface StudentCardProps {
    id: number
    name: string
    group: string
    college: string
    department: string
    year: number
    class_id: number
    Image_URI: string
}
export default function StudentClass(studentInfo: StudentCardProps): JSX.Element {
    const [moreInfo, setMoreInfo] = useState(false)
    if (moreInfo) {
        return (
            <li
                onClick={() => setMoreInfo(!moreInfo)}
                className="py-3 text-lg font-medium hover:bg-gray-300 text-gray-700 text-center transition-shadow duration-300 ease-in-out cursor-pointer"
            >
                {studentInfo.name}
            </li>
        )
    }
    return (
        <li>
            <div
                className="bg-white p-4 rounded-lg hover:bg-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
                onClick={() => setMoreInfo(!moreInfo)}
            >
                <h3 className="text-xl font-semibold">{studentInfo.name}</h3>
                <p className="text-gray-600">College: {studentInfo.college}</p>
                <p className="text-gray-600">Department: {studentInfo.department}</p>
                <p className="text-gray-600">Year: {studentInfo.year}</p>
            </div>
        </li>
    )
}

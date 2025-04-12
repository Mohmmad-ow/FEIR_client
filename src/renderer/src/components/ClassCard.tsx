import { useState } from "react";
interface ClassCardProps {
    name: string;
    college: string;
    department: string;
    year: number;
    id: number;
}
export default function ClassCard(classInfo: ClassCardProps): JSX.Element {
    const [moreInfo, setMoreInfo] = useState(false);
    if (moreInfo) {


        return (
            <li
                onClick={() => setMoreInfo(!moreInfo)}
                className="py-3 text-lg font-medium hover:bg-gray-300 text-gray-700 text-center transition-shadow duration-300 ease-in-out cursor-pointer"
            >
                {classInfo.name}
            </li>
        )
    }
    return (
        <li>
            <div
                className="bg-white p-4 rounded-lg hover:bg-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
                onClick={() => setMoreInfo(!moreInfo)}
            >
                <h3 className="text-xl font-semibold">{classInfo.name}</h3>
                <p className="text-gray-600">College: {classInfo.college}</p>
                <p className="text-gray-600">Department: {classInfo.department}</p>
                <p className="text-gray-600">Year: {classInfo.year}</p>
            </div>
        </li>
    )
}
import GoBack from "@renderer/components/GoBack";
import { useState } from "react";

export default function AttendanceRecords(): JSX.Element {
    const [advancedSearch, setAdvancedSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [date, setDate] = useState("");
    const [college, setCollege] = useState("");
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState("");

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
                        <tr className="border-t">
                            <td className="p-2">Sample Class</td>
                            <td className="p-2">01/01/2025</td>
                            <td className="p-2">95%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex gap-4 justify-center">
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Export to Excel</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Export to PDF</button>
            </div>

            <h2 className="mt-6 text-center text-2xl font-bold text-blue-700">Attendance Insights</h2>
            <div className="mt-4 h-40 bg-gray-300 rounded"></div>
        </div>
    );
}

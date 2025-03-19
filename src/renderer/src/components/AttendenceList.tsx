const dummyAttendanceData: { className: string, date: string, attendancePercentage: number }[] = [
    { className: 'Math', date: '2023-10-01', attendancePercentage: 95 },
    { className: 'Science', date: '2023-10-02', attendancePercentage: 88 },
    { className: 'History', date: '2023-10-03', attendancePercentage: 92 },
    { className: 'English', date: '2023-10-04', attendancePercentage: 85 },
    { className: 'Art', date: '2023-10-05', attendancePercentage: 90 }
]
export default function AttendanceList() {
    return (
        <div className="border flex flex-col gap-2 border-gray-300 rounded-xl p-2 w-[80%]  mt-12 shadow-xl">
            <p className="text-center mb-4 text-xl">Last 5 attendance records</p>
            <table className="mx-auto w-full ">
                <thead>
                    <tr className="bg-blue-600 text-white ">
                        <th className="p-3 text-xl">Class Name</th>
                        <th className="p-3 text-xl">Date</th>
                        <th className="p-3 text-xl">Attendance</th>
                    </tr>
                </thead>
                <tbody>

                    {dummyAttendanceData.map((data, idx) => (
                        <tr onClick={() => { console.log(data) }} key={idx} className="bg-gray-500 hover:bg-gray-700 cursor-pointer text-white border-2 border-gray-300">
                            <td className="text-center p-2 text-lg">{data.className}</td>
                            <td className="text-center p-2 text-lg">{data.date}</td>
                            <td className="text-center p-2 text-lg">{data.attendancePercentage}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

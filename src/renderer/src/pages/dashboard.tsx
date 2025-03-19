import Navbar from "@renderer/components/navbar"
import AttendanceList from "@renderer/components/AttendenceList"
export default function Dashboard() {



    return (
        <div className="bg-white">
            <Navbar />
            <div className="flex flex-col justify-center items-center w-full">
                <div className="flex justify-center w-full mt-12 ">
                    <button className="text-white text-xl bg-blue-700 w-[30%] h-14 rounded-lg flex justify-center items-center">+ New Attendance Record</button>
                </div>
                <AttendanceList />
            </div>
        </div>
    )
}
import GoBack from "@renderer/components/GoBack"
export default function settings(): React.ReactElement {



    return (
        <div className="flex flex-col p-4 bg-white justify-center items-center h-screen ">
            <GoBack />
            <div className="flex flex-col justify-center items-center w-[70%] gap-12  shadow-inner rounded-xl shadow-gray-600 p-8 bg-white">
                <h1 className="text-blue-600 text-xl font-bold">Settings Page</h1>
                <div className="flex flex-col gap-4">
                    <div className="rounded-lg text-left p-2  pl-4 pr-4 text-lg text-blue-600 bg-gray-400">
                        <h2 className="w-[80%]">Change  Username/Password</h2>
                    </div>
                    <div className="rounded-lg text-left p-2  pl-4 pr-4 text-lg text-blue-600 bg-gray-400">
                        <h2 className="w-[80%]" >Update Profile Picture</h2>
                    </div>
                    <div className="rounded-lg text-left p-2  pl-4 pr-4 text-lg text-blue-600 bg-gray-400">
                        <h2 className="w-[80%]" >Set Preferred College (Default Selection)</h2>
                    </div>
                    <div className="rounded-lg text-left p-2  pl-4 pr-4 text-lg text-blue-600 bg-gray-400">
                        <h2 className="w-[80%]" >Theme Customization(Optional)</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}
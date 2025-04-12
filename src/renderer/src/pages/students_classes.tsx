// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function StudentsClassesPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white shadow-md rounded-lg">
                <div className="bg-blue-600 text-white text-center py-4 rounded-t-lg">
                    <h2 className="text-2xl font-semibold">Classes & Students Info Page</h2>
                </div>

                <div className="p-6">
                    {/* Manage Classes Section */}
                    <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
                        <h3 className="text-lg font-bold mb-2">Manage Classes</h3>
                        <ul className="text-blue-700 space-y-2">
                            <li>
                                <a href="/add-class" className="underline">
                                    Add Class
                                </a>
                            </li>
                            <li>
                                <a href="/edit-class" className="underline">
                                    Edit Class
                                </a>
                            </li>
                            <li>
                                <a href="/remove-class" className="underline">
                                    Remove Class
                                </a>
                            </li>
                            <li>
                                <a href="/view-class" className="underline">
                                    View Classes
                                </a>
                            </li>
                            <li>
                                <a href="/assign-students" className="underline">
                                    Assign Students to Classes
                                </a>
                            </li>
                            <li>
                                <a href="/view-students" className="underline">
                                    View Students (all)
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Manage Students Section */}
                    <div className="bg-white shadow-sm rounded-lg p-4">
                        <h3 className="text-lg font-bold mb-2">Manage Students</h3>
                        <ul className="text-blue-700 space-y-2">
                            <li>
                                <a href="/assign-students/edit" className="underline">
                                    Add/Remove Students from a Class
                                </a>
                            </li>
                            <li>
                                <a href="/attendance-records" className="underline">
                                    Filter Students by Group, College, Year
                                </a>
                            </li>
                            <li>
                                <a href="/attendance-records" className="underline">
                                    View Student Attendance Data
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

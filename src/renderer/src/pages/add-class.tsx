import React, { useState } from "react";
import { useAuth } from "../../context/AuthContextProvider";
import GoBack from "@renderer/components/GoBack";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function AddClassPage() {
    const [className, setClassName] = useState("");
    const [college, setCollege] = useState("");
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState<number>(1);

    const { user } = useAuth(); // Get the user data from AuthContext

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleSubmit = async () => {
        // e.preventDefault();
        console.log("Class Added:", className);
        setClassName("");

        try {
            let response = await fetch("http://127.0.0.1:8000/classes/create", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user?.access_token}`, // Add token
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: className, college, department, year: year.toString() }),
            });
            response = await response.json();
            console.log(response); 
        } catch (error) {
            console.error("Error adding class:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
            <GoBack />
            <div className="w-full max-w-lg bg-gray-300 shadow-md rounded-lg">
                <div className="bg-blue-600 text-white text-center py-4 rounded-t-lg">
                    <h2 className="text-2xl font-semibold">Add Class</h2>
                </div>

                <div className="p-6">
                    <form >
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Class Name:
                            </label>
                            <input
                                type="text"
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                                    value={college}
                                    onChange={(e) => setCollege(e.target.value)}
                                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department:
                                </label>
                                <input
                                    type="text"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Year:
                                </label>
                                <input
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            type="button"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
                        >
                            Add Class
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};



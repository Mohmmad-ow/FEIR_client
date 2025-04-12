// eslint-disable-next-line @typescript-eslint/explicit-function-return-type

import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContextProvider'
import GoBack from '@renderer/components/GoBack'
export default function AttendanceProcessingPage(): JSX.Element {
    const [image, setImage] = useState<File | null>(null)
    const [classId, setClassId] = useState<number>(0)
    const [classes, setClasses] = useState<any[]>([])
    const { user } = useAuth()

    useEffect(() => {
        const getData = async () => {
            let response = await fetch('http://127.0.0.1:8000/classes/all', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user?.access_token}`, // Add token
                    'Content-Type': 'application/json'
                }
            })
            response = await response.json()
            if (response.status === 401) {
                alert('Session expired, please login again')
                window.localStorage.removeItem('userData')
                window.location.href = '/login'
                return
            } else {
                console.log('API Response:', response)
                setClasses(response)
            }
        }
        getData()
    }, [])

    async function onProcess(): Promise<void> {
        if (!image) {
            alert('Please upload an image/video and select a class/group.');
            return;
        }

        const formData = new FormData();
        formData.append('classroom_image', image);
        formData.append('class_id', classId.toString());

        try {
            const response = await fetch('http://127.0.0.1:8000/attendance/recognize', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access_token}`, // Add token
                },
                body: formData,
            });

            const result = await response.json();

            if (response.status === 401) {
                alert('Session expired, please login again');
                window.localStorage.removeItem('userData');
                window.location.href = '/login';
                return;
            }

            if (response.ok) {
                alert('Attendance processed successfully!');
                console.log('Result:', result);
            } else {
                alert(`Error: ${result.message || 'Failed to process attendance'}`);
            }
        } catch (error) {
            console.error('Error processing attendance:', error);
            alert('An error occurred while processing attendance.');
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-4">
            <GoBack />
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6">
                    Attendance Processing Page
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Video/Image:
                    </label>
                    <input
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                                setImage(file)
                            }
                        }}
                        accept="image/*,video/*"
                        type="file"
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Class/Group:
                    </label>
                    <select
                        value={classId}
                        onChange={(e) => setClassId(Number(e.target.value))}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        {classes.map((data) => (
                            <option key={data.id} value={data.id}>
                                {data.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button 
                    onClick={onProcess}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition mb-3">
                    Submit & View Results
                </button>
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg text-lg font-medium hover:bg-blue-600 transition">
                    Edit Data Manually
                </button>
            </div>
        </div>
    )
}

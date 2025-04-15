import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Container,
    MenuItem,
    Select,
    Typography,
    InputLabel,
    FormControl,
    TextField
} from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'
import { useAuth } from '../../context/AuthContextProvider'
import GoBack from '@renderer/components/GoBack'
import * as XLSX from 'xlsx'

type Student = {
    id: number
    name: string
    attended: boolean
}

export default function AttendanceProcessingPage(): JSX.Element {
    const [image, setImage] = useState<File | null>(null)
    const [classId, setClassId] = useState<number>(0)
    const [classes, setClasses] = useState<any[]>([])
    const [studentsAttended, setStudentsAttended] = useState<GridRowsProp>([])
    const { user } = useAuth()

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'attended', headerName: 'Attended', width: 120, type: 'boolean', editable: true },
        { field: 'name', headerName: 'Name', width: 180 }
    ]

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/classes/all', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${user?.access_token}`,
                        'Content-Type': 'application/json'
                    }
                })
                const data = await res.json()
                if (res.status === 401) {
                    alert('Session expired, please login again')
                    localStorage.removeItem('userData')
                    window.location.href = '/login'
                } else {
                    setClasses(data)
                }
            } catch (err) {
                console.error(err)
            }
        }
        if (user?.access_token) getData()
    }, [user?.access_token])

    const onHandleAttendanceSubmit = async (): Promise<void> => {
        if (!user?.access_token) return

        const student_list = studentsAttended.map((student) => ({
            student_id: student.id,
            isPresent: student.attended,
            hours: 2
        }))

        try {
            const res = await fetch('http://127.0.0.1:8000/records/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ class_id: classId, student_list })
            })

            const data = await res.json()
            if (res.status === 401) {
                alert('Session expired, please login again')
                localStorage.removeItem('userData')
                window.location.href = '/login'
                return
            }

            if (res.ok) {
                alert('Attendance submitted successfully!')
                setStudentsAttended([])
                console.log('API Response', data)
            } else {
                alert('Failed to submit attendance')
                console.error(data)
            }
        } catch (error) {
            console.error('Error:', error)
            alert('An error occurred while submitting attendance.')
        }
    }

    const exportToExcel = () => {
        const worksheetData = studentsAttended.map((row) => ({
            ID: row.id,
            Name: row.name,
            Attended: row.attended ? 'Yes' : 'No'
        }))

        const worksheet = XLSX.utils.json_to_sheet(worksheetData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance')

        XLSX.writeFile(workbook, 'Attendance_Report.xlsx')
    }

    const onProcess = async (): Promise<void> => {
        if (!image || !classId) {
            alert('Please upload an image/video and select a class/group.')
            return
        }

        const formData = new FormData()
        formData.append('classroom_image', image)
        formData.append('class_id', classId.toString())

        try {
            const res = await fetch('http://127.0.0.1:8000/attendance/recognize', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                },
                body: formData
            })

            const result = await res.json()

            if (res.status === 401) {
                alert('Session expired, please login again')
                localStorage.removeItem('userData')
                window.location.href = '/login'
                return
            }

            if (res.ok) {
                const newStudents = result.present.map((student: any) => ({
                    id: student.id,
                    name: student.name,
                    attended: true
                }))

                setStudentsAttended((prev) => {
                    const existingIds = new Set(prev.map((s) => s.id))
                    const combined = [...prev]
                    newStudents.forEach((s) => {
                        if (!existingIds.has(s.id)) {
                            combined.push(s)
                        }
                    })
                    return combined
                })

                alert('Attendance processed successfully!')
            } else {
                alert(result.error || 'Failed to process attendance')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('An error occurred while processing attendance.')
        }
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <GoBack />
            <Box
                sx={{
                    backgroundColor: 'white',
                    boxShadow: 3,
                    borderRadius: 2,
                    p: 4,
                    mb: 4,
                    mt: 4
                }}
            >
                <Typography variant="h5" gutterBottom align="center" color="primary">
                    Attendance Processing Page
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <InputLabel>Upload Video/Image</InputLabel>
                    <TextField
                        type="file"
                        fullWidth
                        inputProps={{ accept: 'image/*,video/*' }}
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) setImage(file)
                        }}
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel>Select Class/Group</InputLabel>
                        <Select
                            fullWidth
                            value={classId}
                            onChange={(e) => setClassId(Number(e.target.value))}
                            displayEmpty
                        >
                            <MenuItem value={0} disabled>
                                Select a class
                            </MenuItem>
                            {classes.map((cls) => (
                                <MenuItem key={cls.id} value={cls.id}>
                                    {cls.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={onProcess}
                    sx={{ mb: 2 }}
                >
                    Submit & View Results
                </Button>
                <Button
                    onClick={exportToExcel}
                    disabled={studentsAttended.length === 0}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                >
                    Export to Excel
                </Button>
            </Box>

            <Box
                sx={{
                    backgroundColor: 'white',
                    boxShadow: 2,
                    borderRadius: 2,
                    p: 3
                }}
            >
                <Typography variant="h6" gutterBottom align="center" color="primary">
                    Attendance Results
                </Typography>
                <DataGrid
                    rows={studentsAttended}
                    columns={columns}
                    pageSize={10}
                    autoHeight
                    disableSelectionOnClick
                />
            </Box>

            <Box sx={{ mb: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={onHandleAttendanceSubmit}
                    sx={{ mt: 2 }}
                >
                    Submit Attendance
                </Button>
            </Box>
        </Container>
    )
}

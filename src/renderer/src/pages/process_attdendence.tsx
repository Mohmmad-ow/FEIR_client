// Import block remains unchanged
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
    TextField,
    Snackbar,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
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
    const [files, setFiles] = useState<File[]>([])
    const [classId, setClassId] = useState<number>(0)
    const [lastClassId, setLastClassId] = useState<number>(0)
    const [classes, setClasses] = useState<any[]>([])
    const [studentsAttended, setStudentsAttended] = useState<GridRowsProp>([])
    const [loading, setLoading] = useState(false)
    const [resetDialogOpen, setResetDialogOpen] = useState(false)
    const { user } = useAuth()

    const [mediaType, setMediaType] = useState<'image' | 'video'>('image')

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    })

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity })
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'attended',
            headerName: 'Attended',
            width: 120,
            type: 'boolean',
            editable: true
        },
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
                    localStorage.removeItem('userData')
                    window.location.href = '/login'
                } else {
                    setClasses(data)
                }
            } catch (err) {
                console.error(err)
                showSnackbar('Failed to fetch class data', 'error')
            }
        }
        if (user?.access_token) getData()
    }, [user?.access_token])

    const onProcess = async (): Promise<void> => {
        if (files.length === 0 || !classId) {
            showSnackbar('Please upload file(s) and select a class.', 'error')
            return
        }

        setLoading(true)
        const formData = new FormData()

        const isImage = mediaType === 'image'
        const fileKey = isImage ? 'classroom_images' : 'video_file'
        files.forEach((file) => formData.append(fileKey, file))

        formData.append('class_id', classId.toString())
        console.log('Form data:', formData)
        const endpoint = isImage
            ? 'http://127.0.0.1:8000/attendance/recognize'
            : 'http://127.0.0.1:8000/attendance/recognize_from_video'

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                },
                body: formData
            })

            const result = await res.json()
            console.log('Result:', result)
            if (res.status === 401) {
                localStorage.removeItem('userData')
                window.location.href = '/login'
                return
            }

            if (res.ok) {
                const newStudents = [
                    ...result.present.map((student: any) => ({
                        id: student.id,
                        name: student.name,
                        attended: true
                    })),
                    ...result.absent.map((student: any) => ({
                        id: student.id,
                        name: student.name,
                        attended: false
                    }))
                ]

                setStudentsAttended((prev) => {
                    const existing = new Map(prev.map((s) => [s.id, s]))
                    newStudents.forEach((s) => {
                        if (!existing.has(s.id)) {
                            existing.set(s.id, s)
                        }
                    })
                    return Array.from(existing.values())
                })

                showSnackbar('Attendance processed successfully!', 'success')
            } else {
                showSnackbar(result.error || 'Failed to process attendance', 'error')
            }
        } catch (error) {
            console.error('Error:', error)
            showSnackbar('An error occurred while processing attendance', 'error')
        } finally {
            setLoading(false)
        }
    }

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
                localStorage.removeItem('userData')
                window.location.href = '/login'
                return
            }

            if (res.ok) {
                setStudentsAttended([])
                showSnackbar('Attendance submitted successfully!', 'success')
            } else {
                showSnackbar('Failed to submit attendance', 'error')
            }
        } catch (error) {
            console.error('Error:', error)
            showSnackbar('Error occurred while submitting attendance', 'error')
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

    const handleClassChange = (e: any) => {
        const newClassId = Number(e.target.value)
        if (studentsAttended.length > 0 && newClassId !== classId) {
            setResetDialogOpen(true)
        }
        setLastClassId(classId)
        setClassId(newClassId)
    }

    const resetAttendance = () => {
        setStudentsAttended([])
        setResetDialogOpen(false)
    }

    const handleRowEditCommit = (params: any) => {
        const { id, field, value } = params
        setStudentsAttended((prev) =>
            prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
        )
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <GoBack />
            <Box
                sx={{ backgroundColor: 'white', boxShadow: 3, borderRadius: 2, p: 4, mb: 4, mt: 4 }}
            >
                <Typography variant="h5" gutterBottom align="center" color="primary">
                    Attendance Processing Page
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <FormControl sx={{ flex: 1 }}>
                        <InputLabel>Media Type</InputLabel>
                        <Select
                            value={mediaType}
                            label="Media Type"
                            onChange={(e) => {
                                setFiles([])
                                setMediaType(e.target.value as 'image' | 'video')
                            }}
                        >
                            <MenuItem value="image">Image(s)</MenuItem>
                            <MenuItem value="video">Video</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ flex: 2 }}>
                        <InputLabel>Upload File(s)</InputLabel>
                        <TextField
                            type="file"
                            fullWidth
                            inputProps={{
                                accept: mediaType === 'image' ? 'image/*' : 'video/*',
                                multiple: mediaType === 'image'
                            }}
                            onChange={(e) => {
                                const selectedFiles = Array.from(e.target.files || [])
                                setFiles(selectedFiles)
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel>Select Class/Group</InputLabel>
                        <Select fullWidth value={classId} onChange={handleClassChange} displayEmpty>
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

                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={resetAttendance}
                >
                    Reset Attendance
                </Button>
            </Box>

            <Box sx={{ backgroundColor: 'white', boxShadow: 2, borderRadius: 2, p: 3 }}>
                <Typography variant="h6" gutterBottom align="center" color="primary">
                    Attendance Results
                </Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <DataGrid
                        rows={studentsAttended}
                        columns={columns}
                        editMode="cell"
                        processRowUpdate={(newRow) => {
                            setStudentsAttended((prevRows) =>
                                prevRows.map((row) => (row.id === newRow.id ? newRow : row))
                            )
                            return newRow
                        }}
                        onProcessRowUpdateError={(error) => {
                            console.error('Row update error:', error)
                            showSnackbar('Failed to update row', 'error')
                        }}
                        getRowId={(row) => row.id}
                    />
                )}
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

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity as 'success' | 'error'}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
                <DialogTitle>Reset Attendance?</DialogTitle>
                <DialogContent>
                    Changing the class will reset current attendance data. Are you sure?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
                    <Button onClick={resetAttendance} color="error">
                        Reset
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

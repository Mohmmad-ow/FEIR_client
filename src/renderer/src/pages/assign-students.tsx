import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Container,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    IconButton,
    Snackbar,
    Paper,
    Alert
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContextProvider'
import GoBack from '@renderer/components/GoBack'

interface Student {
    id: number
    name: string
    image: string | null
}
interface AssignedStudent {
    id: number
    name: string
    image: string | null
    group_name: string | null
}
interface ClassData {
    id: number
    name: string
    students: AssignedStudent[]
    college: string
    department: string
    year: number
}

export default function AssignStudentsPage(): JSX.Element {
    const [selectedClass, setSelectedClass] = useState<number>(0)
    const [classes, setClasses] = useState<ClassData[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [assignments, setAssignments] = useState<any[]>([])
    const [selectedStudentToAdd, setSelectedStudentToAdd] = useState('')
    const [selectedGroupToAdd, setSelectedGroupToAdd] = useState('')
    const [snackbar, setSnackbar] = useState<{
        open: boolean
        message: string
        severity: 'success' | 'error'
    }>({
        open: false,
        message: '',
        severity: 'success'
    })
    const { user } = useAuth()

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const res = await fetch('http://127.0.0.1:8000/students/assign-to-class', {
                    headers: {
                        Authorization: `Bearer ${user?.access_token}`
                    }
                })
                const data = await res.json()
                if (res.status === 401) {
                    setSnackbar({
                        open: true,
                        message: 'Session expired, please login again',
                        severity: 'error'
                    })
                    // alert('Session expired, please login again')
                    window.localStorage.removeItem('userData')
                    window.location.href = '/login'
                    return
                }
                setClasses(data.classes)
                setStudents(data.students)
                console.log('API response:', data)
            } catch (error) {
                console.error('Failed to fetch data:', error)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (!selectedClass || students.length === 0) return

        const selectedClassData = classes.find((cls) => cls.id === selectedClass)
        if (!selectedClassData) return

        const assigned = selectedClassData.students.map((student: any) => ({
            student_id: student.id.toString(),
            group_name: student.group_name || ''
        }))

        setAssignments(assigned)
    }, [selectedClass, students, classes])

    const handleAssignmentChange = (index: number, field: string, value: any) => {
        const updated = [...assignments]
        updated[index][field] = value
        setAssignments(updated)
    }

    const handleAddStudentToAssignment = () => {
        if (!selectedStudentToAdd) return

        const alreadyInList = assignments.some((a) => a.student_id === selectedStudentToAdd)
        if (alreadyInList) return

        setAssignments((prev) => [
            ...prev,
            { student_id: selectedStudentToAdd, group_name: selectedGroupToAdd }
        ])
        setSelectedStudentToAdd('')
        setSelectedGroupToAdd('')
    }

    const removeAssignmentRow = (index: number) => {
        setAssignments((prev) => {
            const removed = prev[index]
            const remaining = prev.filter((_, i) => i !== index)
            return remaining
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const payload = {
            class_id: selectedClass,
            students: assignments
                .filter((a) => a.student_id)
                .map((a) => ({
                    student_id: parseInt(a.student_id),
                    group_name: a.group_name || undefined
                }))
        }

        try {
            const res = await fetch('http://127.0.0.1:8000/students/assign-to-class', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            console.log('Payload:', payload)
            const data = await res.json()

            if (res.status === 200) {
                setSnackbar({
                    open: true,
                    message: 'Students assigned successfully!',
                    severity: 'success'
                })
                console.log(data)
            } else {
                setSnackbar({
                    open: true,
                    message: data.detail || 'Unknown error',
                    severity: 'error'
                })
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Something went wrong while assigning students.',
                severity: 'error'
            })
            console.error(err)
        }
    }

    const getStudentNameById = (id: number) => {
        const student = students.find((s) => s.id === id)
        return student?.name || 'Unknown'
    }

    const assignedStudentIds = assignments.map((a) => a.student_id)

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <GoBack />
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
                    Assign Students to Class
                </Typography>

                <Box sx={{ my: 2 }}>
                    <Typography variant="subtitle1">Select Class</Typography>
                    <Select
                        fullWidth
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(Number(e.target.value))}
                    >
                        <MenuItem value={0} disabled>
                            Select Class
                        </MenuItem>
                        {classes.map((cls) => (
                            <MenuItem key={cls.id} value={cls.id}>
                                {cls.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                {selectedClass !== 0 && (
                    <>
                        <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                            <Select
                                fullWidth
                                value={selectedStudentToAdd}
                                onChange={(e) => setSelectedStudentToAdd(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">Select Student</MenuItem>
                                {students
                                    .filter(
                                        (student) =>
                                            !assignedStudentIds.includes(student.id.toString())
                                    )
                                    .map((student) => (
                                        <MenuItem key={student.id} value={student.id}>
                                            {student.name}
                                        </MenuItem>
                                    ))}
                            </Select>

                            <TextField
                                fullWidth
                                placeholder="Group name (optional)"
                                value={selectedGroupToAdd}
                                onChange={(e) => setSelectedGroupToAdd(e.target.value)}
                            />

                            <Button
                                variant="contained"
                                onClick={handleAddStudentToAssignment}
                                disabled={!selectedStudentToAdd}
                            >
                                Add
                            </Button>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Student</TableCell>
                                        <TableCell>Group</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {assignments.map((assignment, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {getStudentNameById(Number(assignment.student_id))}
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    placeholder="Group name"
                                                    value={assignment.group_name}
                                                    onChange={(e) =>
                                                        handleAssignmentChange(
                                                            index,
                                                            'group_name',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => removeAssignmentRow(index)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                color="primary"
                                size="large"
                                sx={{ mt: 3 }}
                            >
                                Assign Students
                            </Button>
                        </form>
                    </>
                )}
            </Paper>
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
        </Container>
    )
}

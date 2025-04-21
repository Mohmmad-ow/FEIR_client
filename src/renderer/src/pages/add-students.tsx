import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContextProvider'
import GoBack from '@renderer/components/GoBack'
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    IconButton,
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export default function CreateStudentsPage(): JSX.Element {
    const [students, setStudents] = useState([{ name: '', image: null }])
    const { user } = useAuth()

    function handleStudentChange(index: number, field: string, value: any): void {
        const updated = [...students]
        updated[index][field] = value
        setStudents(updated)
    }

    function addStudent(): void {
        setStudents([...students, { name: '', image: null }])
    }

    function removeStudent(index: number): void {
        if (students.length > 1) {
            setStudents(students.filter((_, i) => i !== index))
        }
    }

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault()
        for (const student of students) {
            const formData = new FormData()
            formData.append('name', student.name)
            formData.append('image', student.image)

            const res = await fetch('http://localhost:8000/students/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                    Accept: 'application/json'
                },
                body: formData
            })
            const data = await res.json()
            if (data.status === 401) {
                alert('Session expired, please login again')
                window.localStorage.removeItem('userData')
                window.location.href = '/login'
                return
            }
        }
        alert('Students uploaded successfully!')
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <GoBack />
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Upload Students
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((student, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <TextField
                                            required
                                            fullWidth
                                            value={student.name}
                                            onChange={(e) =>
                                                handleStudentChange(index, 'name', e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            required
                                            onChange={(e) =>
                                                handleStudentChange(index, 'image', e.target.files?.[0])
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="error"
                                            onClick={() => removeStudent(index)}
                                            disabled={students.length === 1}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Box display="flex" justifyContent="space-between" mt={3}>
                        <Button variant="contained" onClick={addStudent} color="success">
                            + Add Student
                        </Button>
                        <Button variant="contained" type="submit" color="primary">
                            Upload Students
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    )
}

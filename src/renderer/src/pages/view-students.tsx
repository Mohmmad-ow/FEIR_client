import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContextProvider'
import GoBack from '@renderer/components/GoBack'

import {
    Avatar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Container,
    CircularProgress,
    Box,
    Paper
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

type Class_ = {
    id: number
    name: string
    college: string
    department: string
    year: number
}

type Student = {
    id: number
    name: string
    image_uri: string
    classes: Class_[]
}

export default function ViewClassesPage(): JSX.Element {
    const { user } = useAuth()
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/students/all-info', {
                    headers: {
                        Authorization: `Bearer ${user?.access_token}`,
                        'Content-Type': 'application/json'
                    }
                })
                const data = await res.json()
                console.log('Students:', data)
                if (res.status === 401 || data?.detail === 'Unauthorized') {
                    alert('Session expired, please login again')
                    localStorage.removeItem('userData')
                    window.location.href = '/login'
                    return
                }

                setStudents(data)
            } catch (error) {
                console.error('Failed to fetch students:', error)
            } finally {
                setLoading(false)
            }
        }

        getData()
    }, [user])

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <GoBack />
            <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
                Students and Their Classes
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
                    <CircularProgress />
                </Box>
            ) : (
                students.map((student) => (
                    <Accordion key={student.id} sx={{ mb: 2 }} TransitionProps={{ unmountOnExit: true }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar src={student.image_uri} alt={student.name} />
                                <Typography fontWeight="medium">{student.name}</Typography>
                            </Box>
                        </AccordionSummary>

                        <AccordionDetails>
                            {student.classes.length === 0 ? (
                                <Typography color="text.secondary">No classes assigned.</Typography>
                            ) : (
                                <Paper elevation={1}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Class Name</strong></TableCell>
                                                <TableCell><strong>College</strong></TableCell>
                                                <TableCell><strong>Department</strong></TableCell>
                                                <TableCell><strong>Year</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {student.classes.map((cls) => (
                                                <TableRow key={cls.id}>
                                                    <TableCell>{cls.name}</TableCell>
                                                    <TableCell>{cls.college}</TableCell>
                                                    <TableCell>{cls.department}</TableCell>
                                                    <TableCell>{cls.year}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
        </Container>
    )
}

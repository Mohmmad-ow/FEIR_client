import React, { useEffect, useState } from 'react'
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    CircularProgress,
    Container,
    Avatar,
    Grid,
    Box,
    Card,
    CardContent
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useAuth } from '../../context/AuthContextProvider'
import GoBack from '@renderer/components/GoBack'

type Student = {
    id: number
    name: string
    group: string | null
    image_uri?: string
}

type ClassItem = {
    class_id: number
    class_name: string
    college: string
    department: string
    year: number
    total_students: number
    group_counts: Record<string, number>
    students: Student[]
}

export default function ViewClassesPage(): JSX.Element {
    const { user } = useAuth()
    const [classes, setClasses] = useState<ClassItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/classes/full-info', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${user?.access_token}`,
                        'Content-Type': 'application/json'
                    }
                })
                const data = await res.json()
                console.log('Classes:', data)
                if (res.status === 401 || data?.detail === 'Unauthorized') {
                    alert('Session expired, please login again')
                    localStorage.removeItem('userData')
                    window.location.href = '/login'
                    return
                }

                setClasses(data)
            } catch (error) {
                console.error('Failed to fetch classes:', error)
            } finally {
                setLoading(false)
            }
        }

        getData()
    }, [])

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <GoBack />
            <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                View Classes
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {classes.map((cls) => (
                        <Accordion key={cls.class_id}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box display="flex" flexDirection="column" width="100%">
                                    <Typography variant="h6" fontWeight="bold">
                                        {cls.class_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        College: {cls.college} | Department: {cls.department} |
                                        Year: {cls.year}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                                        Students: {cls.total_students} | Groups:{' '}
                                        {Object.keys(cls.group_counts).length}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                {cls.students.length === 0 ? (
                                    <Typography>No students in this class.</Typography>
                                ) : (
                                    <Grid container spacing={2}>
                                        {cls.students.map((student) => (
                                            <Grid item xs={12} sm={6} md={4} key={student.id}>
                                                <Card variant="outlined">
                                                    <CardContent
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <Avatar
                                                            src={student.image_uri || undefined}
                                                            alt={student.name}
                                                            sx={{ width: 56, height: 56, mr: 2 }}
                                                        />
                                                        <Box>
                                                            <Typography
                                                                variant="subtitle1"
                                                                fontWeight="medium"
                                                            >
                                                                {student.name}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                Group: {student.group || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </>
            )}
        </Container>
    )
}

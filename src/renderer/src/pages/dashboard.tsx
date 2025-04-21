import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContextProvider'
import Navbar from '@renderer/components/navbar'
import AttendanceList from '@renderer/components/AttendenceList'

import { Box, Button, Container, Typography, Stack, Paper, Fade } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SchoolIcon from '@mui/icons-material/School'

export default function Dashboard(): JSX.Element {
    const router = useNavigate()
    const { addMissingUserData } = useAuth()

    useEffect(() => {
        const getData = async () => {
            try {
                const storedData = window.localStorage.getItem('userData')
                if (!storedData) {
                    router('/login')
                    return
                }

                const data = JSON.parse(storedData)
                if (!data?.access_token) {
                    router('/login')
                    return
                }

                const response = await fetch('http://127.0.0.1:8000', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${data.access_token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (response.status === 401) {
                    alert('Session expired, please login again')
                    window.localStorage.removeItem('userData')
                    router('/login')
                    return
                }

                if (!response.ok) {
                    console.error('Failed to fetch data:', response.statusText)
                    return
                }

                const res = await response.json()
                const userData = res.user[0]
                addMissingUserData(userData.username, userData.fullname, userData.isAdmin)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        getData()
    }, [])

    return (
        <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            <Navbar />

            <Container maxWidth="lg" sx={{ mt: 6 }}>
                <Fade in timeout={500}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={4}
                        >
                            <Typography variant="h4" fontWeight={600}>
                                Dashboard
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => router('/process-attendance')}
                            >
                                New Attendance Record
                            </Button>
                        </Stack>

                        <AttendanceList />

                        <Box mt={5}>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<SchoolIcon />}
                                onClick={() => router('/class-info')}
                                sx={{ px: 4, py: 1.5, borderRadius: 3 }}
                            >
                                Class Info
                            </Button>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    )
}
